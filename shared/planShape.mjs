// Forma de um plano guardado (SavedPlan): usada pelo navegador (localStorage) e pelo servidor (grupos).
const num = (v) => typeof v === 'number' && Number.isFinite(v);

export const validPlan = (p) =>
  !!p && typeof p.id === 'string' && num(p.year) && num(p.N) && num(p.off) && num(p.k) && num(p.savedAt)
  && Array.isArray(p.periods) && p.periods.length > 0 && p.periods.length <= 3
  && p.periods.every((q) => q && num(q.s) && num(q.e) && num(q.L) && num(q.xs) && num(q.xe));

/** Só os campos conhecidos, para não guardar lixo vindo de fora. */
export const cleanPlan = (p) => ({
  id: p.id, year: p.year, N: p.N, off: p.off, k: p.k, savedAt: p.savedAt,
  periods: p.periods.map(({ s, e, L, xs, xe }) => ({ s, e, L, xs, xe })),
});
