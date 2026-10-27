import { expect, test } from 'vitest';
import { DEFAULTS } from '../hooks/useSettings';
import { buildIcs, planId, toSaved } from './export';
import { idx } from './dates';
import { plan } from './planner';

const NOW = Date.UTC(2026, 9, 26, 12, 30, 5);
const best = () => {
  const r = plan({ ...DEFAULTS });
  return toSaved(r.groups.all[0], 2027, r.N, NOW);
};

test('toSaved guarda só datas e dias, com id estável', () => {
  const r = plan({ ...DEFAULTS });
  const o = r.groups.all[0];
  const s = toSaved(o, 2027, r.N, NOW);
  expect(s).toMatchObject({ year: 2027, N: 30, off: 45, k: 3, savedAt: NOW });
  expect(s.periods).toEqual([
    { s: idx(2027, 0, 4), e: idx(2027, 0, 8), L: 5, xs: idx(2027, 0, 1), xe: idx(2027, 0, 10) },
    { s: idx(2027, 1, 1), e: idx(2027, 1, 5), L: 5, xs: idx(2027, 0, 30), xe: idx(2027, 1, 9) },
    { s: idx(2027, 2, 29), e: idx(2027, 3, 17), L: 20, xs: idx(2027, 2, 26), xe: idx(2027, 3, 18) },
  ]);
  expect(s.id).toBe(planId(2027, o));
  expect(toSaved(o, 2027, r.N, NOW + 1000).id).toBe(s.id);
  expect(toSaved(o, 2028, r.N, NOW).id).not.toBe(s.id);
});

test('ICS da opção 1 de 2027: 3 eventos de dia inteiro, DTEND exclusivo e CRLF', () => {
  const ics = buildIcs(best());
  expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
  expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
  expect(ics.replace(/\r\n/g, '')).not.toMatch(/[\r\n]/);
  const lines = ics.split('\r\n');
  expect(lines.filter((l) => l === 'BEGIN:VEVENT')).toHaveLength(3);
  expect(lines.filter((l) => l.startsWith('DTSTART;VALUE=DATE:'))).toEqual([
    'DTSTART;VALUE=DATE:20270104', 'DTSTART;VALUE=DATE:20270201', 'DTSTART;VALUE=DATE:20270329',
  ]);
  expect(lines.filter((l) => l.startsWith('DTEND;VALUE=DATE:'))).toEqual([
    'DTEND;VALUE=DATE:20270109', 'DTEND;VALUE=DATE:20270206', 'DTEND;VALUE=DATE:20270418',
  ]);
  expect(lines).toContain('DTSTAMP:20261026T123005Z');
  expect(lines).toContain('SUMMARY:Férias 3/3 (20 dias)');
  const uids = lines.filter((l) => l.startsWith('UID:'));
  expect(new Set(uids).size).toBe(3);
});

test('ICS escapa vírgula e ponto e vírgula, e nenhuma linha passa de 75 bytes', () => {
  const ics = buildIcs(best());
  const enc = new TextEncoder();
  expect(ics.split('\r\n').every((l) => enc.encode(l).length <= 75)).toBe(true);
  const unfolded = ics.replace(/\r\n /g, '');
  expect(unfolded).toContain('Proposta para negociar: quem define a época das férias é o empregador (CLT\\, art. 136).');
  expect(unfolded).toContain('DESCRIPTION:Sem trabalhar de sex 01/01 a dom 10/01.');
});
