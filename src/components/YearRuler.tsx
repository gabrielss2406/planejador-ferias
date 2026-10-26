import { dateOf, fmt, idx, MN } from '../lib/dates';
import type { PlanOption, PlanResult } from '../lib/types';

interface Props { year: number; selected: PlanOption | null; result: PlanResult; active: number | null }

/** Seu ano de relance: férias, dias seguidos sem trabalhar e feriados do plano escolhido. */
export function YearRuler({ year, selected, result, active }: Props) {
  const j1 = idx(year, 0, 1), total = idx(year, 11, 31) - j1 + 1;
  const pct = (i: number) => ((i - j1) / total) * 100;
  const hols = [...result.hol.keys()].filter((i) => dateOf(i).getUTCFullYear() === year);
  const label = selected
    ? `Seu ano de ${year}. Férias: ${selected.periods.map((p) => `${fmt(p.s)} a ${fmt(p.e)}`).join('; ')}. ${selected.off} dias fora do trabalho. ${hols.length} feriados no ano.`
    : `Seu ano de ${year}, sem plano para mostrar. ${hols.length} feriados no ano.`;
  return (
    <section className="ruler" aria-labelledby="ano-t">
      <h2 id="ano-t">Seu ano de relance</h2>
      <div className="ruler-in">
        <div className="ruler-months" aria-hidden="true">
          {MN.map((m, k) => <span key={m} style={{ flex: idx(year, k + 1, 1) - idx(year, k, 1) }}>{m.slice(0, 3)}</span>)}
        </div>
        <div className="ruler-track" role="img" aria-label={label}>
          {selected?.periods.map((p) => (
            <i key={'x' + p.s} className="f" style={{ left: pct(p.xs) + '%', width: ((p.xe - p.xs + 1) / total) * 100 + '%' }} />
          ))}
          {selected?.periods.map((p, i) => (
            <i key={'v' + p.s} className={'v' + (active === i ? ' on' : '')} style={{ left: pct(p.s) + '%', width: (p.L / total) * 100 + '%' }} />
          ))}
          {hols.map((i) => <i key={i} className="h" style={{ left: pct(i) + '%' }} />)}
        </div>
        <p className="ruler-leg" aria-hidden="true">
          <span><i className="v" />Férias</span><span><i className="f" />Dias seguidos sem trabalhar</span><span><i className="h" />Feriado</span>
        </p>
      </div>
    </section>
  );
}
