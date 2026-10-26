import type { PlanOption, PlanResult } from '../lib/types';
import { plural } from './format';

interface Props {
  selected: PlanOption | null;
  result: PlanResult;
}

export function Hero({ selected, result }: Props) {
  const ok = selected && !result.error && selected.off > 0;
  if (!ok) {
    return (
      <section className="hero" aria-label="Resumo do plano">
        <h2 className="hero-brand">Planeje suas férias de forma simples e segura</h2>
      </section>
    );
  }
  const K = selected.periods.length;
  return (
    <section className="hero" aria-label="Resumo do plano">
      <span className="hero-big" aria-hidden="true">{selected.off}</span>
      <p className="hero-text" aria-live="polite">
        <span className="hero-unit"><span className="sr">{selected.off} </span>dias fora do trabalho</span>
        <span className="sr">. </span>
        <span className="hero-sub">
          {plural(result.N, 'dia', 'dias')} de férias, {selected.gain > 0 ? `+${selected.gain} ${selected.gain === 1 ? 'emendado' : 'emendados'}, ` : ''}{plural(K, 'período', 'períodos')}
        </span>
      </p>
    </section>
  );
}
