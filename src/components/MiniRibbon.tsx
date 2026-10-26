import { dayCls, setsFor } from './YearView';
import { idx } from '../lib/dates';
import type { PlanOption, PlanResult } from '../lib/types';

const COLOR: Record<string, string> = { v: 'var(--vac)', x: 'var(--vac-soft)', h: 'var(--hol)', w: 'var(--wk)' };

/** Faixa fina do ano com o plano. Um único elemento: gradiente com um trecho por sequência de dias iguais
 *  (em vez de ~365 <i>). Decorativa: o texto do card diz o mesmo. */
export function MiniRibbon({ year, option, result }: { year: number; option: PlanOption; result: PlanResult }) {
  const j1 = idx(year, 0, 1), total = idx(year, 11, 31) - j1 + 1;
  const sets = setsFor(option, result);
  const stops: string[] = [];
  let start = 0, cur = '';
  for (let k = 0; k <= total; k++) {
    const c = k < total ? (COLOR[dayCls(j1 + k, result, sets).split(' ')[0]] ?? 'transparent') : '';
    if (c !== cur) {
      if (k > 0) {
        const a = (start / total * 100).toFixed(2), b = (k / total * 100).toFixed(2);
        stops.push(`${cur} ${a}% ${b}%`);
      }
      start = k; cur = c;
    }
  }
  return <div className="ribbon mini" aria-hidden="true" style={{ backgroundImage: `linear-gradient(90deg,${stops.join(',')})` }} />;
}
