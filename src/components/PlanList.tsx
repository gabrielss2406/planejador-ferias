import { useRef } from 'react';
import { fmt } from '../lib/dates';
import type { GroupKey, KeyDate, PlanResult } from '../lib/types';
import { MiniRibbon } from './MiniRibbon';
import { Chips, KeyStatus, tradeoff } from './planParts';
import { SelectedPlan } from './SelectedPlan';

const TABS: [GroupKey, string][] = [['all', 'Melhores'], ['1', '1 período'], ['2', '2 períodos'], ['3', '3 períodos']];

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
  const selected = list[selIdx] ?? null;
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

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
    <>
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
      <div id="plans-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="results-layout">
        {!list.length ? (
          <div className="empty">
            <b>{result.error ?? 'Nenhuma combinação encontrada.'}</b><br />
            Tente liberar mais meses, ampliar a janela, remover datas bloqueadas ou permitir mais períodos.
          </div>
        ) : (
          <>
            {selected && <SelectedPlan option={selected} result={result} year={year} custom={custom} position={selIdx + 1} />}
            <section className="plans" role="radiogroup" aria-label="Opções de plano de férias">
              {list.map((r, i) => {
                const best = tab === 'all' && i === 0;
                const on = i === selIdx;
                return (
                  <div key={i} className="plan">
                    <input type="radio" className="plan-radio" name="plano" checked={on} onChange={() => onSelect(i)}
                      aria-label={`${best ? 'Melhor opção: ' : ''}${r.off} dias fora do trabalho, ${tradeoff(r)}`} />
                    <span className="plan-mark" aria-hidden="true" />
                    <div className="plan-tags">
                      {best && <span className="tag best">Melhor opção</span>}
                      <span className="tag">{tradeoff(r)}</span>
                      {on && <span className="tag sel">Selecionado</span>}
                    </div>
                    <div className="plan-top"><span className="big">{r.off}</span><span className="big-l">dias fora do trabalho</span></div>
                    <div className="plan-sub">{result.N} dias de férias, +{r.gain} emendados</div>
                    <MiniRibbon year={year} option={r} result={result} />
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
                  </div>
                );
              })}
            </section>
          </>
        )}
      </div>
    </>
  );
}
