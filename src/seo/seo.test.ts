import { expect, test } from 'vitest';
import adsRoot from '../../ads/www/ads.txt?raw';
import site from '../../site.config.json';
import { bestPlans, bridges, isConfirmed, iso, yearHolidays } from './calc';
import { renderPage, type Assets, type SiteConfig } from './layout';
import { adsTxt, allPages, paths, robotsTxt, sitemapXml } from './pages';

const cfg: SiteConfig = { ...site, adsenseClient: '', slots: { content: '', footer: '', app: '' } };
const withAds: SiteConfig = { ...cfg, adsenseClient: 'ca-pub-1234567890123456', slots: { content: '11', footer: '22', app: '33' } };
const assets: Assets = { css: '/assets/x.css', logo: '/assets/logo.png', favicon: '/favicon.png' };
const UPDATED = '2026-10-26';

test('feriados móveis de 2027 saem certos (Páscoa em 28/03)', () => {
  const h = yearHolidays(2027);
  const at = (d: string) => h.find((x) => iso(x.i) === d)?.name;
  expect(at('2027-03-26')).toBe('Sexta-feira Santa');
  expect(at('2027-02-08')).toBe('Carnaval (segunda)');
  expect(at('2027-02-09')).toBe('Carnaval (terça)');
  expect(at('2027-05-27')).toBe('Corpus Christi');
  expect(h.filter((x) => x.kind === 'nacional')).toHaveLength(10);
  expect(yearHolidays(2027, 'SP').some((x) => iso(x.i) === '2027-07-09' && x.kind === 'estadual')).toBe(true);
});

test('pontes: Tiradentes na quarta rende 5 dias com 2 de férias; Independência na terça, 4 com 1', () => {
  const b = bridges(2027);
  const f = (name: string) => b.find((x) => x.hol.name === name)!;
  expect(f('Tiradentes')).toMatchObject({ vacation: 2, off: 5 });
  expect(iso(f('Tiradentes').from)).toBe('2027-04-17');
  expect(f('Independência')).toMatchObject({ vacation: 1, off: 4 });
  expect(f('Sexta-feira Santa')).toMatchObject({ vacation: 0, off: 3 });
  expect(b.some((x) => x.hol.name === 'Dia do Trabalho')).toBe(false); // sábado: sem ponte
});

test('melhores planos públicos começam de segunda a quinta (art. 134, §3º)', () => {
  const plans = bestPlans(2027, 30);
  expect(plans.length).toBeGreaterThan(0);
  const wdOf = (i: number) => new Date(i * 864e5).getUTCDay();
  for (const p of plans) for (const q of p.periods) expect([1, 2, 3, 4]).toContain(wdOf(q.s));
});

test('todas as páginas: título e caminho únicos, só as UFs não conferidas ficam fora do índice', () => {
  const pages = allPages(cfg, UPDATED);
  expect(pages).toHaveLength(2 + 3 * (2 + 27));
  expect(new Set(pages.map((p) => p.title)).size).toBe(pages.length);
  expect(new Set(pages.map((p) => p.path)).size).toBe(pages.length);
  const hidden = pages.filter((p) => p.noindex).map((p) => p.path);
  expect(hidden.sort()).toEqual(['es', 'go', 'mg', 'mt'].flatMap((u) => [2026, 2027, 2028].map((y) => paths.estado(y, u.toUpperCase()))).sort());
  expect(isConfirmed('SP')).toBe(true);
  expect(isConfirmed('MG')).toBe(false);
});

test('links internos apontam para páginas que existem', () => {
  const pages = allPages(cfg, UPDATED);
  const known = new Set(['/', ...pages.map((p) => p.path)]);
  for (const p of pages) {
    const html = renderPage(p, cfg, assets);
    for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
      const href = m[1];
      if (/\.(css|png|js)$/.test(href)) continue;
      expect(known.has(href), `${p.path} -> ${href}`).toBe(true);
    }
  }
});

test('página: um h1, canonical absoluto, JSON-LD válido, sem anúncio quando desligado', () => {
  const p = allPages(cfg, UPDATED).find((x) => x.path === paths.guia)!;
  const html = renderPage(p, cfg, assets);
  expect(html.match(/<h1>/g)).toHaveLength(1);
  expect(html).toContain(`<link rel="canonical" href="${cfg.siteUrl}${paths.guia}">`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) expect(() => JSON.parse(m[1])).not.toThrow();
  expect(html).not.toContain('data-ad-slot');
  expect(html).not.toContain('adsense-client');
  expect(html).not.toContain('data-consent-open');
});

test('só o ID, sem slots: meta de verificação sim, anúncio e banner não', () => {
  const idOnly: SiteConfig = { ...cfg, adsenseClient: 'ca-pub-1234567890123456' };
  const html = renderPage(allPages(idOnly, UPDATED)[0], idOnly, assets);
  expect(html).toContain('<meta name="google-adsense-account" content="ca-pub-1234567890123456">');
  expect(html).not.toContain('name="adsense-client"');
  expect(html).not.toContain('data-ad-slot');
  expect(html).not.toContain('data-consent-open');
});

test('com AdSense configurado: meta, espaços rotulados "Publicidade" e botão de preferências', () => {
  const p = allPages(withAds, UPDATED).find((x) => x.path === paths.guia)!;
  const html = renderPage(p, withAds, assets);
  expect(html).toContain('<meta name="adsense-client" content="ca-pub-1234567890123456">');
  expect(html.match(/data-ad-slot="/g)).toHaveLength(2);
  expect(html).toContain('aria-label="Publicidade"');
  expect(html).toContain('data-consent-open');
});

test('o ads.txt da raiz (ads/www) bate com o gerado de site.config.json', () => {
  expect(adsRoot).toBe(adsTxt(site as SiteConfig));
});

test('sitemap, robots e ads.txt', () => {
  const pages = allPages(cfg, UPDATED);
  const xml = sitemapXml(cfg, pages, UPDATED);
  expect(xml).toContain(`<loc>${cfg.siteUrl}/</loc>`);
  expect(xml).toContain(`<loc>${cfg.siteUrl}${paths.estado(2027, 'SP')}</loc>`);
  expect(xml).not.toContain(paths.estado(2027, 'MG'));
  expect(robotsTxt(cfg)).toContain(`Sitemap: ${cfg.siteUrl}/sitemap.xml`);
  expect(adsTxt(cfg)).toBe('');
  expect(adsTxt(withAds)).toBe('google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n');
});
