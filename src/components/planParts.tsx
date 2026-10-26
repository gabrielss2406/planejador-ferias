import { useState } from 'react';
import { fmt, parseISO } from '../lib/dates';
import { Icon } from './Icon';
import type { KeyDate, PlanLike, PlanOption } from '../lib/types';

/** Resumo em texto: serve ao plano calculado e ao plano salvo. */
export function summaryText(r: PlanLike, year: number, N: number) {
  const lines = [`Plano de férias ${year}: ${N} dias → ${r.off} dias fora do trabalho`];
  r.periods.forEach((p, i) => {
    lines.push(`${i + 1}) ${fmt(p.s)} a ${fmt(p.e)} (${p.L} dias) — sem trabalhar de ${fmt(p.xs)} a ${fmt(p.xe)}`);
  });
  return lines.join('\n');
}

/** Rótulo curto de trade-off, calculado só dos períodos do plano. */
export function tradeoff(r: PlanOption) {
  const biggest = Math.max(...r.periods.map((p) => p.L));
  if (r.k === 1) return `só 1 período de ${biggest} dias`;
  return `${r.k} períodos, maior período: ${biggest} dias`;
}

export function KeyStatus({ r, custom }: { r: PlanOption; custom: KeyDate[] }) {
  const items = custom.filter((c) => c.type === 'incluir');
  if (!items.length) return null;
  const covered = (d: number) => r.periods.some((p) => d >= p.xs && d <= p.xe);
  return (
    <div className="keystat">
      {items.map((c) => {
        const a = parseISO(c.start);
        if (a == null) return null;
        const b = Math.max(a, parseISO(c.end) ?? a);
        let n = 0, t = 0;
        for (let d = a; d <= b; d++) { t++; if (covered(d)) n++; }
        const name = c.label || 'Data-chave';
        if (n === t) return <span key={c.id} className="ok"><Icon name="check" />{name} fica nos dias sem trabalhar</span>;
        if (n > 0) return <span key={c.id} className="part"><Icon name="half" />{name}: cobre {n} de {t} dias</span>;
        return <span key={c.id} className="no"><Icon name="cross" />{name} fica fora</span>;
      })}
    </div>
  );
}

interface CopyProps { text: string; label?: string; className?: string; context?: string }

/** `context` entra só para leitor de tela, para distinguir botões iguais em uma lista. */
export function CopyButton({ text, label = 'Copiar resumo', className = 'copy', context }: CopyProps) {
  const [shown, setShown] = useState<string | null>(null);
  const done = (ok: boolean) => {
    setShown(ok ? 'Copiado' : 'Não foi possível copiar');
    setTimeout(() => setShown(null), 1800);
  };
  const ok = shown === 'Copiado';
  return (
    <button type="button" className={className} data-done={ok || undefined} onClick={() => {
      try { navigator.clipboard.writeText(text).then(() => done(true), () => done(false)); } catch { done(false); }
    }}>{ok && <span className="done-ic"><Icon name="check" /></span>}{shown ?? label}{context && <span className="sr"> {context}</span>}</button>
  );
}
