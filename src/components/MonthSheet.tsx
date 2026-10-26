import { dateOf, fmt, isWeekend, MN, wd } from '../lib/dates';
import type { Period, PlanResult } from '../lib/types';
import { plural, short } from './format';

interface Props {
  period: Period;
  number: number;
  result: PlanResult;
}

/** A folha de parede do período: da primeira à última folga contínua, semana a semana. */
export function MonthSheet({ period: p, number, result }: Props) {
  const must = new Set(result.must);
  const days: number[] = [];
  for (let d = p.xs; d <= p.xe; d++) days.push(d);
  const lead = wd(p.xs);
  const year = dateOf(p.e).getUTCFullYear();

  const hols = days.filter((d) => result.hol.has(d) && !isWeekend(d));
  const holIn = hols.filter((d) => d >= p.s && d <= p.e);
  const holOut = hols.filter((d) => d < p.s || d > p.e);
  const nameOf = (d: number) => `${result.hol.get(d)!.name} ${short(d)}`;
  const list = (ds: number[]) => (ds.length > 2 ? `${ds.slice(0, 2).map(nameOf).join(', ')} e mais ${ds.length - 2}` : ds.map(nameOf).join(', '));
  const keyIn = days.some((d) => must.has(d));
  const rest = p.xe - p.xs + 1;

  return (
    <section className="sheet" aria-labelledby="folha-t" key={`${p.s}-${p.e}`}>
      <h2 id="folha-t" className="sheet-h">
        <span>Período {number} · {short(p.s)} a {short(p.e)}/{year}</span>
        <em>{plural(p.L, 'dia', 'dias')} de férias · folga contínua {rest} dias</em>
      </h2>
      <p className="sr">
        Férias de {fmt(p.s)} a {fmt(p.e)}. Folga contínua de {fmt(p.xs)} a {fmt(p.xe)}.
        {hols.length > 0 && ` Feriados: ${hols.map((d) => `${fmt(d)}, ${result.hol.get(d)!.name}`).join('; ')}.`}
      </p>
      <div className="sheet-wk" aria-hidden="true">
        {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map((x) => <span key={x}>{x}</span>)}
      </div>
      <div className="sheet-days" aria-hidden="true">
        {Array.from({ length: lead }, (_, b) => <span key={'b' + b} className="e" />)}
        {days.map((d, k) => {
          const dt = dateOf(d), n = dt.getUTCDate();
          const inVac = d >= p.s && d <= p.e, h = result.hol.has(d) && !isWeekend(d);
          const cls = inVac ? (h ? 'b hh' : 'b') : h ? 'a' : 'g';
          return (
            <span key={d} className={cls + (must.has(d) ? ' k' : '')} title={fmt(d) + (result.hol.has(d) ? ' · ' + result.hol.get(d)!.name : '')}>
              {(k === 0 || n === 1) && <small>{MN[dt.getUTCMonth()].slice(0, 3)}</small>}
              {n}
            </span>
          );
        })}
      </div>
      <p className="sheet-leg">
        <span><i className="b" />Férias</span>
        <span><i className="g" />Folga emendada</span>
        {holOut.length > 0 && <span><i className="a" />Feriado: {list(holOut)}</span>}
        {holIn.length > 0 && <span><i className="hh" />Feriado dentro das férias: {list(holIn)}</span>}
        {keyIn && <span><i className="k" />Data-chave</span>}
      </p>
    </section>
  );
}
