import { createServer } from 'node:http';
import { afterEach, expect, test } from 'vitest';
import { createApp } from './app.mjs';
import { createHolidays, loadHolidayData } from './holidays.mjs';
import { openStore } from './store.mjs';

// fixture pequena: duas cidades de nomes parecidos, uma sem registro
const fixture = {
  anoBase: 2026,
  municipios: [['3550308', 'São Paulo', 'SP'], ['2927408', 'Salvador', 'BA'], ['3548500', 'Santos', 'SP'], ['4316808', 'Santa Maria', 'RS'], ['3304557', 'Rio de Janeiro', 'RJ']],
  dados: {
    '3550308': [['f', 0, 25, 'Aniversário da Cidade'], ['p', -2, 'Sexta-feira Santa'], ['p', 60, 'Corpus Christi'], ['f', 10, 20, 'Dia da Consciência Negra']],
    '3304557': [['f', 0, 20, 'Dia de São Sebastião'], ['p', -47, 'Terça-feira de Carnaval'], ['v', 2026, 3, 23, 'Dia de São Jorge']],
  },
};
const h = createHolidays(fixture);
const find = (r, nome) => r.feriados.find((f) => f.nome === nome);

test('busca sem acento, prefixo primeiro, filtro por UF e limite', () => {
  expect(h.search('sao').map((m) => m.nome)).toEqual(['São Paulo']);
  expect(h.search('san').map((m) => m.nome)).toEqual(['Santos', 'Santa Maria']);
  expect(h.search('lvador').map((m) => m.nome)).toEqual(['Salvador']);
  expect(h.search('san', 'RS').map((m) => m.nome)).toEqual(['Santa Maria']);
  expect(h.search('s', '', 10)).toEqual([]);
  expect(h.search('sa', '', 2)).toHaveLength(2);
});

test('feriados de São Paulo em 2027: nacionais, estadual, municipal e o móvel que virou feriado da cidade', () => {
  const r = h.holidays('3550308', 2027);
  expect(r).toMatchObject({ municipio: 'São Paulo', uf: 'SP', ano: 2027, cobertura: { municipal: 'na base', derivado: true } });
  expect(find(r, 'Aniversário da Cidade')).toMatchObject({ data: '2027-01-25', tipo: 'municipal', fixa: true });
  expect(find(r, 'Revolução Constitucionalista')).toMatchObject({ data: '2027-07-09', tipo: 'estadual' });
  expect(find(r, 'Tiradentes')).toMatchObject({ data: '2027-04-21', tipo: 'nacional' });
  // Páscoa 2027 = 28/03: Sexta Santa 26/03 (uma vez só) e Corpus Christi 27/05, que na cidade é feriado de verdade
  expect(r.feriados.filter((f) => f.data === '2027-03-26')).toHaveLength(1);
  expect(find(r, 'Corpus Christi')).toMatchObject({ data: '2027-05-27', tipo: 'municipal' });
  // 20/11 já é feriado nacional: não repete "Dia da Consciência Negra"
  expect(r.feriados.filter((f) => f.data === '2027-11-20')).toHaveLength(1);
  expect(r.feriados.map((f) => f.data)).toEqual([...r.feriados.map((f) => f.data)].sort());
});

test('feriado que só existe com a data de 2026 não é inventado em outro ano', () => {
  const y26 = h.holidays('3304557', 2026), y27 = h.holidays('3304557', 2027);
  expect(find(y26, 'Dia de São Jorge')).toMatchObject({ data: '2026-04-23' });
  expect(find(y27, 'Dia de São Jorge')?.tipo).toBe('estadual'); // o estadual vem do núcleo, não da base municipal
  expect(y27.cobertura.naoProjetados).toBe(1);
  expect(find(y27, 'Carnaval (terça)')).toMatchObject({ data: '2027-02-09', tipo: 'municipal' });
});

test('cidade sem registro avisa a cobertura; município inexistente é null', () => {
  const r = h.holidays('2927408', 2027);
  expect(r.cobertura).toMatchObject({ municipal: 'sem registro', quantidadeMunicipal: 0 });
  expect(r.feriados.some((f) => f.tipo === 'nacional')).toBe(true);
  expect(h.holidays('9999999', 2027)).toBeNull();
});

let srv, store;
afterEach(async () => {
  store?.close();
  if (srv) await new Promise((ok) => srv.close(ok));
  srv = store = undefined;
});
async function listen() {
  store = openStore();
  srv = createServer(createApp(store, { holidays: h }));
  await new Promise((ok) => srv.listen(0, '127.0.0.1', ok));
  const base = `http://127.0.0.1:${srv.address().port}`;
  return (path) => fetch(base + path);
}

test('API: /api/municipios e /api/feriados com validação e cache', async () => {
  const f = await listen();
  const m = await f('/api/municipios?q=S%C3%A3o&uf=sp');
  expect(m.status).toBe(200);
  expect(m.headers.get('cache-control')).toContain('max-age=86400');
  expect((await m.json()).municipios).toEqual([{ ibge: '3550308', nome: 'São Paulo', uf: 'SP' }]);
  const ok = await f('/api/feriados?ibge=3550308&ano=2027');
  expect(ok.status).toBe(200);
  expect((await ok.json()).feriados.length).toBeGreaterThan(10);
  expect((await f('/api/feriados?ibge=abc&ano=2027')).status).toBe(400);
  expect((await f('/api/feriados?ibge=3550308&ano=1999')).status).toBe(400);
  expect((await f('/api/feriados?ibge=3550308')).status).toBe(400);
  expect((await f('/api/feriados?ibge=9999999&ano=2027')).status).toBe(404);
});

test('dados reais importados: cobertura ampla e capitais conhecidas', () => {
  const real = createHolidays(loadHolidayData());
  expect(real.count).toBe(5570);
  expect(real.withHolidays).toBeGreaterThan(3000);
  const sp = real.holidays('3550308', 2027);
  expect(sp.feriados.find((x) => x.data === '2027-01-25')?.tipo).toBe('municipal');
  const rj = real.holidays('3304557', 2027);
  expect(rj.feriados.find((x) => x.data === '2027-01-20')?.tipo).toBe('municipal');
  expect(real.search('curitiba')[0]).toMatchObject({ uf: 'PR' });
});
