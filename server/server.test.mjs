import { createServer } from 'node:http';
import { afterEach, expect, test } from 'vitest';
import { createApp } from './app.mjs';
import { MAX_MEMBERS, openStore } from './store.mjs';

const plan = (over = {}) => ({
  id: '2027:5', year: 2027, N: 30, off: 45, k: 1, savedAt: 1,
  periods: [{ s: 100, e: 129, L: 30, xs: 98, xe: 131 }], ...over,
});
const ID = (n) => `member-${String(n).padStart(4, '0')}-abcdef`;

let store, srv;
afterEach(async () => {
  store?.close();
  if (srv) await new Promise((ok) => srv.close(ok));
  store = srv = undefined;
});

test('cria sala com código de 5 dígitos e lista membros sem expor o id', () => {
  store = openStore();
  const code = store.createRoom();
  expect(code).toMatch(/^\d{5}$/);
  expect(store.upsertMember(code, ID(1), { name: ' Ana ', plan: plan() })).toBe('ok');
  expect(store.upsertMember(code, ID(2), { name: 'Bia', plan: null })).toBe('ok');
  const list = store.getRoom(code, ID(1));
  expect(list).toHaveLength(2);
  expect(list.find((m) => m.name === 'Ana')).toMatchObject({ me: true, plan: { off: 45 } });
  expect(list.find((m) => m.name === 'Bia')).toMatchObject({ me: false, plan: null });
  expect(JSON.stringify(list)).not.toContain(ID(1));
});

test('atualiza o mesmo membro em vez de duplicar, e remove', () => {
  store = openStore();
  const code = store.createRoom();
  store.upsertMember(code, ID(1), { name: 'Ana', plan: null });
  store.upsertMember(code, ID(1), { name: 'Ana C.', plan: plan() });
  expect(store.getRoom(code, '')).toHaveLength(1);
  expect(store.getRoom(code, '')[0]).toMatchObject({ name: 'Ana C.', plan: { year: 2027 } });
  expect(store.removeMember(code, ID(1))).toBe(true);
  expect(store.getRoom(code, '')).toEqual([]);
});

test('valida sala, nome, plano e limite de membros', () => {
  store = openStore();
  expect(store.getRoom('12345', '')).toBeNull();
  expect(store.upsertMember('12345', ID(1), { name: 'Ana' })).toBe('not_found');
  const code = store.createRoom();
  expect(store.upsertMember(code, ID(1), { name: '  ' })).toBe('invalid');
  expect(store.upsertMember(code, 'curto', { name: 'Ana' })).toBe('invalid');
  expect(store.upsertMember(code, ID(1), { name: 'Ana', plan: { off: 1 } })).toBe('invalid');
  expect(store.upsertMember(code, ID(1), { name: 'Ana', plan: plan({ periods: [] }) })).toBe('invalid');
  for (let i = 0; i < MAX_MEMBERS; i++) expect(store.upsertMember(code, ID(i), { name: `P${i}` })).toBe('ok');
  expect(store.upsertMember(code, ID(99), { name: 'Extra' })).toBe('full');
  expect(store.upsertMember(code, ID(3), { name: 'Já estava' })).toBe('ok');
});

test('salas sem uso há mais de 90 dias são apagadas', () => {
  let t = 1_000_000_000_000;
  store = openStore(':memory:', () => t);
  const velha = store.createRoom();
  t += 91 * 864e5;
  const nova = store.createRoom();
  expect(store.sweep()).toBe(1);
  expect(store.getRoom(velha, '')).toBeNull();
  expect(store.getRoom(nova, '')).toEqual([]);
});

async function listen(opts) {
  store = openStore();
  srv = createServer(createApp(store, opts));
  await new Promise((ok) => srv.listen(0, '127.0.0.1', ok));
  const base = `http://127.0.0.1:${srv.address().port}`;
  return (path, init) => fetch(base + path, init);
}
const put = (body) => ({ method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

test('API: criar sala, entrar, publicar, ler e sair', async () => {
  const f = await listen();
  const { code } = await (await f('/api/rooms', { method: 'POST' })).json();
  expect(code).toMatch(/^\d{5}$/);
  expect((await f(`/api/rooms/${code}/members/${ID(1)}`, put({ name: 'Ana', plan: plan() }))).status).toBe(200);
  const got = await (await f(`/api/rooms/${code}`, { headers: { 'x-member-id': ID(1) } })).json();
  expect(got.members).toMatchObject([{ name: 'Ana', me: true, plan: { off: 45 } }]);
  expect((await f(`/api/rooms/${code}/members/${ID(1)}`, { method: 'DELETE' })).status).toBe(200);
  expect((await (await f(`/api/rooms/${code}`)).json()).members).toEqual([]);
});

test('API: erros claros para código inválido, sala inexistente, corpo grande e excesso de pedidos', async () => {
  const f = await listen({ maxPerMinute: 12 });
  expect((await f('/api/rooms/abc')).status).toBe(400);
  expect((await f('/api/rooms/00000')).status).toBe(404);
  expect((await f(`/api/rooms/00000/members/${ID(1)}`, put({ name: 'Ana' }))).status).toBe(404);
  const { code } = await (await f('/api/rooms', { method: 'POST' })).json();
  expect((await f(`/api/rooms/${code}/members/${ID(1)}`, put({ name: 'x'.repeat(5000) }))).status).toBe(413);
  expect((await f(`/api/rooms/${code}/members/${ID(1)}`, { method: 'PUT', body: '{nao json' })).status).toBe(400);
  const codes = [];
  for (let i = 0; i < 8; i++) codes.push((await f('/api/rooms/00000')).status);
  expect(codes).toContain(429);
});
