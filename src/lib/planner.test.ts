import { expect, test } from 'vitest';
import { DEFAULTS } from '../hooks/useSettings';
import { easter, idx, wd } from './dates';
import { compositions, plan } from './planner';

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

test('janela invertida devolve erro', () => {
  const r = plan({ ...DEFAULTS, wStart: '2027-05-01', wEnd: '2027-04-01' });
  expect(r.error).toBeTruthy();
});
