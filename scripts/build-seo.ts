// @ts-nocheck - script de build rodado pelo vite-node, fora do tsconfig do app
// Gera as páginas de conteúdo (guia, feriados, melhores datas, estados, privacidade), sitemap, robots e ads.txt em dist/.
// Roda depois do `vite build`: npm run build.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import cfg from '../site.config.json';
import { renderPage, type Assets } from '../src/seo/layout';
import { adsTxt, allPages, notFoundPage, robotsTxt, sitemapXml } from '../src/seo/pages';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
if (!existsSync(resolve(dist, 'index.html'))) throw new Error('dist/index.html não existe: rode vite build antes.');

const html = readFileSync(resolve(dist, 'index.html'), 'utf8');
const css = html.match(/href="(\/assets\/[^"]+\.css)"/)?.[1];
const logoFile = readdirSync(resolve(dist, 'assets')).find((f) => /^logo-negativo-.*\.png$/.test(f));
if (!css || !logoFile) throw new Error('não achei o CSS ou o logo no build do app.');
const assets: Assets = { css, logo: `/assets/${logoFile}`, favicon: '/favicon.png' };

const updated = new Date().toISOString().slice(0, 10);
const pages = allPages(cfg, updated);
const notFound = notFoundPage(updated);

const titles = new Set<string>();
for (const p of pages) {
  if (titles.has(p.title)) throw new Error(`título repetido: ${p.title}`);
  titles.add(p.title);
  const file = resolve(dist, p.path.replace(/^\//, ''), 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, renderPage(p, cfg, assets));
}
writeFileSync(resolve(dist, '404.html'), renderPage(notFound, cfg, assets));
writeFileSync(resolve(dist, 'sitemap.xml'), sitemapXml(cfg, pages, updated));
writeFileSync(resolve(dist, 'robots.txt'), robotsTxt(cfg));
const ads = adsTxt(cfg);
if (ads) writeFileSync(resolve(dist, 'ads.txt'), ads);

const indexed = pages.filter((p) => !p.noindex).length;
console.log(`SEO: ${pages.length} páginas (${indexed} no sitemap), 404, robots.txt${ads ? ', ads.txt' : ''}.`);
if (!cfg.contactEmail) console.warn('AVISO: site.config.json sem contactEmail; a política de privacidade pede um contato para a LGPD.');
if (!cfg.adsenseClient) console.log('Anúncios desligados (adsenseClient vazio em site.config.json).');
