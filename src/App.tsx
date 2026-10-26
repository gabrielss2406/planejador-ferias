import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import logo from './assets/logo.png';
import { defaultPeriod, planKey } from './components/format';
import { HolidayList } from './components/HolidayList';
import { HowItWorks } from './components/HowItWorks';
import { MonthSheet } from './components/MonthSheet';
import { PlanBoard, type Change } from './components/PlanBoard';
import { FloatingOptions } from './components/FloatingOptions';
import { PrintSheet } from './components/PrintSheet';
import { SavedPlans } from './components/SavedPlans';
import { QuickParams } from './components/SettingsPanel';
import { Ticket } from './components/Ticket';
import { Calendar } from './components/YearView';
import { YearRuler } from './components/YearRuler';
import { useSavedPlans } from './hooks/useSavedPlans';
import { useSettings } from './hooks/useSettings';
import { plan } from './lib/planner';
import type { GroupKey, PlanResult, SavedPlan } from './lib/types';

/** plano (identidade) -> dias fora, de todas as abas */
const snapshot = (r: PlanResult) => {
  const m = new Map<string, number>();
  (Object.values(r.groups)).forEach((g) => g.forEach((o) => m.set(planKey(o), o.off)));
  return m;
};

export default function App() {
  const { settings, update } = useSettings();
  const saved = useSavedPlans();
  // PDF: monta a folha de impressão, chama o diálogo do navegador e desmonta ao terminar
  const [printPlan, setPrintPlan] = useState<SavedPlan | null>(null);
  useEffect(() => {
    if (!printPlan) return;
    const clear = () => setPrintPlan(null);
    window.addEventListener('afterprint', clear, { once: true });
    const raf = requestAnimationFrame(() => window.print());
    return () => { cancelAnimationFrame(raf); window.removeEventListener('afterprint', clear); };
  }, [printPlan]);
  const deferred = useDeferredValue(settings);
  const result = useMemo(() => plan(deferred), [deferred]);
  const [tab, setTab] = useState<GroupKey>('all');
  const [selIdx, setSelIdx] = useState(0);
  const [perSel, setPerSel] = useState<{ key: string; i: number } | null>(null);

  // mudar qualquer parâmetro volta a seleção para a melhor opção
  useEffect(() => { setSelIdx(0); }, [result]);

  // filtro sem planos (ex.: depois de mudar um parâmetro) volta para "qualquer número"
  const eff: GroupKey = result.groups[tab].length ? tab : 'all';
  const list = result.groups[eff] || [];
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
          <Ticket selected={selected} result={result} year={deferred.year} custom={deferred.custom} active={active} onPick={pick} />
          <YearRuler year={deferred.year} selected={selected} result={result} active={active} />
          <PlanBoard result={result} year={deferred.year} tab={eff} onTab={(t) => { setTab(t); setSelIdx(0); }}
            selIdx={selIdx} onSelect={setSelIdx} selected={selected} changes={changes} onInteract={seen}
            saved={saved} onPrint={setPrintPlan} />
          <SavedPlans saved={saved} onPrint={setPrintPlan} />

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
    {printPlan && <PrintSheet plan={printPlan} />}
    </>
  );
}
