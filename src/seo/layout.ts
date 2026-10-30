export interface SiteConfig {
  siteUrl: string;
  siteName: string;
  adsenseClient: string;
  slots: { content: string; footer: string; app: string };
  contactEmail: string;
}

/** Arquivos do build do app que as páginas reaproveitam (CSS com as fontes e o logo, com hash no nome). */
export interface Assets { css: string; logo: string; favicon: string }

export interface Crumb { name: string; path: string }

export interface PageSpec {
  /** caminho público com barras nas pontas, ex.: /guia-ferias-clt/ */
  path: string;
  title: string;
  description: string;
  h1: string;
  /** HTML do corpo (já escapado) */
  body: string;
  crumbs?: Crumb[];
  related?: { href: string; label: string }[];
  /** objetos extras de JSON-LD (o BreadcrumbList sai das migalhas) */
  jsonLd?: object[];
  /** og:type; o padrão é article (guias e consultas) */
  og?: 'website';
  /** fica fora do índice do Google e do sitemap */
  noindex?: boolean;
  /** ISO AAAA-MM-DD */
  updated: string;
}

export const esc = (s: string) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const abs = (cfg: SiteConfig, path: string) => cfg.siteUrl.replace(/\/$/, '') + path;

/** Espaço de anúncio: só existe se o AdSense e o slot estiverem configurados; o site.js o preenche depois do consentimento. */
export function adSlot(cfg: SiteConfig, name: 'content' | 'footer') {
  if (!cfg.adsenseClient || !cfg.slots[name]) return '';
  return `<aside class="c-ad" data-ad-slot="${esc(cfg.slots[name])}" aria-label="Publicidade" hidden><span>Publicidade</span></aside>`;
}

const CSS = `
.c-page{width:min(100%,840px);margin:0 auto;padding:20px var(--pad) 40px;display:flex;flex-direction:column;gap:16px}
.c-crumbs{font:500 var(--t-corpo) var(--cond);color:var(--sobre-grafite)}
.c-crumbs ol{display:flex;flex-wrap:wrap;gap:2px 8px}
.c-crumbs li+li::before{content:"/";margin-right:8px;color:var(--picote)}
.c-crumbs a{color:var(--papel);text-decoration:underline;text-underline-offset:3px;text-decoration-color:var(--picote)}
.c-sheet{background:var(--papel);color:var(--tinta);border-radius:8px;padding:24px var(--pad);box-shadow:0 8px 14px -8px rgb(0 0 0 / .55)}
.c-sheet h1{font:800 clamp(30px,6vw,44px)/1.08 var(--cond);letter-spacing:-.005em;margin-bottom:12px;text-wrap:balance}
.c-sheet h2{font:700 28px/1.15 var(--cond);margin:28px 0 8px;text-wrap:balance}
.c-sheet h3{font:700 22px/1.2 var(--cond);margin:18px 0 6px}
.c-sheet p,.c-sheet li{font:500 19px/1.5 var(--cond);max-width:70ch;text-wrap:pretty}
.c-sheet p+p{margin-top:10px}
.c-sheet ul,.c-sheet ol{display:grid;gap:6px;margin:8px 0 8px 1.2em;list-style:disc}
.c-sheet ol{list-style:decimal}
.c-sheet a{color:var(--azul-escuro);text-underline-offset:3px}
.c-sheet .lede{font-size:22px;color:var(--tinta-2)}
.c-sheet .note{background:var(--ambar-claro);border-radius:4px;padding:10px 12px;margin:14px 0}
.c-sheet .mono{font-weight:700;font-size:17px}
.c-table{width:100%;border-collapse:collapse;margin:8px 0;font:500 18px/1.35 var(--cond)}
.c-table th,.c-table td{text-align:left;padding:8px 10px;border-top:1px solid var(--trilho);vertical-align:top}
.c-table th{font-weight:700;color:var(--tinta-2);font-size:16px;border-top:0}
.c-wrap{overflow-x:auto}
.c-plan{border:1px solid var(--trilho);border-radius:6px;padding:12px 14px;margin:10px 0}
.c-plan b.big{font:800 40px/1 var(--mono)}
.c-cta{display:inline-flex;align-items:center;min-height:52px;padding:0 28px;margin-top:14px;background:var(--azul);color:var(--papel)!important;border-radius:4px;font:700 21px var(--cond);text-decoration:none}
.c-cta:hover{background:var(--azul-escuro)}
.c-faq dt{font:700 21px/1.25 var(--cond);margin-top:14px}
.c-faq dd{margin:4px 0 0}
.c-related{color:var(--papel)}
.c-related h2{font:700 var(--t-tit)/1.15 var(--cond);margin-bottom:6px}
.c-related ul{display:flex;flex-wrap:wrap;gap:6px 18px}
.c-related a,.c-foot a,.c-foot button{color:var(--papel);text-underline-offset:3px;text-decoration-color:var(--picote)}
.c-foot{border-top:1px solid var(--divisor-escuro);padding:18px var(--pad) 32px;width:min(100%,840px);margin:0 auto;font:500 var(--t-corpo)/1.4 var(--cond);color:var(--sobre-grafite);display:grid;gap:8px}
.c-foot nav{display:flex;flex-wrap:wrap;gap:4px 18px}
.c-foot button{background:none;border:0;padding:0;font:inherit;text-decoration:underline;cursor:pointer}
`;

/** Monta a página completa (HTML) a partir da especificação. */
export function renderPage(spec: PageSpec, cfg: SiteConfig, assets: Assets): string {
  const url = abs(cfg, spec.path);
  const crumbs = [{ name: cfg.siteName, path: '/' }, ...(spec.crumbs ?? []), { name: spec.h1, path: spec.path }];
  const ld = [
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(cfg, c.path) })),
    },
    ...(spec.jsonLd ?? []),
  ];
  const meta = [
    `<meta name="description" content="${esc(spec.description)}">`,
    `<link rel="canonical" href="${esc(url)}">`,
    spec.noindex ? '<meta name="robots" content="noindex">' : '<meta name="robots" content="index,follow,max-image-preview:large">',
    `<meta property="og:type" content="${spec.og ?? 'article'}">`,
    `<meta property="og:title" content="${esc(spec.title)}">`,
    `<meta property="og:description" content="${esc(spec.description)}">`,
    `<meta property="og:url" content="${esc(url)}">`,
    `<meta property="og:site_name" content="${esc(cfg.siteName)}">`,
    '<meta property="og:locale" content="pt_BR">',
    '<meta name="twitter:card" content="summary">',
    cfg.adsenseClient ? `<meta name="google-adsense-account" content="${esc(cfg.adsenseClient)}">` : '',
    cfg.adsenseClient ? `<meta name="adsense-client" content="${esc(cfg.adsenseClient)}">` : '',
  ].filter(Boolean).join('\n');
  const trail = crumbs.slice(0, -1).map((c) => `<li><a href="${esc(c.path)}">${esc(c.name)}</a></li>`).join('') + `<li aria-current="page">${esc(spec.h1)}</li>`;
  const related = spec.related?.length
    ? `<nav class="c-related" aria-label="Veja também"><h2>Veja também</h2><ul>${spec.related.map((r) => `<li><a href="${esc(r.href)}">${esc(r.label)}</a></li>`).join('')}</ul></nav>`
    : '';
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(spec.title)}</title>
${meta}
<meta name="theme-color" content="#101820">
<link rel="icon" type="image/png" href="${esc(assets.favicon)}">
<link rel="stylesheet" href="${esc(assets.css)}">
<style>${CSS}</style>
${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n')}
</head>
<body>
<header class="top"><a class="brand" href="/"><img src="${esc(assets.logo)}" alt="${esc(cfg.siteName)}"></a><p class="slogan">Mais tempo para o que importa</p></header>
<main class="c-page">
<nav class="c-crumbs" aria-label="Você está em"><ol>${trail}</ol></nav>
<article class="c-sheet">
<h1>${esc(spec.h1)}</h1>
${spec.body}
<p class="note"><strong>Quem define a época das férias é o empregador (CLT, art. 136).</strong> Use estas datas como proposta para negociar. Este conteúdo é informativo e não substitui orientação jurídica.</p>
<p style="color:var(--tinta-2);font-size:16px">Atualizado em ${esc(spec.updated.split('-').reverse().join('/'))}.</p>
</article>
${related}
</main>
<footer class="c-foot">
<nav aria-label="Links do site"><a href="/">Planejador</a><a href="/guia-ferias-clt/">Guia de férias pela CLT</a><a href="/sobre/">Sobre</a><a href="/contato/">Contato</a><a href="/privacidade/">Privacidade</a><a href="/termos/">Termos</a>${cfg.adsenseClient ? '<button type="button" data-consent-open>Preferências de anúncios</button>' : ''}</nav>
<p>${esc(cfg.siteName)}: mais tempo para o que importa.</p>
</footer>
<script type="module" src="/site.js"></script>
</body>
</html>
`;
}
