import { useCallback, useEffect, useState } from 'react';
import { validPlan } from '../../shared/planShape.mjs';
import type { SavedPlan } from '../lib/types';

const KEY = 'planejador-ferias-saved-v1';
export const MAX_SAVED = 12;

function load(): SavedPlan[] {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    if (Array.isArray(arr)) return arr.filter(validPlan).slice(0, MAX_SAVED);
  } catch { /* localStorage indisponível ou JSON inválido: começa vazio */ }
  return [];
}

/** Planos favoritos: fotos (datas e dias) guardadas no navegador, mais novo primeiro, até 12. */
export function useSavedPlans() {
  const [plans, setPlans] = useState<SavedPlan[]>(load);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(plans)); } catch { /* ignora */ }
  }, [plans]);

  const has = useCallback((id: string) => plans.some((p) => p.id === id), [plans]);
  const full = plans.length >= MAX_SAVED;
  const remove = useCallback((id: string) => setPlans((l) => l.filter((p) => p.id !== id)), []);
  /** Salva se ainda não está salvo, remove se está. Sem duplicar o mesmo id; cheio não salva. */
  const toggle = useCallback((p: SavedPlan) => setPlans((l) => {
    if (l.some((q) => q.id === p.id)) return l.filter((q) => q.id !== p.id);
    return l.length >= MAX_SAVED ? l : [p, ...l];
  }), []);

  return { plans, has, full, toggle, remove };
}

export type SavedApi = ReturnType<typeof useSavedPlans>;
