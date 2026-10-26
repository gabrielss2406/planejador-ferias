export const DAY = 864e5;

/** Índice do dia: dias desde 1970-01-01 (UTC), evita problemas de fuso e horário de verão. */
export const idx = (y: number, m: number, d: number) => Math.round(Date.UTC(y, m, d) / DAY);
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

/** Domingo de Páscoa (algoritmo de Meeus/Jones/Butcher). */
export function easter(y: number): number {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4,
    f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
    i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7,
    m = Math.floor((a + 11 * h + 22 * l) / 451),
    month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return idx(y, month - 1, day);
}
