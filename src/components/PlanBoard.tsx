import { useLayoutEffect, useRef } from 'react';
import { fmt } from '../lib/dates';
import type { GroupKey, PlanOption, PlanResult } from '../lib/types';
import { Icon } from './Icon';
import { planKey, plural } from './format';
import { CopyButton, summaryText, tradeoff } from './planParts';

const TABS: [GroupKey, string][] = [['all', 'Melhores'], ['1', '1 período'], ['2', '2 períodos'], ['3', '3 períodos']];

export interface Change { kind: 'up' | 'down' | 'new'; n: number }

interface Props {
  result: PlanResult;
  year: number;
  tab: GroupKey;
  onTab: (t: GroupKey) => void;
  selIdx: number;
  onSelect: (i: number) => void;
  selected: PlanOption | null;
  changes: Record<string, Change>;
  onInteract: () => void;
}

const changeText = (c: Change) =>
  c.kind === 'new' ? 'novo' : `${c.kind === 'up' ? '+' : '−'}${plural(c.n, 'dia', 'dias')}`;

export function PlanBoard({ result, year, tab, onTab, selIdx, onSelect, selected, changes, onInteract }: Props) {
  const list = result.groups[tab] || [];
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const rows = useRef(new Map<string, HTMLElement>());
  const tops = useRef(new Map<string, number>());
  const lastTab = useRef(tab);

  // Reordena no lugar: cada linha tem a identidade do plano (datas de início) e desliza da posição
  // antiga para a nova (FLIP com Web Animations). Sem animação com prefers-reduced-motion.
  useLayoutEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const sameList = lastTab.current === tab;
    lastTab.current = tab;
    const next = new Map<string, number>();
    rows.current.forEach((el, k) => {
      next.set(k, el.offsetTop);
      const before = tops.current.get(k);
      if (!reduce && sameList && before !== undefined && before !== el.offsetTop && typeof el.animate === 'function') {
        el.animate(
          [{ transform: `translateY(${before - el.offsetTop}px)` }, { transform: 'translateY(0)' }],
          { duration: 360, easing: 'cubic-bezier(.16,1,.3,1)' },
        );
      }
    });
    tops.current = next;
  });

  const onTabKey = (e: React.KeyboardEvent) => {
    const enabled = TABS.filter(([k]) => result.groups[k].length).map(([k]) => k);
    const cur = enabled.indexOf(tab);
    let next = -1;
    if (e.key === 'ArrowRight') next = (cur + 1) % enabled.length;
    else if (e.key === 'ArrowLeft') next = (cur - 1 + enabled.length) % enabled.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = enabled.length - 1;
    if (next < 0 || !enabled.length) return;
    e.preventDefault();
    onTab(enabled[next]);
    tabRefs.current[enabled[next]]?.focus();
  };

  return (
    <section className="side" aria-labelledby="planos-t" onPointerEnter={onInteract} onFocusCapture={onInteract} onClick={onInteract}>
      <h2 id="planos-t" className="sr">Planos de férias</h2>
      <div className="tabs" role="tablist" aria-label="Filtrar por número de períodos" onKeyDown={onTabKey}>
        {TABS.map(([key, label]) => (
          <button key={key} id={`tab-${key}`} ref={(el) => { tabRefs.current[key] = el; }} className="tab" role="tab"
            aria-selected={tab === key} aria-controls="plans-panel" tabIndex={tab === key ? 0 : -1}
            disabled={!result.groups[key].length} title={result.groups[key].length ? undefined : key === 'all' ? 'Nenhuma opção encontrada' : `Nenhuma opção com ${label.toLowerCase()}`}
            onClick={() => onTab(key)}>
            {label}{!result.groups[key].length && <span className="sr"> (sem opções)</span>}
          </button>
        ))}
      </div>
      <div id="plans-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="board">
        {!list.length ? (
          <div className="empty">
            <b>{result.error ?? 'Nenhuma combinação encontrada.'}</b>
            <span>Tente liberar mais meses, ampliar a janela, remover datas bloqueadas ou permitir mais períodos.</span>
          </div>
        ) : (
          <>
            <div className="board-head" aria-hidden="true">
              <span>Plano</span><span>Fora</span><span>Per.</span><span>Maior bloco</span>
            </div>
            <div className="plans" role="radiogroup" aria-label="Opções de plano de férias">
              {list.map((r, i) => {
                const k = planKey(r), ch = changes[k], on = i === selIdx, best = tab === 'all' && i === 0;
                const biggest = Math.max(...r.periods.map((p) => p.L));
                const ranges = r.periods.map((p) => `${fmt(p.s)} a ${fmt(p.e)}`).join('; ');
                return (
                  <label key={k} className={'plan' + (on ? ' on' : '')} ref={(el) => { if (el) rows.current.set(k, el); else rows.current.delete(k); }}>
                    <input type="radio" className="plan-radio" name="plano" checked={on} onChange={() => onSelect(i)}
                      aria-label={`${best ? 'Melhor opção: ' : ''}Opção ${i + 1}, ${r.off} dias fora do trabalho, ${tradeoff(r)}. Férias: ${ranges}.${ch ? ` Mudou: ${ch.kind === 'new' ? 'plano novo' : `${ch.kind === 'up' ? 'mais' : 'menos'} ${plural(ch.n, 'dia', 'dias')} fora`}.` : ''}`} />
                    {ch && <span className={'plan-change ' + ch.kind} aria-hidden="true">{ch.kind !== 'new' && <Icon name={ch.kind} />}{changeText(ch)}</span>}
                    <span className="plan-name">
                      <b>Opção {i + 1}</b>
                      {best && <span className="badge">Melhor opção</span>}
                      {on && <span className="mark"><Icon name="check" />Selecionado</span>}
                    </span>
                    <b className="num">{r.off} d</b>
                    <b className="num">{r.k}</b>
                    <b className="num">{biggest} d</b>
                  </label>
                );
              })}
            </div>
          </>
        )}
      </div>
      {selected && <CopyButton text={summaryText(selected, year, result.N)} />}
    </section>
  );
}
