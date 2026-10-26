import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import logo from './assets/logo-negativo.png';
import { defaultPeriod, planKey } from './components/format';
import { HolidayList } from './components/HolidayList';
import { HowItWorks } from './components/HowItWorks';
import { MonthSheet } from './components/MonthSheet';
import { GroupSection } from './components/GroupSection';
import { PlanBoard, type Change } from './components/PlanBoard';
import { FloatingOptions } from './components/FloatingOptions';
import { SavedPlans } from './components/SavedPlans';
import { QuickParams } from './components/SettingsPanel';
import { Ticket } from './components/Ticket';
import { Calendar } from './components/YearView';
import { YearRuler } from './components/YearRuler';
import { arrange, useDiscarded } from './hooks/useDiscarded';
import { useChosen } from './hooks/useChosen';
import { useGroup } from './hooks/useGroup';
import { useSavedPlans } from './hooks/useSavedPlans';
import { useSettings } from './hooks/useSettings';
import { planId } from './lib/export';
import { plan } from './lib/planner';
import type { GroupKey, PlanResult } from './lib/types';

/** plano (identidade) -> dias fora, de todas as abas */
const snapshot = (r: PlanResult) => {
  const m = new Map<string, number>();
  (Object.values(r.groups)).forEach((g) => g.forEach((o) => m.set(planKey(o), o.off)));
  return m;
};

export default function App() {
  const { settings, update } = useSettings();
  const saved = useSavedPlans();
  const chosen = useChosen();
  const group = useGroup(chosen.chosen);
  const deferred = useDeferredValue(settings);
  const result = useMemo(() => plan(deferred), [deferred]);
  const [tab, setTab] = useState<GroupKey>('all');
  const [selIdx, setSelIdx] = useState(0);
  const [perSel, setPerSel] = useState<{ key: string; i: number } | null>(null);

  // mudar qualquer parâmetro volta a seleção para a melhor opção
  useEffect(() => { setSelIdx(0); }, [result]);

  // filtro sem planos (ex.: depois de mudar um parâmetro) volta para "qualquer número"
  const eff: GroupKey = result.groups[tab].length ? tab : 'all';
  const { discarded, settled, fresh, toggle } = useDiscarded();
  const base = result.groups[eff] || [];
  const list = arrange(base, planKey, settled);
  const selected = list[selIdx] ?? list[0] ?? null;
  const selKey = selected ? planKey(selected) : '';
  const active = selected && perSel?.key === selKey ? Math.min(perSel.i, selected.periods.length - 1) : null;
  const per = active ?? (selected ? defaultPeriod(selected) : 0);
  // o calendário do ano abre sozinho no desktop; no celular fica recolhido
  const [calOpen, setCalOpen] = useState(() => !!window.matchMedia?.('(min-width: 981px)').matches);

  // Linhas que mudaram desde a última vez que o usuário olhou a tabela: o que foi visto por último
  // fica em baseline e só é comparável com o mesmo ano.
  const baseline = useRef<{ year: number; off: Map<string, number> } | null>(null);
  const latest = useRef<{ year: number; off: Map<string, number> }>({ year: deferred.year, off: new Map() });
  const [changes, setChanges] = useState<Record<string, Change>>({});
  useEffect(() => {
    const cur = { year: deferred.year, off: snapshot(result) };
    latest.current = cur;
    const base = baseline.current;
    if (!base || base.year !== cur.year || !base.off.size || !cur.off.size) {
      baseline.current = cur;
      setChanges({});
      return;
    }
    const next: Record<string, Change> = {};
    cur.off.forEach((off, k) => {
      const was = base.off.get(k);
      if (was === undefined) next[k] = { kind: 'new', n: 0 };
      else if (off !== was) next[k] = { kind: off > was ? 'up' : 'down', n: Math.abs(off - was) };
    });
    setChanges((c) => (Object.keys(c).length === 0 && Object.keys(next).length === 0 ? c : next));
  }, [result, deferred.year]);
  const seen = useCallback(() => {
    baseline.current = latest.current;
    setChanges((c) => (Object.keys(c).length ? {} : c));
  }, []);

  // descartar/restaurar: a seleção acompanha o mesmo plano quando a lista reordena; ao descartar o
  // plano aberto, passa para o primeiro que ainda vale
  const discard = (key: string) => {
    // descartar o plano que era o escolhido tira a escolha
    const opt = base.find((o) => planKey(o) === key);
    if (opt && !discarded.has(key) && chosen.chosen?.id === planId(deferred.year, opt)) chosen.clear();
    toggleDiscard(key);
  };
  const toggleDiscard = (key: string) => toggle(key, (next) => {
    const order = arrange(base, planKey, next);
    const target = next.has(key) && key === selKey ? order[0] : selected;
    setSelIdx(Math.max(0, order.findIndex((o) => target && planKey(o) === planKey(target))));
  });

  const pick = (i: number | null) => { if (selected) setPerSel(i === null ? null : { key: selKey, i }); };

  return (
    <>
      <div className="app">
        <header className="top">
          <h1 className="brand"><img src={logo} alt="Planejador de Férias" /></h1>
          <p className="slogan">Mais tempo para o que importa</p>
        </header>

        <main className="page" id="plano">
          <QuickParams settings={settings} update={update} result={result} />
          <Ticket selected={selected} result={result} year={deferred.year} custom={deferred.custom} active={active} onPick={pick}
            discarded={discarded.has(selKey)} isChosen={!!selected && chosen.chosen?.id === planId(deferred.year, selected)} striking={fresh === selKey} onDiscard={() => discard(selKey)} />
          <YearRuler year={deferred.year} selected={selected} result={result} active={active} />
          <PlanBoard result={result} list={list} discarded={discarded} fresh={fresh} onDiscard={discard} year={deferred.year} tab={eff} onTab={(t) => { setTab(t); setSelIdx(0); }}
            selIdx={selIdx} onSelect={setSelIdx} selected={selected} changes={changes} onInteract={seen}
            saved={saved} chosen={chosen} />
          <SavedPlans saved={saved} chosen={chosen} />
          <GroupSection group={group} chosen={chosen.chosen} year={deferred.year} />

          <details className="cal-block" open={calOpen} onToggle={(e) => setCalOpen(e.currentTarget.open)}>
            <summary>Ver calendário do ano</summary>
            <div className="cal-body">
              {selected && <MonthSheet period={selected.periods[per]} number={per + 1} result={result} />}
              <Calendar year={deferred.year} selected={selected} result={result} />
            </div>
          </details>

          <HowItWorks />
          <HolidayList result={result} year={deferred.year} />
        </main>
        <FloatingOptions settings={settings} update={update} />
      </div>
    </>
  );
}
