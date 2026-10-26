import { useState } from 'react';
import { fmt, parseISO } from '../lib/dates';
import type { KeyDate, Period, PlanOption } from '../lib/types';

export function summaryText(r: PlanOption, year: number, N: number) {
  const lines = [`Plano de férias ${year}: ${N} dias → ${r.off} dias fora do trabalho`];
  r.periods.forEach((p, i) => {
    lines.push(`${i + 1}) ${fmt(p.s)} a ${fmt(p.e)} (${p.L} dias) — folga contínua de ${fmt(p.xs)} a ${fmt(p.xe)}`);
  });
  return lines.join('\n');
}

/** Rótulo curto de trade-off, calculado só dos períodos do plano. */
export function tradeoff(r: PlanOption) {
  const biggest = Math.max(...r.periods.map((p) => p.L));
  if (r.k === 1) return `só 1 período de ${biggest} dias`;
  return `${r.k} períodos, maior bloco: ${biggest} dias`;
}

export function Chips({ p }: { p: Period }) {
  const wg = p.weekendGain ?? 0;
  return (
    <div className="chips">
      {wg > 0 && <span className="chip">+{wg} dia{wg > 1 ? 's' : ''} de fim de semana</span>}
      {p.holGain?.map((x) => <span key={x.d} className="chip h">{x.name} · {fmt(x.d)}</span>)}
      {p.holInside?.map((x) => <span key={x.d} className="chip warn">feriado dentro das férias: {x.name}</span>)}
    </div>
  );
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
        if (n === t) return <span key={c.id} className="ok">✓ {name} fica na folga</span>;
        if (n > 0) return <span key={c.id} className="part">◐ {name}: cobre {n} de {t} dias</span>;
        return <span key={c.id} className="no">✗ {name} fica fora</span>;
      })}
    </div>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [label, setLabel] = useState('Copiar resumo');
  const done = (ok: boolean) => {
    setLabel(ok ? 'Copiado' : 'Não foi possível copiar');
    setTimeout(() => setLabel('Copiar resumo'), 1800);
  };
  return (
    <button type="button" className="btn ghost" onClick={() => {
      try { navigator.clipboard.writeText(text).then(() => done(true), () => done(false)); } catch { done(false); }
    }}>{label}</button>
  );
}
