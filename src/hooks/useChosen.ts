import { useCallback, useEffect, useState } from 'react';
import { validPlan } from '../../shared/planShape.mjs';
import type { SavedPlan } from '../lib/types';

const KEY = 'planejador-ferias-chosen-v1';

function load(): SavedPlan | null {
  try {
    const raw = localStorage.getItem(KEY);
    const p = raw ? JSON.parse(raw) : null;
    return validPlan(p) ? p : null;
  } catch { return null; /* localStorage indisponível ou JSON inválido */ }
}

/** O plano que a pessoa escolheu de fato (um só): é o que o grupo enxerga. Guardado como foto de datas e dias. */
export function useChosen() {
  const [chosen, setChosen] = useState<SavedPlan | null>(load);
  useEffect(() => {
    try {
      if (chosen) localStorage.setItem(KEY, JSON.stringify(chosen)); else localStorage.removeItem(KEY);
    } catch { /* ignora */ }
  }, [chosen]);
  const choose = useCallback((p: SavedPlan) => setChosen(p), []);
  const clear = useCallback(() => setChosen(null), []);
  /** Escolhe se ainda não é esse, desmarca se já é. */
  const toggle = useCallback((p: SavedPlan) => setChosen((c) => (c?.id === p.id ? null : p)), []);
  return { chosen, choose, clear, toggle };
}

export type ChosenApi = ReturnType<typeof useChosen>;
