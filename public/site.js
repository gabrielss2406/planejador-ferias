// Anúncios com consentimento: usado pelas páginas de conteúdo e pelo app (carregado como módulo).
// Nada de anúncio carrega antes da escolha da pessoa. Sem ID de AdSense na página (meta adsense-client), não faz nada.
const KEY = 'planejador-ferias-ads-v1';

export function readChoice(storage) {
  try {
    const v = storage.getItem(KEY);
    return v === 'aceito' || v === 'recusado' ? v : null;
  } catch { return null; }
}

export function saveChoice(storage, value) {
  try { storage.setItem(KEY, value); } catch { /* sem armazenamento: a escolha vale só nesta página */ }
}

/** Carrega o script do AdSense uma única vez. `personalized` false = anúncios não personalizados. */
export function loadAds(win, doc, client, personalized) {
  if (win.__adsLoaded) return;
  win.__adsLoaded = true;
  win.adsbygoogle = win.adsbygoogle || [];
  if (!personalized) win.adsbygoogle.requestNonPersonalizedAds = 1;
  const s = doc.createElement('script');
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(client);
  doc.head.appendChild(s);
}

/** Preenche os espaços `[data-ad-slot]` (já rotulados "Publicidade" na página). */
export function fillSlots(win, doc, client) {
  doc.querySelectorAll('[data-ad-slot]').forEach((box) => {
    const slot = box.getAttribute('data-ad-slot');
    if (!slot || box.getAttribute('data-filled')) return;
    const ins = doc.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.setAttribute('data-ad-client', client);
    ins.setAttribute('data-ad-slot', slot);
    ins.setAttribute('data-ad-format', 'auto');
    ins.setAttribute('data-full-width-responsive', 'true');
    box.appendChild(ins);
    box.hidden = false;
    box.setAttribute('data-filled', '1');
    (win.adsbygoogle = win.adsbygoogle || []).push({});
  });
}

/** Banner de consentimento: as duas opções têm o mesmo peso visual. */
export function showBanner(doc, onChoose) {
  doc.querySelector('.cb')?.remove();
  const box = doc.createElement('div');
  box.className = 'cb';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', 'Anúncios e privacidade');
  const p = doc.createElement('p');
  p.textContent = 'Este site é gratuito e mostra anúncios. Se você aceitar, o Google pode usar cookies para personalizá-los. Se recusar, mostramos anúncios não personalizados. ';
  const a = doc.createElement('a');
  a.href = '/privacidade/';
  a.textContent = 'Política de privacidade';
  p.appendChild(a);
  const row = doc.createElement('div');
  for (const [label, value] of [['Aceitar', 'aceito'], ['Recusar', 'recusado']]) {
    const b = doc.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.addEventListener('click', () => { box.remove(); onChoose(value); });
    row.appendChild(b);
  }
  box.append(p, row);
  doc.body.appendChild(box);
  return box;
}

export function init(win, doc) {
  const client = doc.querySelector('meta[name="adsense-client"]')?.getAttribute('content');
  // sem espaço de anúncio na página não há o que consentir: nem banner
  if (!client || !doc.querySelectorAll('[data-ad-slot]').length) return;
  const apply = (choice) => {
    loadAds(win, doc, client, choice === 'aceito');
    fillSlots(win, doc, client);
  };
  const choice = readChoice(win.localStorage);
  if (choice) apply(choice);
  else showBanner(doc, (c) => { saveChoice(win.localStorage, c); apply(c); });
  // mudar de ideia: grava e recarrega, porque o que o Google já carregou não se desfaz
  doc.querySelectorAll('[data-consent-open]').forEach((btn) => {
    btn.addEventListener('click', () => showBanner(doc, (c) => { saveChoice(win.localStorage, c); win.location.reload(); }));
  });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init(window, document));
  else init(window, document);
}
