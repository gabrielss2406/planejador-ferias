import { expect, test } from 'vitest';
import { DEFAULTS } from '../hooks/useSettings';
import { easter, idx, wd } from './dates';
import { companyOrderings, compositions, plan } from './planner';

test('Páscoa de 2027 é 28/03', () => {
  expect(easter(2027)).toBe(idx(2027, 2, 28));
});

test('compositions respeita o mínimo por período', () => {
  expect(compositions(30, 3, 5).every((c) => c.length === 3 && c.every((n) => n >= 5))).toBe(true);
});

test('plano de 30 dias respeita as regras da CLT', () => {
  const r = plan({ ...DEFAULTS });
  expect(r.groups.all.length).toBeGreaterThan(0);
  for (const o of r.groups.all) {
    const lens = o.periods.map((p) => p.L);
    expect(lens.reduce((a, b) => a + b, 0)).toBe(30);
    expect(Math.min(...lens)).toBeGreaterThanOrEqual(5);
    expect(Math.max(...lens)).toBeGreaterThanOrEqual(14);
    expect(o.off).toBeGreaterThanOrEqual(30);
  }
});

test('nenhum plano começa de sexta a domingo nem a 1 ou 2 dias de um feriado (CLT, art. 134, §3º)', () => {
  for (const year of [2026, 2027, 2028]) {
    for (const uf of ['', 'SP', 'RJ']) {
      const r = plan({ ...DEFAULTS, year, uf });
      const isHoliday = (d: number) => { const h = r.hol.get(d); return !!h && ['nacional', 'estadual', 'municipal'].includes(h.kind); };
      const all = Object.values(r.groups).flat();
      expect(all.length).toBeGreaterThan(0);
      for (const o of all) {
        for (const p of o.periods) {
          expect([1, 2, 3, 4], `início ${p.s}`).toContain(wd(p.s));
          expect(isHoliday(p.s + 1) || isHoliday(p.s + 2), `véspera de feriado ${p.s}`).toBe(false);
        }
      }
    }
  }
});

test('companyOrderings fixa períodos exatos e deixa o resto livre', () => {
  const o = companyOrderings(30, { fixed: [14], free: 2, freeMin: 5 });
  expect(o.length).toBeGreaterThan(0);
  expect(o.every((c) => c.length === 3 && c.reduce((a, b) => a + b, 0) === 30)).toBe(true);
  expect(o.every((c) => c.includes(14))).toBe(true);
  expect(o.every((c) => { const rest = [...c]; rest.splice(rest.indexOf(14), 1); return rest.every((n) => n >= 5); })).toBe(true);
  expect(o).toContainEqual([14, 5, 11]);
  expect(o).toContainEqual([5, 14, 11]);
  expect(o).toContainEqual([5, 11, 14]);
  expect(new Set(o.map((c) => c.join(','))).size).toBe(o.length);
});

test('companyOrderings sem períodos livres exige soma exata', () => {
  expect(companyOrderings(30, { fixed: [20, 10], free: 0, freeMin: 5 })).toEqual([[20, 10], [10, 20]]);
  expect(companyOrderings(30, { fixed: [14, 10], free: 0, freeMin: 5 })).toEqual([]);
});

test('plano com regra da empresa 14 + 2 períodos de no mínimo 5', () => {
  const r = plan({ ...DEFAULTS, company: { fixed: [14], free: 2, freeMin: 5 } });
  expect(r.error).toBeNull();
  expect(r.groups.all.length).toBeGreaterThan(0);
  for (const o of Object.values(r.groups).flat()) {
    const lens = o.periods.map((p) => p.L);
    expect(lens).toHaveLength(3);
    expect(lens.reduce((a, b) => a + b, 0)).toBe(30);
    expect(lens).toContain(14);
    expect(Math.min(...lens)).toBeGreaterThanOrEqual(5);
  }
});

test('regra da empresa impossível devolve erro', () => {
  expect(plan({ ...DEFAULTS, company: { fixed: [14, 14], free: 2, freeMin: 5 } }).error).toBeTruthy();
  expect(plan({ ...DEFAULTS, company: { fixed: [28], free: 1, freeMin: 5 } }).error).toBeTruthy();
  expect(plan({ ...DEFAULTS, company: { fixed: [3], free: 1, freeMin: 5 } }).error).toBeTruthy();
});

test('sem regra da empresa o resultado não muda', () => {
  const a = plan({ ...DEFAULTS }), b = plan({ ...DEFAULTS, company: undefined });
  expect(b.groups.all.map((o) => o.score)).toEqual(a.groups.all.map((o) => o.score));
});

test('janela invertida devolve erro', () => {
  const r = plan({ ...DEFAULTS, wStart: '2027-05-01', wEnd: '2027-04-01' });
  expect(r.error).toBeTruthy();
});
