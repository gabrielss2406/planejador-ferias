import { expect, test } from 'vitest';
// @ts-ignore: public/site.js é JS puro, carregado direto no navegador
import * as ads from '../../public/site.js';

/** DOM mínimo: o bastante para o consentimento e os espaços de anúncio. */
function fakeEl(tag: string): any {
  const attrs: Record<string, string> = {};
  const el: any = {
    tag, children: [] as any[], style: {} as Record<string, string>, hidden: false, className: '', textContent: '', attrs, listeners: {} as Record<string, () => void>,
    setAttribute: (k: string, v: string) => { attrs[k] = v; },
    getAttribute: (k: string) => (k in attrs ? attrs[k] : null),
    appendChild(c: any) { el.children.push(c); c.parent = el; return c; },
    append(...cs: any[]) { cs.forEach((c) => el.appendChild(c)); },
    addEventListener: (ev: string, fn: () => void) => { el.listeners[ev] = fn; },
    remove() { if (el.parent) el.parent.children = el.parent.children.filter((c: any) => c !== el); },
    click() { el.listeners.click?.(); },
  };
  return el;
}

function setup({ client = 'ca-pub-1', choice = null as string | null, slots = ['111'] } = {}) {
  const store = new Map<string, string>(choice ? [['planejador-ferias-ads-v1', choice]] : []);
  const head = fakeEl('head'), body = fakeEl('body');
  const boxes = slots.map((s) => { const b = fakeEl('aside'); b.setAttribute('data-ad-slot', s); b.hidden = true; return b; });
  const doc: any = {
    head, body, createElement: fakeEl,
    querySelector: (sel: string) => {
      if (sel === 'meta[name="adsense-client"]') return client ? { getAttribute: () => client } : null;
      if (sel === '.cb') return body.children.find((c: any) => c.className === 'cb') ?? null;
      return null;
    },
    querySelectorAll: (sel: string) => (sel === '[data-ad-slot]' ? boxes : []),
  };
  const win: any = {
    localStorage: { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => { store.set(k, v); } },
    location: { reload: () => {} },
  };
  const banner = () => body.children.find((c: any) => c.className === 'cb');
  const scripts = () => head.children.filter((c: any) => c.tag === 'script');
  return { win, doc, store, boxes, banner, scripts };
}

test('sem ID de AdSense na página: não faz nada (nem banner)', () => {
  const t = setup({ client: '' });
  ads.init(t.win, t.doc);
  expect(t.banner()).toBeUndefined();
  expect(t.scripts()).toHaveLength(0);
});

test('ID configurado e nenhum espaço na página: pede consentimento e só carrega depois da escolha (anúncios automáticos)', () => {
  const t = setup({ slots: [] });
  ads.init(t.win, t.doc);
  expect(t.banner()).toBeTruthy();
  expect(t.scripts()).toHaveLength(0);
  t.banner().children[1].children[0].click(); // Aceitar
  expect(t.scripts()).toHaveLength(1);
});

test('antes da escolha: mostra o banner e não carrega anúncio nenhum', () => {
  const t = setup();
  ads.init(t.win, t.doc);
  expect(t.banner()).toBeTruthy();
  expect(t.scripts()).toHaveLength(0);
  expect(t.win.adsbygoogle).toBeUndefined();
  expect(t.boxes[0].hidden).toBe(true);
});

test('aceitar: carrega o AdSense com personalização, grava a escolha e preenche os espaços', () => {
  const t = setup();
  ads.init(t.win, t.doc);
  t.banner().children[1].children[0].click(); // Aceitar
  expect(t.store.get('planejador-ferias-ads-v1')).toBe('aceito');
  expect(t.scripts()).toHaveLength(1);
  expect(t.scripts()[0].src).toContain('client=ca-pub-1');
  expect(t.win.adsbygoogle.requestNonPersonalizedAds).toBeUndefined();
  expect(t.boxes[0].hidden).toBe(false);
  expect(t.boxes[0].children[0].attrs['data-ad-slot']).toBe('111');
  expect(t.banner()).toBeUndefined();
});

test('recusar: carrega o AdSense só em modo não personalizado', () => {
  const t = setup();
  ads.init(t.win, t.doc);
  t.banner().children[1].children[1].click(); // Recusar
  expect(t.store.get('planejador-ferias-ads-v1')).toBe('recusado');
  expect(t.scripts()).toHaveLength(1);
  expect(t.win.adsbygoogle.requestNonPersonalizedAds).toBe(1);
});

test('escolha já feita: não pergunta de novo e aplica direto; carrega o script uma vez só', () => {
  const t = setup({ choice: 'recusado' });
  ads.init(t.win, t.doc);
  ads.init(t.win, t.doc);
  expect(t.banner()).toBeUndefined();
  expect(t.scripts()).toHaveLength(1);
  expect(t.win.adsbygoogle.requestNonPersonalizedAds).toBe(1);
  expect(t.boxes[0].children).toHaveLength(1);
});

test('readChoice ignora valor estranho e storage quebrado', () => {
  expect(ads.readChoice({ getItem: () => 'talvez' })).toBeNull();
  expect(ads.readChoice({ getItem: () => { throw new Error('bloqueado'); } })).toBeNull();
  expect(() => ads.saveChoice({ setItem: () => { throw new Error('bloqueado'); } }, 'aceito')).not.toThrow();
});
