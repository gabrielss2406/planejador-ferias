import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { baseHolidays, easter, idx, STATE } from '../shared/holidaysCore.mjs';

export const YEAR_MIN = 2020;
export const YEAR_MAX = 2035;
const SOURCE = 'feriados-brasil (dados abertos, MIT)';

/** Nomes das datas ligadas à Páscoa, para não repetir "Terça-feira de Carnaval" ao lado de "Carnaval (terça)". */
const EASTER_NAMES = {
  '-48': 'Carnaval (segunda)', '-47': 'Carnaval (terça)', '-46': 'Quarta-feira de Cinzas (meio período)',
  '-3': 'Quinta-feira Santa', '-2': 'Sexta-feira Santa', '60': 'Corpus Christi',
};

export const norm = (s) =>
  String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

/** Ignora "Dia da/do/de" no começo, para reconhecer "Dia da Consciência Negra" como "Consciência Negra". */
const core = (s) => norm(s).replace(/^dia (d[aeo]s?|de) /, '');
const sameName = (a, b) => { const x = core(a), y = core(b); return x === y || x.includes(y) || y.includes(x); };

const iso = (i) => new Date(i * 864e5).toISOString().slice(0, 10);

export function loadHolidayData(dir = resolve(dirname(fileURLToPath(import.meta.url)), 'data')) {
  const read = (f) => JSON.parse(readFileSync(resolve(dir, f), 'utf8'));
  const { anoBase, dados } = read('feriados-municipais.json');
  return { municipios: read('municipios.json'), dados, anoBase };
}

/** Busca de municípios e feriados por código IBGE, tudo em memória. */
export function createHolidays({ municipios, dados, anoBase }) {
  const byIbge = new Map(municipios.map(([ibge, nome, uf]) => [ibge, { ibge, nome, uf }]));
  const index = municipios.map(([ibge, nome, uf]) => ({ ibge, nome, uf, key: norm(nome) }));

  return {
    count: municipios.length,
    withHolidays: Object.keys(dados).length,

    /** Prefixo primeiro, depois "contém"; opcionalmente só uma UF. */
    search(q, uf = '', limit = 10) {
      const k = norm(q);
      if (k.length < 2) return [];
      const max = Math.min(Math.max(Number(limit) || 10, 1), 20);
      const pool = uf ? index.filter((m) => m.uf === uf) : index;
      const starts = [], inside = [];
      for (const m of pool) {
        if (m.key.startsWith(k)) starts.push(m); else if (m.key.includes(k)) inside.push(m);
        if (starts.length >= max) break;
      }
      return [...starts, ...inside].slice(0, max).map(({ ibge, nome, uf: u }) => ({ ibge, nome, uf: u }));
    },

    city(ibge) { return byIbge.get(ibge) ?? null; },

    /** Feriados de um município num ano: nacionais, estaduais, municipais da base e pontos facultativos. */
    holidays(ibge, ano) {
      const city = byIbge.get(ibge);
      if (!city) return null;
      const E = easter(ano);
      const list = baseHolidays(ano, city.uf).map((h) => ({ i: h.i, nome: h.name, tipo: h.kind, fixa: h.kind !== 'facultativo' && !/Sexta-feira Santa/.test(h.name) }));
      let naoProjetados = 0;
      for (const e of dados[ibge] ?? []) {
        let i, nome, fixa = false;
        if (e[0] === 'f') { i = idx(ano, e[1], e[2]); nome = e[3]; fixa = true; }
        else if (e[0] === 'p') { i = E + e[1]; nome = EASTER_NAMES[e[1]] ?? e[2]; }
        else if (e[1] === ano) { i = idx(ano, e[2], e[3]); nome = e[4]; }
        else { naoProjetados++; continue; }
        // já existe o mesmo feriado nessa data (nacional, estadual ou o ponto facultativo que a cidade tornou feriado)
        const twin = list.find((h) => h.i === i && sameName(h.nome, nome));
        if (twin) { if (twin.tipo === 'facultativo') twin.tipo = 'municipal'; continue; }
        list.push({ i, nome, tipo: 'municipal', fixa });
      }
      list.sort((a, b) => a.i - b.i || a.nome.localeCompare(b.nome, 'pt-BR'));
      const municipais = list.filter((h) => h.tipo === 'municipal').length;
      return {
        ibge, municipio: city.nome, uf: city.uf, ano,
        feriados: list.map(({ i, nome, tipo, fixa }) => ({ data: iso(i), nome, tipo, fixa })),
        cobertura: {
          municipal: dados[ibge] ? 'na base' : 'sem registro',
          quantidadeMunicipal: municipais,
          estadual: STATE[city.uf] || city.uf === 'ES' ? 'cadastrado' : 'nao conferido',
          fonte: SOURCE, anoBase, derivado: ano > anoBase, naoProjetados,
          aviso: 'Base aberta, sem garantia de precisão. Confirme com a prefeitura.',
        },
      };
    },
  };
}
