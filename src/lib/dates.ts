import { DAY, idx } from '../../shared/holidaysCore.mjs';
export { DAY, easter, idx } from '../../shared/holidaysCore.mjs';

export const dateOf = (i: number) => new Date(i * DAY);
/** Dia da semana: 0 = domingo. */
export const wd = (i: number) => (((i + 4) % 7) + 7) % 7;
export const isWeekend = (i: number) => {
  const w = wd(i);
  return w === 0 || w === 6;
};

const pad = (n: number) => String(n).padStart(2, '0');

export const WD = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
export const MN = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

export const fmt = (i: number) => {
  const d = dateOf(i);
  return `${WD[wd(i)]} ${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}`;
};

export const parseISO = (s?: string): number | null => {
  if (!s) return null;
  const p = s.split('-').map(Number);
  return idx(p[0], p[1] - 1, p[2]);
};

export const norm = (s?: string) =>
  String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
