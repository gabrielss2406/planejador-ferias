import { baseHolidays, idx } from '../../shared/holidaysCore.mjs';
import { norm, parseISO } from './dates';
import type { Holiday, HolidayKind, Settings } from './types';

type Entry = [month: number, day: number, name: string, fromYear?: number];

export { STATE_CONFIRMED, UFS } from '../../shared/holidaysCore.mjs';

export const CITIES: Record<string, [uf: string, holidays: Entry[]]> = {
  'São Paulo': ['SP', [[0, 25, 'Aniversário de São Paulo']]],
  'Rio de Janeiro': ['RJ', [[0, 20, 'São Sebastião']]],
  'Belo Horizonte': ['MG', [[7, 15, 'Assunção de Nossa Senhora'], [11, 8, 'Imaculada Conceição']]],
  'Porto Alegre': ['RS', [[1, 2, 'Nossa Senhora dos Navegantes']]],
  'Curitiba': ['PR', [[8, 8, 'Nossa Senhora da Luz dos Pinhais']]],
  'Brasília': ['DF', []], 'Salvador': ['BA', []], 'Recife': ['PE', []],
  'Fortaleza': ['CE', [[7, 15, 'Assunção de Nossa Senhora']]],
  'Goiânia': ['GO', [[9, 24, 'Aniversário de Goiânia']]],
  'Manaus': ['AM', [[9, 24, 'Aniversário de Manaus'], [11, 8, 'Nossa Senhora da Conceição']]],
  'Florianópolis': ['SC', [[2, 23, 'Aniversário de Florianópolis']]],
  'Vitória': ['ES', [[8, 8, 'Nossa Senhora da Vitória']]],
  'Belém': ['PA', [[0, 12, 'Aniversário de Belém']]],
  'São Luís': ['MA', [[8, 8, 'Aniversário de São Luís']]],
  'Maceió': ['AL', [[7, 27, 'Nossa Senhora dos Prazeres']]],
  'Teresina': ['PI', [[7, 16, 'Aniversário de Teresina']]],
  'João Pessoa': ['PB', [[7, 5, 'Nossa Senhora das Neves']]],
  'Aracaju': ['SE', [[2, 17, 'Aniversário de Aracaju']]],
  'Natal': ['RN', [[10, 21, 'Nossa Senhora da Apresentação']]],
  'Campo Grande': ['MS', [[7, 26, 'Aniversário de Campo Grande']]],
  'Cuiabá': ['MT', [[3, 8, 'Aniversário de Cuiabá']]],
};

const RANK: Record<HolidayKind, number> = { nacional: 5, estadual: 4, municipal: 4, facultativo: 2, extra: 1 };
export const KIND: Record<HolidayKind, string> = {
  nacional: 'Nacional', estadual: 'Estadual', municipal: 'Municipal',
  facultativo: 'Ponto facultativo', extra: 'Sua folga',
};

export const findCity = (n: string): string | null => {
  const x = norm(n);
  if (!x) return null;
  return Object.keys(CITIES).find((k) => norm(k) === x) || null;
};

export function buildHolidays(S: Settings) {
  const map = new Map<number, Holiday>();
  const put = (i: number, name: string, kind: HolidayKind) => {
    const c = map.get(i);
    if (!c) { map.set(i, { name, kind }); return; }
    if (c.name.indexOf(name) < 0) c.name += ' + ' + name;
    if (RANK[kind] > RANK[c.kind]) c.kind = kind;
  };
  // município vindo da API (cityHol) tem prioridade sobre a lista curta CITIES
  const ck = S.cityHol ? null : findCity(S.city);
  const uf = ck ? CITIES[ck][0] : S.uf;
  [S.year - 1, S.year, S.year + 1].forEach((y) => {
    baseHolidays(y, uf, S).forEach((b) => put(b.i, b.name, b.kind));
    if (ck) CITIES[ck][1].forEach((h) => put(idx(y, h[0], h[1]), h[2], 'municipal'));
  });
  S.cityHol?.forEach((h) => put(h.i, h.name, 'municipal'));
  S.custom.filter((c) => c.type === 'folga').forEach((c) => {
    const a = parseISO(c.start);
    if (a == null) return;
    const b = Math.max(a, parseISO(c.end) ?? a);
    for (let i = a; i <= b; i++) put(i, c.label || 'Folga extra', 'extra');
  });
  return { map, uf, ck };
}
