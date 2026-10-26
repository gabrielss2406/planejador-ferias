import { fmt, idx, isWeekend, MN, wd } from '../lib/dates';
import type { PlanOption, PlanResult } from '../lib/types';

export interface Sets { vac: Set<number>; ext: Set<number>; must: Set<number> }

export function setsFor(r: PlanOption | null, result: PlanResult): Sets {
  const vac = new Set<number>(), ext = new Set<number>();
  r?.periods.forEach((p) => {
    for (let d = p.xs; d <= p.xe; d++) (d >= p.s && d <= p.e ? vac : ext).add(d);
  });
  return { vac, ext, must: new Set(result.must) };
}

export function dayCls(i: number, result: PlanResult, sets: Sets) {
  const c: string[] = [];
  const isH = result.hol.has(i), inPlan = sets.vac.has(i) || sets.ext.has(i);
  if (sets.vac.has(i)) c.push('v');
  else if (sets.ext.has(i)) c.push('x');
  else if (isH && !isWeekend(i)) c.push('h');
  else if (isWeekend(i)) c.push('w');
  if (isH && inPlan) c.push('hh');
  if (sets.must.has(i) && inPlan) c.push('k');
  if (result.blocked.has(i)) c.push('a');
  return c.join(' ');
}

const title = (i: number, result: PlanResult) => {
  const h = result.hol.get(i);
  return fmt(i) + (h ? ' · ' + h.name : '');
};

/** "1 a 3 e 9" a partir de dias do mês (1-based), agrupando sequências. */
function ranges(days: number[]) {
  const out: string[] = [];
  for (let i = 0; i < days.length; i++) {
    let j = i;
    while (days[j + 1] === days[j] + 1) j++;
    out.push(j === i ? `${days[i]}` : j === i + 1 ? `${days[i]} e ${days[j]}` : `${days[i]} a ${days[j]}`);
    i = j;
  }
  return out.join(', ');
}

/** Texto só para leitor de tela: o que acontece em cada mês, em vez de 365 células com rótulo. */
function monthSummary(first: number, dim: number, result: PlanResult, sets: Sets) {
  const vac: number[] = [], ext: number[] = [], hol: string[] = [];
  for (let d = 1; d <= dim; d++) {
    const i = first + d - 1;
    if (sets.vac.has(i)) vac.push(d); else if (sets.ext.has(i)) ext.push(d);
    const h = result.hol.get(i);
    if (h) hol.push(`dia ${d}, ${h.name}`);
  }
  const parts = [];
  if (vac.length) parts.push(`Férias nos dias ${ranges(vac)}.`);
  if (ext.length) parts.push(`Dias seguidos sem trabalhar: ${ranges(ext)}.`);
  if (hol.length) parts.push(`Feriados: ${hol.join('; ')}.`);
  return parts.join(' ') || 'Sem férias nem feriados neste mês.';
}

interface Props { year: number; selected: PlanOption | null; result: PlanResult }

export function Calendar({ year, selected, result }: Props) {
  const sets = setsFor(selected, result);

  return (
    <section className="cal-wrap" aria-labelledby="cal-t">
      <h3 id="cal-t">{`Mês a mês em ${year}`}</h3>
      <p className="legend" aria-hidden="true">
        <span><b className="v" />Férias</span>
        <span><b className="x" />Dias seguidos sem trabalhar</span>
        <span><b className="h" />Feriado</span>
        <span><b className="w" />Fim de semana</span>
        <span><b className="k" />Data-chave incluída</span>
        <span><b className="hh" />Feriado nos dias sem trabalhar</span>
        <span><b className="a" />Data bloqueada</span>
      </p>
      <div className="cal" role="group" aria-label={`Calendário de ${year}, mês a mês`}>
        {MN.map((m, k) => {
          const first = idx(year, k, 1), dim = idx(year, k + 1, 1) - first, lead = wd(first);
          return (
            <div className="month" key={m} role="group" aria-labelledby={`mes-${k}`}>
              <h3 id={`mes-${k}`}>{m}</h3>
              <p className="sr">{monthSummary(first, dim, result, sets)}</p>
              <div className="grid7" aria-hidden="true">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((x, j) => <span key={j} className="wdh">{x}</span>)}
                {Array.from({ length: lead }, (_, b) => <span key={'b' + b} />)}
                {Array.from({ length: dim }, (_, d) => (
                  <span key={d} className={'day ' + dayCls(first + d, result, sets)} title={title(first + d, result)}>{d + 1}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
