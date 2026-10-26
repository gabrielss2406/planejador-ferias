// Importa a base aberta joaopbini/feriados-brasil (MIT) para arquivos compactos em server/data/.
// Uso: npm run import:holidays   (precisa de rede; o resultado é versionado, o deploy não baixa nada)
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { easter, idx } from '../shared/holidaysCore.mjs';

const RAW = 'https://raw.githubusercontent.com/joaopbini/feriados-brasil/master/dados';
const YEARS = [2024, 2025, 2026];
const BASE = YEARS[YEARS.length - 1];
const out = resolve(dirname(fileURLToPath(import.meta.url)), '../server/data');

const UF_BY_CODE = {
  11: 'RO', 12: 'AC', 13: 'AM', 14: 'RR', 15: 'PA', 16: 'AP', 17: 'TO', 21: 'MA', 22: 'PI', 23: 'CE', 24: 'RN', 25: 'PB',
  26: 'PE', 27: 'AL', 28: 'SE', 29: 'BA', 31: 'MG', 32: 'ES', 33: 'RJ', 35: 'SP', 41: 'PR', 42: 'SC', 43: 'RS',
  50: 'MS', 51: 'MT', 52: 'GO', 53: 'DF',
};

const get = async (path) => {
  const res = await fetch(`${RAW}/${path}`);
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return JSON.parse(await res.text());
};

const parse = (s) => { const [d, m, y] = s.split('/').map(Number); return { d, m: m - 1, y }; };
const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
// distâncias da Páscoa que contam como feriado móvel: Carnaval (seg, ter, quarta de cinzas), Quinta e Sexta Santa, Corpus Christi
const MOVABLE = new Set([-48, -47, -46, -3, -2, 60]);

const [locs, ...files] = await Promise.all([
  get('localizacao/municipios/municipios.json'),
  ...YEARS.map((y) => get(`feriados/municipal/json/${y}.json`)),
]);

const municipios = locs
  .map((m) => [String(m.codigo_ibge), clean(m.nome), UF_BY_CODE[Math.floor(m.codigo_ibge / 100000)]])
  .filter((m) => m[2])
  .sort((a, b) => a[1].localeCompare(b[1], 'pt-BR'));

// (ibge, mês, dia) que aparecem em anos anteriores: data repetida = feriado fixo
const seenBefore = new Set();
files.slice(0, -1).forEach((rows) => {
  for (const r of rows) {
    if (r.tipo !== 'MUNICIPAL') continue;
    const { d, m } = parse(r.data);
    seenBefore.add(`${r.codigo_ibge}-${m}-${d}`);
  }
});

const E = easter(BASE);
const dados = {};
let fixed = 0, movable = 0, single = 0;
for (const r of files[files.length - 1]) {
  if (r.tipo !== 'MUNICIPAL' || !r.codigo_ibge) continue;
  const { d, m, y } = parse(r.data);
  const name = clean(r.nome) || 'Feriado municipal';
  const code = String(r.codigo_ibge);
  const offset = idx(y, m, d) - E;
  let entry;
  if (seenBefore.has(`${code}-${m}-${d}`)) { entry = ['f', m, d, name]; fixed++; }
  else if (MOVABLE.has(offset)) { entry = ['p', offset, name]; movable++; }
  else { entry = ['v', y, m, d, name]; single++; }
  const list = (dados[code] ??= []);
  if (!list.some((x) => JSON.stringify(x) === JSON.stringify(entry))) list.push(entry);
}

mkdirSync(out, { recursive: true });
writeFileSync(resolve(out, 'municipios.json'), JSON.stringify(municipios));
writeFileSync(resolve(out, 'feriados-municipais.json'), JSON.stringify({ anoBase: BASE, anos: YEARS, dados }));
writeFileSync(resolve(out, 'FONTE.md'), `# Fonte dos feriados municipais

Dados importados de https://github.com/joaopbini/feriados-brasil (licença MIT) em ${new Date().toISOString().slice(0, 10)}.
O repositório os compila de "várias fontes públicas": não são oficiais e podem estar desatualizados ou incompletos.
Confirme sempre com a prefeitura.

- Base: feriados municipais de ${BASE}; datas que se repetem em ${YEARS.slice(0, -1).join(' ou ')} viram feriados fixos ('f').
- Móveis ligados à Páscoa (Carnaval, Quinta e Sexta Santa, Corpus Christi) viram deslocamento da Páscoa ('p').
- Os demais ficam só com a data de ${BASE} ('v') e não são projetados para outros anos.
- Gerado por scripts/import-holidays.mjs.

MIT License. Copyright (c) joaopbini/feriados-brasil contributors. Permission is hereby granted, free of charge, to any person obtaining
a copy of the data and associated documentation files, to deal in them without restriction, subject to the inclusion of the original
copyright and permission notice (see the upstream repository for the full text).
`);
console.log(`municípios: ${municipios.length}; com feriado municipal: ${Object.keys(dados).length}; fixos: ${fixed}; móveis: ${movable}; só ${BASE}: ${single}`);
