import { easter, idx, norm, parseISO } from './dates';
import type { Holiday, HolidayKind, Settings } from './types';

type Entry = [month: number, day: number, name: string, fromYear?: number];

const FIXED: Entry[] = [
  [0, 1, 'Confraternização Universal'], [3, 21, 'Tiradentes'], [4, 1, 'Dia do Trabalho'],
  [8, 7, 'Independência'], [9, 12, 'Nossa Senhora Aparecida'], [10, 2, 'Finados'],
  [10, 15, 'Proclamação da República'], [10, 20, 'Consciência Negra', 2024], [11, 25, 'Natal'],
];

const STATE: Record<string, Entry[]> = {
  SP: [[6, 9, 'Revolução Constitucionalista']], RJ: [[3, 23, 'Dia de São Jorge']],
  RS: [[8, 20, 'Revolução Farroupilha']], PR: [[11, 19, 'Emancipação do Paraná']],
  BA: [[6, 2, 'Independência da Bahia']], CE: [[2, 19, 'São José'], [2, 25, 'Data Magna do Ceará']],
  AM: [[8, 5, 'Elevação do Amazonas à categoria de província']],
  PA: [[7, 15, 'Adesão do Pará à Independência']],
  MA: [[6, 28, 'Adesão do Maranhão à Independência']], DF: [[10, 30, 'Dia do Evangélico']],
  AL: [[8, 16, 'Emancipação política de Alagoas']], SE: [[6, 8, 'Emancipação política de Sergipe']],
  PI: [[9, 19, 'Dia do Piauí']],
};

export const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB',
  'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

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
  const ck = findCity(S.city);
  const uf = ck ? CITIES[ck][0] : S.uf;
  [S.year - 1, S.year, S.year + 1].forEach((y) => {
    FIXED.forEach((f) => { if (!f[3] || y >= f[3]) put(idx(y, f[0], f[1]), f[2], 'nacional'); });
    const E = easter(y);
    put(E - 2, 'Sexta-feira Santa', 'nacional');
    if (S.carnaval) {
      put(E - 48, 'Carnaval (segunda)', 'facultativo');
      put(E - 47, 'Carnaval (terça)', 'facultativo');
    }
    if (S.corpus) put(E + 60, 'Corpus Christi', 'facultativo');
    (STATE[uf] || []).forEach((h) => put(idx(y, h[0], h[1]), h[2], 'estadual'));
    if (ck) CITIES[ck][1].forEach((h) => put(idx(y, h[0], h[1]), h[2], 'municipal'));
  });
  S.custom.filter((c) => c.type === 'folga').forEach((c) => {
    const a = parseISO(c.start);
    if (a == null) return;
    const b = Math.max(a, parseISO(c.end) ?? a);
    for (let i = a; i <= b; i++) put(i, c.label || 'Folga extra', 'extra');
  });
  return { map, uf, ck };
}
