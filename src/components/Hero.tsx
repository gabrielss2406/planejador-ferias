import hero from '../assets/hero.webp';
import type { PlanOption, PlanResult } from '../lib/types';

interface Props {
  year: number;
  selected: PlanOption | null;
  result: PlanResult;
}

const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;

export function Hero({ selected, result }: Props) {
  const ok = selected && !result.error && selected.off > 0;
  const K = selected?.periods.length ?? 0;
  return (
    <section className="hero" style={{ '--hero-img': `url(${hero})` } as React.CSSProperties}>
      <div className="hero-body">
        {ok ? (
          <>
            <h1 className="hero-title">Planeje suas férias de forma simples e segura</h1>
            <p className="hero-num" aria-live="polite">
              <span className="hero-big">{selected.off}</span>
              <span className="hero-unit">dias fora do trabalho</span>
              <span className="hero-side">com {plural(result.N, 'dia', 'dias')} de férias</span>
            </p>
            <p className="hero-support">
              {selected.gain > 0
                ? `+${plural(selected.gain, 'dia emendado', 'dias emendados')} em ${plural(K, 'período', 'períodos')}.`
                : `${plural(K, 'período', 'períodos')} de férias.`}
            </p>
          </>
        ) : (
          <h1 className="hero-title hero-title-lg">Planeje suas férias de forma <em>simples e segura</em></h1>
        )}
        <details className="hero-how">
          <summary>Como funciona</summary>
          <p>As férias contam em dias corridos. O ganho está nas pontas: começar logo depois de um fim de semana ou feriado e terminar logo antes de outro.</p>
          <p>O planejador testa as divisões permitidas pela CLT e mostra as que mais emendam.</p>
          <p>Quem define a época das férias é o empregador (CLT, art. 136). Estas sugestões são uma proposta para você negociar.</p>
        </details>
      </div>
    </section>
  );
}
