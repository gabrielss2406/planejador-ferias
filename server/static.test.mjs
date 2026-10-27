import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { createApp } from './app.mjs';
import { openStore } from './store.mjs';

let dir, srv, store, base;
beforeEach(async () => {
  dir = mkdtempSync(join(tmpdir(), 'ferias-dist-'));
  mkdirSync(join(dir, 'guia'));
  mkdirSync(join(dir, 'assets'));
  writeFileSync(join(dir, 'index.html'), '<h1>app</h1>');
  writeFileSync(join(dir, '404.html'), '<h1>nao achei</h1>');
  writeFileSync(join(dir, 'guia', 'index.html'), '<h1>guia</h1>');
  writeFileSync(join(dir, 'assets', 'a-123.js'), 'console.log(1)');
  writeFileSync(join(dir, 'robots.txt'), 'User-agent: *');
  writeFileSync(join(dir, 'sitemap.xml'), '<urlset/>');
  store = openStore();
  srv = createServer(createApp(store, { distDir: dir }));
  await new Promise((ok) => srv.listen(0, '127.0.0.1', ok));
  base = `http://127.0.0.1:${srv.address().port}`;
});
afterEach(async () => {
  store.close();
  await new Promise((ok) => srv.close(ok));
  rmSync(dir, { recursive: true, force: true });
});

const get = (path, init) => fetch(base + path, { redirect: 'manual', ...init });

test('raiz serve o app e pasta de página serve o index dela', async () => {
  expect(await (await get('/')).text()).toBe('<h1>app</h1>');
  const r = await get('/guia/');
  expect(r.status).toBe(200);
  expect(r.headers.get('content-type')).toContain('text/html');
  expect(r.headers.get('cache-control')).toBe('no-cache');
  expect(await r.text()).toBe('<h1>guia</h1>');
});

test('pasta sem barra final redireciona com 301 para a versão com barra', async () => {
  const r = await get('/guia');
  expect(r.status).toBe(301);
  expect(r.headers.get('location')).toBe('/guia/');
});

test('caminho que não existe é 404 de verdade com a página 404, não o app', async () => {
  const r = await get('/nao-existe');
  expect(r.status).toBe(404);
  expect(await r.text()).toBe('<h1>nao achei</h1>');
  expect((await get('/guia/outra/')).status).toBe(404);
});

test('arquivos estáticos: tipo certo e cache longo só em /assets/', async () => {
  const js = await get('/assets/a-123.js');
  expect(js.headers.get('cache-control')).toContain('immutable');
  const txt = await get('/robots.txt');
  expect(txt.headers.get('content-type')).toContain('text/plain');
  expect(txt.headers.get('cache-control')).toBe('no-cache');
  expect((await get('/sitemap.xml')).headers.get('content-type')).toContain('application/xml');
});

test('não sai da pasta do site', async () => {
  const r = await get('/%2e%2e/%2e%2e/package.json');
  expect([403, 404]).toContain(r.status);
  expect(await r.text()).not.toContain('"name"');
});
