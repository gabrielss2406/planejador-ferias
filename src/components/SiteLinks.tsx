import site from '../../site.config.json';

/** Rodapé do app: leva para as páginas de conteúdo (e reabre as preferências de anúncios, se houver anúncios). */
const adsOn = !!site.adsenseClient && Object.values(site.slots).some(Boolean);

export function SiteLinks({ year }: { year: number }) {
  const y = [2026, 2027, 2028].includes(year) ? year : 2027;
  return (
    <>
      {site.adsenseClient && site.slots.app && <aside className="c-ad" data-ad-slot={site.slots.app} aria-label="Publicidade" hidden><span>Publicidade</span></aside>}
      <nav className="site-foot" aria-label="Links do site">
        <a href="/guia-ferias-clt/">Guia de férias pela CLT</a>
        <a href={`/feriados-${y}/`}>Feriados {y}</a>
        <a href={`/melhores-datas-ferias-${y}/`}>Melhores datas em {y}</a>
        <a href="/sobre/">Sobre</a>
        <a href="/contato/">Contato</a>
        <a href="/privacidade/">Privacidade</a>
        <a href="/termos/">Termos</a>
        {adsOn && <button type="button" data-consent-open>Preferências de anúncios</button>}
      </nav>
    </>
  );
}
