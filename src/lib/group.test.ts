import { expect, test } from 'vitest';
import { idx } from './dates';
import { groupSummaryText, joinNames, overlaps, type GroupMember } from './group';

const ov = (m: GroupMember[], y: number) => overlaps(m, y).map(({ s, e, names }) => ({ s, e, names }));
const d = (m: number, day: number) => idx(2027, m, day);
const member = (name: string, periods: [number, number][], year = 2027): GroupMember => ({
  pid: name.toLowerCase(), name, me: false, updatedAt: 1,
  plan: periods.length ? {
    id: name, year, N: 30, off: 40, k: periods.length, savedAt: 1,
    periods: periods.map(([s, e]) => ({ s, e, L: e - s + 1, xs: s, xe: e })),
  } : null,
});

test('sem sobreposição quando ninguém coincide', () => {
  expect(ov([member('Ana', [[d(6, 1), d(6, 10)]]), member('Bia', [[d(6, 11), d(6, 20)]])], 2027)).toEqual([]);
});

test('acha o trecho em comum entre duas pessoas (inclusivo nas pontas)', () => {
  const r = ov([member('Ana', [[d(6, 1), d(6, 15)]]), member('Bia', [[d(6, 10), d(6, 25)]])], 2027);
  expect(r).toEqual([{ s: d(6, 10), e: d(6, 15), names: ['Ana', 'Bia'] }]);
});

test('três pessoas: o trecho muda de quem está quando alguém entra ou sai', () => {
  const r = ov([
    member('Ana', [[d(6, 1), d(6, 20)]]), member('Bia', [[d(6, 5), d(6, 12)]]), member('Caio', [[d(6, 10), d(6, 30)]]),
  ], 2027);
  expect(r).toEqual([
    { s: d(6, 5), e: d(6, 9), names: ['Ana', 'Bia'] },
    { s: d(6, 10), e: d(6, 12), names: ['Ana', 'Bia', 'Caio'] },
    { s: d(6, 13), e: d(6, 20), names: ['Ana', 'Caio'] },
  ]);
});

test('ignora quem não escolheu plano e planos de outro ano; uma pessoa com dois períodos não coincide consigo', () => {
  expect(ov([member('Ana', [[d(6, 1), d(6, 10)]]), member('Bia', []), member('Caio', [[d(6, 1), d(6, 10)]], 2028)], 2027)).toEqual([]);
  expect(ov([member('Ana', [[d(6, 1), d(6, 5)], [d(6, 6), d(6, 10)]])], 2027)).toEqual([]);
});

test('joinNames', () => {
  expect(joinNames(['Ana'])).toBe('Ana');
  expect(joinNames(['Ana', 'Bia'])).toBe('Ana e Bia');
  expect(joinNames(['Ana', 'Bia', 'Caio'])).toBe('Ana, Bia e Caio');
});

test('resumo em texto: férias de cada um, quem falta escolher e os dias em comum', () => {
  const ana = { ...member('Ana', [[d(6, 1), d(6, 15)]]), me: true };
  const txt = groupSummaryText([ana, member('Bia', [[d(6, 10), d(6, 25)]]), member('Caio', [])], 2027).split('\n');
  expect(txt[0]).toBe('Férias em grupo 2027');
  expect(txt[1]).toBe('- Ana (eu): qui 01/07 a qui 15/07 (40 dias fora)');
  expect(txt[3]).toBe('- Caio: ainda não escolheu');
  expect(txt).toContain('- sáb 10/07 a qui 15/07: Ana e Bia (6 dias)');
});
