import { useCallback, useEffect, useRef, useState } from 'react';

/** Tempo da "caneta" riscando antes de o plano descartado ir para o fim da lista. */
export const STRIKE_MS = 800;

/**
 * Planos descartados (identidade = planKey). `discarded` muda na hora e desenha o risco;
 * `settled` só acompanha depois da animação e é o que reordena a lista.
 */
export function useDiscarded() {
  const [discarded, setDiscarded] = useState<Set<string>>(() => new Set());
  const [settled, setSettled] = useState<Set<string>>(() => new Set());
  const [fresh, setFresh] = useState<string | null>(null);
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);

  /** `onCommit` roda quando a ordem muda de fato (já ou depois da animação). */
  const toggle = useCallback((key: string, onCommit: (next: Set<string>) => void) => {
    window.clearTimeout(timer.current);
    const next = new Set(discarded);
    const adding = !next.has(key);
    if (adding) next.add(key); else next.delete(key);
    setDiscarded(next);
    if (!adding) {
      setFresh(null);
      setSettled(next);
      onCommit(next);
      return;
    }
    setFresh(key);
    timer.current = window.setTimeout(() => { setFresh(null); setSettled(next); onCommit(next); }, STRIKE_MS);
  }, [discarded]);

  return { discarded, settled, fresh, toggle };
}

/** Planos ainda valendo primeiro, descartados no fim; a ordem original se mantém dentro de cada grupo. */
export function arrange<T>(list: T[], key: (t: T) => string, off: Set<string>): T[] {
  return [...list.filter((t) => !off.has(key(t))), ...list.filter((t) => off.has(key(t)))];
}
