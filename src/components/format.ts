import { dateOf } from '../lib/dates';
import type { PlanOption } from '../lib/types';

const pad = (n: number) => String(n).padStart(2, '0');

/** dd/mm */
export const short = (i: number) => {
  const d = dateOf(i);
  return `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}`;
};

export const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;

/** Identidade do plano: as datas de início dos períodos. Sobrevive a reordenação e a recálculo. */
export const planKey = (r: PlanOption) => r.periods.map((p) => p.s).join('-');

/** Período que a folha mostra por padrão: o de maior folga contínua. */
export const defaultPeriod = (r: PlanOption) => {
  let best = 0;
  r.periods.forEach((p, i) => { if (p.xe - p.xs > r.periods[best].xe - r.periods[best].xs) best = i; });
  return best;
};
