import { baseHolidays, STATE_CONFIRMED, UFS } from '../../shared/holidaysCore.mjs';
import { DEFAULTS } from '../hooks/useSettings';
import { dateOf, idx, isWeekend, MN, wd, WD } from '../lib/dates';
import { plan } from '../lib/planner';
import type { PlanOption } from '../lib/types';

export const YEARS = [2026, 2027, 2028];

export const UF_NAMES: Record<string, string> = {
  AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal',
  ES: 'Espírito Santo', GO: 'Goiás', MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais',
  PA: 'Pará', PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco', PI: 'Piauí', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina', SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins',
};
export const ALL_UFS: string[] = UFS;
/** A lei estadual dessa UF já está cadastrada (ES, GO, MG e MT ainda não). */
export const isConfirmed = (uf: string) => STATE_CONFIRMED.includes(uf);

const WD_LONG = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const pad = (n: number) => String(n).padStart(2, '0');

export const dm = (i: number) => `${pad(dateOf(i).getUTCDate())}/${pad(dateOf(i).getUTCMonth() + 1)}`;
export const dmWeek = (i: number) => `${WD[wd(i)]} ${dm(i)}`;
export const weekday = (i: number) => WD_LONG[wd(i)];
export const monthName = (i: number) => MN[dateOf(i).getUTCMonth()];
export const days = (n: number) => `${n} ${n === 1 ? 'dia' : 'dias'}`;
export const iso = (i: number) => dateOf(i).toISOString().slice(0, 10);

export interface Hol { i: number; name: string; kind: 'nacional' | 'estadual' | 'facultativo' }

/** Feriados do ano numa UF ('' = só nacionais); só os que caem no ano. */
export function yearHolidays(year: number, uf = ''): Hol[] {
  return baseHolidays(year, uf)
    .filter((h) => dateOf(h.i).getUTCFullYear() === year)
    .sort((a, b) => a.i - b.i);
}

export interface Bridge {
  hol: Hol;
  /** quantos dias de férias a ponte pede */
  vacation: number;
  /** quantos dias seguidos sem trabalhar ela rende */
  off: number;
  from: number;
  to: number;
  text: string;
}

/**
 * Feriados em dia útil e o que dá para emendar com poucos dias de férias.
 * Considera fins de semana e outros feriados vizinhos como folga.
 */
export function bridges(year: number, uf = ''): Bridge[] {
  const all = yearHolidays(year, uf);
  const real = new Set(all.filter((h) => h.kind !== 'facultativo').map((h) => h.i));
  const off = (i: number) => isWeekend(i) || real.has(i);
  const out: Bridge[] = [];
  for (const hol of all) {
    if (hol.kind === 'facultativo' || isWeekend(hol.i)) continue;
    // melhor janela de 1 a 2 dias úteis de férias encostada no feriado
    let best: { v: number; from: number; to: number } | null = null;
    for (const v of [1, 2]) {
      for (let s = hol.i - v; s <= hol.i + 1; s++) {
        const days = Array.from({ length: v }, (_, k) => s + k);
        if (days.some((d) => off(d))) continue;
        let from = s, to = s + v - 1;
        while (off(from - 1)) from--;
        while (off(to + 1)) to++;
        if (from > hol.i || to < hol.i) continue;
        const len = to - from + 1;
        if (!best || len / v > (best.to - best.from + 1) / best.v) best = { v, from, to };
      }
    }
    const w = wd(hol.i);
    if (w === 1 || w === 5) {
      let from = hol.i, to = hol.i;
      while (off(from - 1)) from--;
      while (off(to + 1)) to++;
      out.push({ hol, vacation: 0, off: to - from + 1, from, to, text: `Cai na ${weekday(hol.i)}: fim de semana prolongado de ${days(to - from + 1)}, sem gastar férias.` });
    } else if (best) {
      out.push({
        hol, vacation: best.v, off: best.to - best.from + 1, from: best.from, to: best.to,
        text: `Cai na ${weekday(hol.i)}: com ${days(best.v)} de férias você fica ${days(best.to - best.from + 1)} sem trabalhar, de ${dmWeek(best.from)} a ${dmWeek(best.to)}.`,
      });
    }
  }
  return out;
}

/**
 * Os melhores planos do motor para o ano (e UF), com 30 dias ou 20 (vendendo 10). Nas páginas públicas só
 * entram planos que começam de segunda a quinta e não nos 2 dias antes de feriado (CLT, art. 134, §3º).
 */
export function bestPlans(year: number, N: number, uf = '', top = 3): PlanOption[] {
  const r = plan({ ...DEFAULTS, year, uf, total: N });
  const isHoliday = (i: number) => { const h = r.hol.get(i); return !!h && h.kind !== 'facultativo'; };
  const okStart = (s: number) => wd(s) >= 1 && wd(s) <= 4 && !isHoliday(s + 1) && !isHoliday(s + 2);
  return r.groups.all.filter((p) => p.periods.every((q) => okStart(q.s))).slice(0, top);
}

export const yearBounds = (year: number) => ({ start: idx(year, 0, 1), end: idx(year, 11, 31) });
