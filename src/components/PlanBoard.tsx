import { useLayoutEffect, useRef, useState } from 'react';
import { fmt } from '../lib/dates';
import { buildIcs, downloadFile, planId, toSaved } from '../lib/export';
import type { SavedApi } from '../hooks/useSavedPlans';
import type { GroupKey, PlanOption, PlanResult, SavedPlan } from '../lib/types';
import { Icon } from './Icon';
import { Strike } from './Strike';
import { planKey, plural, short } from './format';
import { CopyButton, summaryText, tradeoff } from './planParts';

const FILTERS: [GroupKey, string][] = [
  ['all', 'qualquer número de períodos'], ['1', '1 período'], ['2', '2 períodos'], ['3', '3 períodos'],
];
const TOP = 3;

export interface Change { kind: 'up' | 'down' | 'new'; n: number }

interface Props {
  result: PlanResult;
  /** lista da aba já ordenada: planos valendo primeiro, descartados no fim */
  list: PlanOption[];
  discarded: Set<string>;
  /** plano que acabou de ser descartado: o risco é desenhado na hora */
  fresh: string | null;
  onDiscard: (key: string) => void;
  year: number;
  tab: GroupKey;
  onTab: (t: GroupKey) => void;
  selIdx: number;
  onSelect: (i: number) => void;
  selected: PlanOption | null;
  changes: Record<string, Change>;
  onInteract: () => void;
  saved: SavedApi;
  onPrint: (p: SavedPlan) => void;
}

const changeText = (c: Change) =>
  c.kind === 'new' ? 'novo' : `${c.kind === 'up' ? '+' : '−'}${plural(c.n, 'dia', 'dias')}`;

export function PlanBoard({ result, list, discarded, fresh, onDiscard, year, tab, onTab, selIdx, onSelect, selected, changes, onInteract, saved, onPrint }: Props) {
  const [more, setMore] = useState(false);
  const live = list.filter((r) => !discarded.has(planKey(r)));
  const nOff = list.length - live.length;
  // posição original na aba: "Plano 4" continua sendo o 4 mesmo depois de descartar o 2
  const rank = new Map((result.groups[tab] || []).map((r, i) => [planKey(r), i + 1]));
  const canMore = result.groups.all.length > TOP || tab !== 'all' || nOff > 0;
  const open = more && canMore;
  const shown = open ? list : live.slice(0, TOP);
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
    if (open && !live.slice(0, TOP).some((r) => selected && planKey(r) === planKey(selected))) onSelect(0);
    setMore(!open);
  };

  return (
    <section className="plans-sec" aria-labelledby="planos-t" onPointerEnter={onInteract} onFocusCapture={onInteract} onClick={onInteract}>
      <h2 id="planos-t">Escolha um plano</h2>
      {shown.length > 0 && (
        <div className="chips" role="radiogroup" aria-labelledby="planos-t">
          {shown.map((r, i) => {
            const k = planKey(r), ch = changes[k], on = i === selIdx, off = discarded.has(k);
            const best = tab === 'all' && i === 0 && !off, n = rank.get(k) ?? i + 1;
            const ranges = r.periods.map((p) => `${fmt(p.s)} a ${fmt(p.e)}`).join('; ');
            return (
              <label key={k} className={'plan' + (on ? ' on' : '') + (off ? ' off' : '')} ref={(el) => { if (el) rows.current.set(k, el); else rows.current.delete(k); }}>
                <input type="radio" className="plan-radio" name="plano" checked={on} onChange={() => onSelect(i)}
                  aria-label={`${best ? 'Melhor opção: ' : ''}Plano ${n}${off ? ' (descartado)' : ''}, ${r.off} dias fora do trabalho, ${tradeoff(r)}. Férias: ${ranges}.${ch ? ` Mudou: ${ch.kind === 'new' ? 'plano novo' : `${ch.kind === 'up' ? 'mais' : 'menos'} ${plural(ch.n, 'dia', 'dias')} fora`}.` : ''}`} />
                <span className="plan-top">
                  <b>Plano {n}</b>
                  {best && <span className="badge">Melhor opção</span>}
                  {ch && <span className={'plan-change ' + ch.kind} aria-hidden="true">{ch.kind !== 'new' && <Icon name={ch.kind} />}{changeText(ch)}</span>}
                  {on && <span className="plan-on" aria-hidden="true"><Icon name="check" /></span>}
                </span>
                <span className="plan-off"><b className="mono">{r.off}</b> dias fora</span>
                <span className="plan-dates mono" aria-hidden="true">
                  {r.periods.map((p) => <span key={p.s}>{short(p.s)} a {short(p.e)}<small>{p.L}d</small></span>)}
                </span>
                <span className="plan-meta">{off ? 'Descartado' : plural(r.k, 'período', 'períodos')}</span>
                {off && <Strike draw={fresh === k} />}
                <button type="button" className="plan-x" aria-label={`${off ? 'Restaurar' : 'Descartar'} plano ${n}`} title={off ? 'Restaurar plano' : 'Descartar plano'}
                  onClick={() => onDiscard(k)}>
                  <Icon name={off ? 'undo' : 'cross'} />
                </button>
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
          {nOff > 0 && !open && <span className="hint">{plural(nOff, 'plano descartado', 'planos descartados')}: veja em Ver mais planos.</span>}
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
      {selected && <Actions selected={selected} year={year} N={result.N} saved={saved} onPrint={onPrint} />}
    </section>
  );
}

function Actions({ selected, year, N, saved, onPrint }: { selected: PlanOption; year: number; N: number; saved: SavedApi; onPrint: (p: SavedPlan) => void }) {
  const id = planId(year, selected);
  const on = saved.has(id);
  const blocked = saved.full && !on;
  const snap = () => toSaved(selected, year, N);
  return (
    <div className="act">
      <div className="act-btns">
        <CopyButton text={summaryText(selected, year, N)} />
        <button type="button" className="sec" onClick={() => onPrint(snap())}><Icon name="download" />Salvar PDF</button>
        <button type="button" className="sec" onClick={() => downloadFile(`ferias-${year}.ics`, buildIcs(snap()), 'text/calendar')}>
          <Icon name="calendar" />Adicionar ao calendário (.ics)
        </button>
        <button type="button" className="sec keep" aria-pressed={on} disabled={blocked} aria-describedby={blocked ? 'saved-full' : undefined}
          onClick={() => saved.toggle(snap())}>
          <Icon name="bookmark" />{on ? 'Plano salvo' : 'Salvar plano'}
        </button>
      </div>
      {blocked && <p className="art136" id="saved-full">Você já salvou 12 planos. Remova um da lista para salvar outro.</p>}
      <p className="art136">Quem define a época das férias é o empregador (CLT, art. 136): leve isto como uma proposta para negociar.</p>
    </div>
  );
}
