import { useState } from 'react';
import { fmt, parseISO } from '../lib/dates';
import type { GroupKey, KeyDate, Period, PlanOption, PlanResult } from '../lib/types';

const TABS: [GroupKey, string][] = [['all', 'Melhores'], ['1', '1 período'], ['2', '2 períodos'], ['3', '3 períodos']];

function summaryText(r: PlanOption, year: number, N: number) {
  const lines = [`Plano de férias ${year}: ${N} dias → ${r.off} dias fora do trabalho`];
  r.periods.forEach((p, i) => {
    lines.push(`${i + 1}) ${fmt(p.s)} a ${fmt(p.e)} (${p.L} dias) — folga contínua de ${fmt(p.xs)} a ${fmt(p.xe)}`);
  });
  return lines.join('\n');
}

function Chips({ p }: { p: Period }) {
  const wg = p.weekendGain ?? 0;
  return (
    <div className="chips">
      {wg > 0 && <span className="chip">+{wg} dia{wg > 1 ? 's' : ''} de fim de semana</span>}
      {p.holGain?.map((x) => <span key={x.d} className="chip h">{x.name} · {fmt(x.d)}</span>)}
      {p.holInside?.map((x) => <span key={x.d} className="chip warn">feriado dentro das férias: {x.name}</span>)}
    </div>
  );
}

function KeyStatus({ r, custom }: { r: PlanOption; custom: KeyDate[] }) {
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

function CopyButton({ text }: { text: string }) {
  const [label, setLabel] = useState('Copiar resumo');
  const done = (ok: boolean) => {
    setLabel(ok ? 'Copiado' : 'Não foi possível copiar');
    setTimeout(() => setLabel('Copiar resumo'), 1800);
  };
  return (
    <button type="button" className="btn ghost" onClick={(e) => {
      e.stopPropagation();
      try { navigator.clipboard.writeText(text).then(() => done(true), () => done(false)); } catch { done(false); }
    }}>{label}</button>
  );
}

interface Props {
  result: PlanResult;
  year: number;
  custom: KeyDate[];
  tab: GroupKey;
  onTab: (t: GroupKey) => void;
  selIdx: number;
  onSelect: (i: number) => void;
}

export function PlanList({ result, year, custom, tab, onTab, selIdx, onSelect }: Props) {
  const list = result.groups[tab] || [];
  return (
    <>
      <div className="tabs" role="tablist" aria-label="Filtrar por número de períodos">
        {TABS.map(([key, label]) => (
          <button key={key} className="tab" role="tab" aria-selected={tab === key}
            disabled={!result.groups[key].length} onClick={() => onTab(key)}>{label}</button>
        ))}
      </div>
      <section className="plans" aria-live="polite">
        {!list.length ? (
          <div className="empty">
            <b>{result.error ?? 'Nenhuma combinação encontrada.'}</b><br />
            Tente liberar mais meses, ampliar a janela, remover datas bloqueadas ou permitir mais períodos.
          </div>
        ) : list.map((r, i) => (
          <article key={i} className="plan" tabIndex={0} role="button" aria-pressed={i === selIdx}
            onClick={() => onSelect(i)}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) { e.preventDefault(); onSelect(i); }
            }}>
            <div className="plan-top"><span className="big">{r.off}</span><span className="big-l">dias fora do trabalho</span></div>
            <div className="plan-sub">{result.N} dias de férias, +{r.gain} emendados, {r.k} período{r.k > 1 ? 's' : ''}</div>
            <ul className="pers">
              {r.periods.map((p) => (
                <li key={p.s}>
                  <div className="pr"><b>{p.L} dias</b>{fmt(p.s)} → {fmt(p.e)}</div>
                  <div className="fx">Folga contínua de {fmt(p.xs)} a {fmt(p.xe)} ({p.xe - p.xs + 1} dias)</div>
                  <Chips p={p} />
                </li>
              ))}
            </ul>
            <KeyStatus r={r} custom={custom} />
            <div className="actions"><CopyButton text={summaryText(r, year, result.N)} /></div>
          </article>
        ))}
      </section>
    </>
  );
}
