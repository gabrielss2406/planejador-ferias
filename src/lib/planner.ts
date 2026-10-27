import { dateOf, idx, isWeekend, parseISO, wd } from './dates';
import { buildHolidays } from './holidays';
import type { GroupKey, Period, PlanOption, PlanResult, Settings } from './types';

export function compositions(N: number, k: number, minP: number): number[][] {
  const out: number[][] = [];
  (function rec(rem: number, left: number, cur: number[]) {
    if (left === 1) { if (rem >= minP) out.push(cur.concat(rem)); return; }
    for (let a = minP; a <= rem - minP * (left - 1); a++) rec(rem - a, left - 1, cur.concat(a));
  })(N, k, []);
  return out;
}

interface Tail { score: number; c: Period; tail: Tail | null }

export function plan(S: Settings): PlanResult {
  const H = buildHolidays(S), hol = H.map;
  const isOff = (i: number) => isWeekend(i) || hol.has(i);
  const y = S.year;
  const wS = parseISO(S.wStart) ?? idx(y, 0, 1);
  const wE = parseISO(S.wEnd) ?? idx(y, 11, 31);
  const blocked = new Set<number>(), must: number[] = [];
  S.custom.forEach((c) => {
    const a = parseISO(c.start);
    if (a == null) return;
    const b = Math.max(a, parseISO(c.end) ?? a);
    for (let i = a; i <= b; i++) {
      if (c.type === 'evitar') blocked.add(i);
      if (c.type === 'incluir') must.push(i);
    }
  });
  const N = S.total, minP = S.minPart, maxMin = Math.min(S.maxMin, N);
  const ctx = { hol, isOff, wS, wE, blocked, must, N, uf: H.uf, ck: H.ck };
  const emptyGroups = (): Record<GroupKey, PlanOption[]> => ({ all: [], 1: [], 2: [], 3: [] });
  if (wE < wS) return { ...ctx, groups: emptyGroups(), error: 'A data final da janela é anterior à inicial.' };

  // CLT, art. 134, §3º: as férias não podem começar nos 2 dias antes de feriado ou do descanso semanal (domingo).
  // Na prática: nada de começar de sexta a domingo, nem a 1 ou 2 dias de um feriado.
  const isRealHoliday = (d: number) => { const h = hol.get(d); return !!h && (h.kind === 'nacional' || h.kind === 'estadual' || h.kind === 'municipal'); };
  const startsOk = (s: number) => { const w = wd(s); return w >= 1 && w <= 4 && !isRealHoliday(s + 1) && !isRealHoliday(s + 2); };

  const cache: Record<number, Period[]> = {};
  const cands = (L: number): Period[] => {
    if (cache[L]) return cache[L];
    const out: Period[] = [];
    for (let s = wS; s + L - 1 <= wE; s++) {
      const e = s + L - 1;
      if (!startsOk(s)) continue;
      if (!S.months[dateOf(s).getUTCMonth()] || !S.months[dateOf(e).getUTCMonth()]) continue;
      let bad = false, waste = 0;
      for (let d = s; d <= e; d++) {
        if (blocked.has(d)) { bad = true; break; }
        if (hol.has(d) && !isWeekend(d)) waste++;
      }
      if (bad) continue;
      let xs = s; while (isOff(xs - 1)) xs--;
      let xe = e; while (isOff(xe + 1)) xe++;
      let hits = 0; for (const k of must) if (k >= xs && k <= xe) hits++;
      const gain = (s - xs) + (xe - e);
      const score = gain * 10 - (S.penal ? waste * 10 : 0) + hits * 1000 + (xe - xs) * 0.01;
      out.push({ s, e, L, xs, xe, gain, waste, hits, score });
    }
    return (cache[L] = out);
  };

  const orderings: number[][] = [];
  ([1, 2, 3] as const).forEach((k) => {
    if (!S.parts[k]) return;
    if (k === 1) { if (N >= minP) orderings.push([N]); }
    else compositions(N, k, minP).forEach((c) => { if (Math.max(...c) >= maxMin) orderings.push(c); });
  });

  const base = wS - 20, size = (wE + 20) - base + 2;
  const posCache: Record<number, (Period[] | undefined)[]> = {};
  const byPos = (L: number) => {
    if (posCache[L]) return posCache[L];
    const arr: (Period[] | undefined)[] = new Array(size);
    cands(L).forEach((c) => { const p = c.xs - base; (arr[p] || (arr[p] = [])).push(c); });
    return (posCache[L] = arr);
  };

  const all: PlanOption[] = [];
  orderings.forEach((lens) => {
    const m = lens.length, pen = S.split * 10 * (m - 1);
    const F: (Tail | null)[][] = new Array(m + 1);
    for (let k = m - 1; k >= 1; k--) {
      const arr: (Tail | null)[] = new Array(size + 1).fill(null), bp = byPos(lens[k]);
      for (let p = size - 1; p >= 0; p--) {
        let best = arr[p + 1];
        const list = bp[p];
        if (list) for (const c of list) {
          let tail: Tail | null = null, ts = 0;
          if (k < m - 1) { const q = c.xe + 2 - base; tail = q < size ? F[k + 1][q] : null; if (!tail) continue; ts = tail.score; }
          const sc = c.score + ts;
          if (!best || sc > best.score) best = { score: sc, c, tail };
        }
        arr[p] = best;
      }
      F[k] = arr;
    }
    cands(lens[0]).forEach((c) => {
      let tail: Tail | null = null, ts = 0;
      if (m > 1) { const q = c.xe + 2 - base; tail = q < size ? F[1][q] : null; if (!tail) return; ts = tail.score; }
      const periods = [c]; let t = tail; while (t) { periods.push(t.c); t = t.tail; }
      all.push({ k: m, score: c.score + ts - pen, periods, off: 0, gain: 0 });
    });
  });
  all.sort((a, b) => b.score - a.score);

  const vacSet = (r: PlanOption) => {
    const s = new Set<number>();
    r.periods.forEach((p) => { for (let d = p.s; d <= p.e; d++) s.add(d); });
    return s;
  };
  const pick = (list: PlanOption[], limit: number) => {
    const chosen: PlanOption[] = [];
    for (const r of list) {
      if (chosen.length >= limit) break;
      const set = r.set || (r.set = vacSet(r));
      let similar = false;
      for (const c of chosen) {
        let inter = 0; set.forEach((d) => { if (c.set!.has(d)) inter++; });
        if (inter / N > 0.5) { similar = true; break; }
      }
      if (!similar) chosen.push(r);
    }
    return chosen;
  };
  const groups: Record<GroupKey, PlanOption[]> = {
    all: pick(all, 6),
    1: pick(all.filter((r) => r.k === 1), 4),
    2: pick(all.filter((r) => r.k === 2), 4),
    3: pick(all.filter((r) => r.k === 3), 4),
  };

  const enrich = (r: PlanOption) => {
    let off = 0;
    r.periods.forEach((p) => {
      off += p.xe - p.xs + 1;
      p.weekendGain = 0; p.holGain = []; p.holInside = [];
      for (let d = p.xs; d <= p.xe; d++) {
        const inside = d >= p.s && d <= p.e, h = hol.get(d);
        if (h && !isWeekend(d)) (inside ? p.holInside! : p.holGain!).push({ d, name: h.name });
        else if (!inside && isWeekend(d)) p.weekendGain!++;
      }
    });
    r.off = off; r.gain = off - N;
  };
  (['all', '1', '2', '3'] as GroupKey[]).forEach((g) => groups[g].forEach(enrich));
  return { ...ctx, groups, error: orderings.length ? null : 'Nenhuma divisão de períodos é possível com essas regras.' };
}
