import { idx } from './dates';

export interface City { ibge: string; nome: string; uf: string }

export interface CityHolidays {
  hol: { i: number; name: string }[];
  /** quantos feriados municipais a base tem para o ano pedido */
  count: number;
  inBase: boolean;
}

async function getJson(url: string, signal?: AbortSignal) {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}

/** Busca municípios por nome (sem acento); pelo menos 2 letras. */
export async function searchCities(q: string, uf = '', signal?: AbortSignal): Promise<City[]> {
  const p = new URLSearchParams({ q, limit: '8' });
  if (uf) p.set('uf', uf);
  const data = await getJson(`/api/municipios?${p}`, signal);
  return Array.isArray(data.municipios) ? data.municipios : [];
}

const dayIndex = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return idx(y, m - 1, d); };

/** Feriados municipais de um município nos anos `years` (a API responde por ano). */
export async function fetchCityHolidays(ibge: string, years: number[], mainYear: number, signal?: AbortSignal): Promise<CityHolidays> {
  const all = await Promise.all(years.map((y) => getJson(`/api/feriados?ibge=${ibge}&ano=${y}`, signal)));
  const hol: CityHolidays['hol'] = [];
  let count = 0, inBase = false;
  all.forEach((r, k) => {
    const mun = (r.feriados ?? []).filter((f: { tipo: string }) => f.tipo === 'municipal');
    mun.forEach((f: { data: string; nome: string }) => hol.push({ i: dayIndex(f.data), name: f.nome }));
    if (years[k] === mainYear) { count = mun.length; inBase = r.cobertura?.municipal === 'na base'; }
  });
  return { hol, count, inBase };
}
