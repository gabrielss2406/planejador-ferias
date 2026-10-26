// Núcleo de feriados compartilhado entre o navegador (src/lib) e o servidor (server/): sem tipos, só JS.
export const DAY = 864e5;

/** Índice do dia: dias desde 1970-01-01 (UTC), evita problemas de fuso e horário de verão. */
export const idx = (y, m, d) => Math.round(Date.UTC(y, m, d) / DAY);

/** Domingo de Páscoa (algoritmo de Meeus/Jones/Butcher). */
export function easter(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4,
    f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
    i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7,
    m = Math.floor((a + 11 * h + 22 * l) / 451),
    month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return idx(y, month - 1, day);
}

// Entradas: [mês (0-11), dia, nome, anoInicial?]
export const FIXED = [
  [0, 1, 'Confraternização Universal'], [3, 21, 'Tiradentes'], [4, 1, 'Dia do Trabalho'],
  [8, 7, 'Independência'], [9, 12, 'Nossa Senhora Aparecida'], [10, 2, 'Finados'],
  [10, 15, 'Proclamação da República'], [10, 20, 'Consciência Negra', 2024], [11, 25, 'Natal'],
];

// Feriados estaduais fixos por UF. Os que a lei estadual trata como feriado (não só ponto facultativo).
// ES tem também Nossa Senhora da Penha, móvel (Páscoa + 8 dias), tratada em buildHolidays.
export const STATE = {
  AC: [[0, 20, 'Dia do Católico'], [0, 23, 'Dia do Evangélico'], [2, 8, 'Dia Internacional da Mulher'], [7, 6, 'Revolução Acreana'], [5, 15, 'Aniversário do Acre'], [8, 5, 'Dia da Amazônia'], [10, 17, 'Tratado de Petrópolis']],
  AL: [[5, 24, 'São João'], [5, 29, 'São Pedro'], [8, 16, 'Emancipação política de Alagoas'], [10, 30, 'Dia do Evangélico']],
  AP: [[2, 19, 'São José'], [8, 13, 'Criação do Território Federal do Amapá']],
  AM: [[8, 5, 'Elevação do Amazonas à categoria de província']],
  BA: [[6, 2, 'Independência da Bahia']],
  CE: [[2, 19, 'São José'], [2, 25, 'Data Magna do Ceará']],
  DF: [[10, 30, 'Dia do Evangélico']],
  MA: [[6, 28, 'Adesão do Maranhão à Independência']],
  MS: [[9, 11, 'Criação do Estado de Mato Grosso do Sul']],
  PA: [[7, 15, 'Adesão do Pará à Independência']],
  PB: [[6, 26, 'Homenagem a João Pessoa'], [7, 5, 'Fundação do Estado da Paraíba']],
  PE: [[2, 6, 'Revolução Pernambucana'], [5, 24, 'São João']],
  PI: [[9, 19, 'Dia do Piauí']],
  PR: [[11, 19, 'Emancipação do Paraná']],
  RJ: [[3, 23, 'Dia de São Jorge']],
  RN: [[9, 3, 'Mártires de Cunhaú e Uruaçu']],
  RO: [[0, 4, 'Criação do Estado de Rondônia'], [5, 18, 'Dia do Evangélico']],
  RR: [[9, 5, 'Criação do Estado de Roraima']],
  RS: [[8, 20, 'Revolução Farroupilha']],
  SC: [[7, 11, 'Dia de Santa Catarina']],
  SE: [[6, 8, 'Emancipação política de Sergipe']],
  SP: [[6, 9, 'Revolução Constitucionalista']],
  TO: [[2, 18, 'Autonomia do Estado do Tocantins'], [8, 8, 'Nossa Senhora da Natividade'], [9, 5, 'Criação do Estado do Tocantins']],
};

/**
 * UFs cujos feriados estaduais estão cadastrados e conferidos com mais de uma fonte. As demais
 * (ES, GO, MG, MT) ainda pedem conferência na lei estadual: as páginas públicas delas não vão para o sitemap.
 * Os municipais continuam demonstrativos.
 */
export const STATE_CONFIRMED = Object.keys(STATE);

export const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB',
  'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];


/** Feriados e pontos facultativos de um ano para uma UF (sem os municipais), na ordem em que os nomes se juntam. */
export function baseHolidays(y, uf, { carnaval = true, corpus = true } = {}) {
  const out = [];
  const put = (i, name, kind) => out.push({ i, name, kind });
  for (const f of FIXED) if (!f[3] || y >= f[3]) put(idx(y, f[0], f[1]), f[2], 'nacional');
  const E = easter(y);
  put(E - 2, 'Sexta-feira Santa', 'nacional');
  if (carnaval) {
    put(E - 48, 'Carnaval (segunda)', 'facultativo');
    put(E - 47, 'Carnaval (terça)', 'facultativo');
  }
  if (corpus) put(E + 60, 'Corpus Christi', 'facultativo');
  for (const h of STATE[uf] || []) put(idx(y, h[0], h[1]), h[2], 'estadual');
  if (uf === 'ES') put(E + 8, 'Nossa Senhora da Penha', 'estadual');
  return out;
}
