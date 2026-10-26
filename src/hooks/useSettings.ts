import { useEffect, useState } from 'react';
import type { Settings } from '../lib/types';

const KEY = 'planejador-ferias-v1';

export const DEFAULTS: Settings = {
  year: 2027, city: '', uf: '', total: 30, parts: { 1: true, 2: true, 3: true },
  minPart: 5, maxMin: 14, wStart: '', wEnd: '', months: Array(12).fill(true),
  carnaval: true, corpus: true, penal: true, split: 0, custom: [],
};

function load(): Settings {
  const fresh: Settings = JSON.parse(JSON.stringify(DEFAULTS));
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return Object.assign(fresh, JSON.parse(raw));
  } catch { /* localStorage indisponível ou JSON inválido: usa o padrão */ }
  return fresh;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(load);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch { /* ignora */ }
  }, [settings]);
  const update = (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch }));
  return { settings, update };
}
