import { fmt, idx, isWeekend, MN, wd } from '../lib/dates';
import type { PlanOption, PlanResult } from '../lib/types';

interface Sets { vac: Set<number>; ext: Set<number>; must: Set<number> }

function setsFor(r: PlanOption | null, result: PlanResult): Sets {
  const vac = new Set<number>(), ext = new Set<number>();
  r?.periods.forEach((p) => {
    for (let d = p.xs; d <= p.xe; d++) (d >= p.s && d <= p.e ? vac : ext).add(d);
  });
  return { vac, ext, must: new Set(result.must) };
}

function dayCls(i: number, result: PlanResult, sets: Sets) {
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

interface Props {
  year: number;
  selected: PlanOption | null;
  result: PlanResult;
}

export function Ribbon({ year, selected, result }: Props) {
  const j1 = idx(year, 0, 1), total = idx(year, 11, 31) - j1 + 1;
  const sets = setsFor(selected, result);

  return (
      <section className="card ribbon-card" aria-live="polite">
        <div className="ribbon-head">
          <h2>{`Seu ${year}${selected ? ' com a opção selecionada' : ''}`}</h2>
          <span>
            {selected ? `${selected.off} dias fora do trabalho com ${result.N} dias de férias` : 'Sem sugestão para mostrar'}
          </span>
        </div>
        <div className="ribbon" style={{ '--n': total } as React.CSSProperties}>
          {Array.from({ length: total }, (_, k) => {
            const i = j1 + k;
            return <i key={i} className={dayCls(i, result, sets)} title={title(i, result)} />;
          })}
        </div>
        <div className="ribbon-months">
          {MN.map((m, k) => (
            <span key={m} style={{ left: ((idx(year, k, 1) - j1) / total * 100).toFixed(2) + '%' }}>{m.slice(0, 3)}</span>
          ))}
        </div>
        <div className="legend">
          <span><b className="v" />Férias</span>
          <span><b className="x" />Folga emendada</span>
          <span><b className="h" />Feriado</span>
          <span><b />Fim de semana</span>
          <span><b className="k" />Data-chave coberta</span>
          <span><b className="a" />Data bloqueada</span>
        </div>
      </section>
  );
}

export function Calendar({ year, selected, result }: Props) {
  const sets = setsFor(selected, result);

  return (
    <>
      <div className="cal-head"><h2>{`Calendário de ${year}`}</h2><span className="hint" /></div>
      <section className="cal">
        {MN.map((m, k) => {
          const first = idx(year, k, 1), dim = idx(year, k + 1, 1) - first, lead = wd(first);
          return (
            <div className="month" key={m}>
              <h3>{m}</h3>
              <div className="grid7">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((x, j) => <span key={j} className="wdh">{x}</span>)}
                {Array.from({ length: lead }, (_, b) => <span key={'b' + b} />)}
                {Array.from({ length: dim }, (_, d) => (
                  <span key={d} className={'day ' + dayCls(first + d, result, sets)} title={title(first + d, result)}>{d + 1}</span>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
