import { useLayoutEffect, useRef, useState } from 'react';
import { fmt } from '../lib/dates';
import type { GroupKey, PlanOption, PlanResult } from '../lib/types';
import { Icon } from './Icon';
import { planKey, plural } from './format';
import { CopyButton, summaryText, tradeoff } from './planParts';

const FILTERS: [GroupKey, string][] = [
  ['all', 'qualquer número de períodos'], ['1', '1 período'], ['2', '2 períodos'], ['3', '3 períodos'],
];
const TOP = 3;

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
  const [more, setMore] = useState(false);
  const canMore = result.groups.all.length > TOP || tab !== 'all';
  const open = more && canMore;
  const shown = open ? list : list.slice(0, TOP);
  const rows = useRef(new Map<string, HTMLElement>());
  const tops = useRef(new Map<string, { x: number; y: number }>());
  const lastTab = useRef(tab);

  // Reordena no lugar: cada cartão tem a identidade do plano (datas de início) e desliza da posição
  // antiga para a nova (FLIP com Web Animations). Sem animação com prefers-reduced-motion.
  useLayoutEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const sameList = lastTab.current === tab;
    lastTab.current = tab;
    const next = new Map<string, { x: number; y: number }>();
    rows.current.forEach((el, k) => {
      const pos = { x: el.offsetLeft, y: el.offsetTop };
      next.set(k, pos);
      const before = tops.current.get(k);
      if (!reduce && sameList && before && (before.x !== pos.x || before.y !== pos.y) && typeof el.animate === 'function') {
        el.animate(
          [{ transform: `translate(${before.x - pos.x}px,${before.y - pos.y}px)` }, { transform: 'translate(0,0)' }],
          { duration: 360, easing: 'cubic-bezier(.16,1,.3,1)' },
        );
      }
    });
    tops.current = next;
  });

  const toggle = () => {
    if (open && selIdx >= TOP) onSelect(0);
    setMore(!open);
  };

  return (
    <section className="plans-sec" aria-labelledby="planos-t" onPointerEnter={onInteract} onFocusCapture={onInteract} onClick={onInteract}>
      <h2 id="planos-t">Escolha um plano</h2>
      {shown.length > 0 && (
        <div className="chips" role="radiogroup" aria-labelledby="planos-t">
          {shown.map((r, i) => {
            const k = planKey(r), ch = changes[k], on = i === selIdx, best = tab === 'all' && i === 0;
            const ranges = r.periods.map((p) => `${fmt(p.s)} a ${fmt(p.e)}`).join('; ');
            return (
              <label key={k} className={'plan' + (on ? ' on' : '')} ref={(el) => { if (el) rows.current.set(k, el); else rows.current.delete(k); }}>
                <input type="radio" className="plan-radio" name="plano" checked={on} onChange={() => onSelect(i)}
                  aria-label={`${best ? 'Melhor opção: ' : ''}Plano ${i + 1}, ${r.off} dias fora do trabalho, ${tradeoff(r)}. Férias: ${ranges}.${ch ? ` Mudou: ${ch.kind === 'new' ? 'plano novo' : `${ch.kind === 'up' ? 'mais' : 'menos'} ${plural(ch.n, 'dia', 'dias')} fora`}.` : ''}`} />
                <span className="plan-top">
                  <b>Plano {i + 1}</b>
                  {best && <span className="badge">Melhor opção</span>}
                  {ch && <span className={'plan-change ' + ch.kind} aria-hidden="true">{ch.kind !== 'new' && <Icon name={ch.kind} />}{changeText(ch)}</span>}
                  {on && <span className="plan-on" aria-hidden="true"><Icon name="check" /></span>}
                </span>
                <span className="plan-off"><b className="mono">{r.off}</b> dias fora</span>
                <span className="plan-meta">{plural(r.k, 'período', 'períodos')}</span>
              </label>
            );
          })}
        </div>
      )}
      {canMore && (
        <div className="more-plans">
          <button type="button" className="link-btn" aria-expanded={open} onClick={toggle}>
            {open ? 'Ver só os 3 melhores' : 'Ver mais planos'}
          </button>
          {open && (
            <label className="filter">Mostrar planos com
              <select value={tab} onChange={(e) => onTab(e.target.value as GroupKey)}>
                {FILTERS.map(([key, label]) => (
                  <option key={key} value={key} disabled={!result.groups[key].length}>{label}{result.groups[key].length ? '' : ' (nenhum)'}</option>
                ))}
              </select>
            </label>
          )}
        </div>
      )}
      {selected && (
        <div className="act">
          <CopyButton text={summaryText(selected, year, result.N)} />
          <p className="art136">Quem define a época das férias é o empregador (CLT, art. 136): leve isto como uma proposta para negociar.</p>
        </div>
      )}
    </section>
  );
}
