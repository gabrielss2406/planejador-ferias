import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import logo from './assets/logo.png';
import { BoardingCards } from './components/BoardingCards';
import { defaultPeriod, planKey } from './components/format';
import { Hero } from './components/Hero';
import { HolidayList } from './components/HolidayList';
import { HowItWorks } from './components/HowItWorks';
import { MonthSheet } from './components/MonthSheet';
import { KeyStatus } from './components/planParts';
import { PlanBoard, type Change } from './components/PlanBoard';
import { SettingsPanel } from './components/SettingsPanel';
import { Calendar } from './components/YearView';
import { YearRuler } from './components/YearRuler';
import { useSettings } from './hooks/useSettings';
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
  const deferred = useDeferredValue(settings);
  const result = useMemo(() => plan(deferred), [deferred]);
  const [tab, setTab] = useState<GroupKey>('all');
  const [selIdx, setSelIdx] = useState(0);
  const [perSel, setPerSel] = useState<{ key: string; i: number } | null>(null);

  // mudar qualquer parâmetro volta a seleção para a melhor opção
  useEffect(() => { setSelIdx(0); }, [result]);

  const list = result.groups[tab] || [];
  const selected = list[selIdx] ?? list[0] ?? null;
  const selKey = selected ? planKey(selected) : '';
  const per = selected ? (perSel?.key === selKey ? Math.min(perSel.i, selected.periods.length - 1) : defaultPeriod(selected)) : 0;

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

  const pick = (i: number) => { if (selected) setPerSel({ key: selKey, i }); };

  return (
    <div className="app">
      <header className="top">
        <h1 className="brand"><img src={logo} alt="Planejador de Férias" /></h1>
        <p className="slogan">Mais tempo para o que importa</p>
      </header>

      <main className="center" id="plano">
        <Hero selected={selected} result={result} />
        {selected ? (
          <>
            <MonthSheet period={selected.periods[per]} number={per + 1} result={result} />
            <div className="perf" aria-hidden="true" />
            <BoardingCards option={selected} position={selIdx + 1} active={per} onPick={pick} />
          </>
        ) : (
          <section className="sheet sheet-empty" aria-label="Folha do período">
            <p>Quando houver um plano, a folha do período aparece aqui.</p>
          </section>
        )}
      </main>

      <PlanBoard result={result} year={deferred.year} tab={tab} onTab={(t) => { setTab(t); setSelIdx(0); }}
        selIdx={selIdx} onSelect={setSelIdx} selected={selected} changes={changes} onInteract={seen} />

      <footer className="ruler">
        <YearRuler year={deferred.year} selected={selected} result={result} />
      </footer>

      <div className="below">
        <Calendar year={deferred.year} selected={selected} result={result} />
        <div className="below-cols">
          <HowItWorks />
          <div className="below-stack">
            <HolidayList result={result} year={deferred.year} />
            {selected && deferred.custom.some((c) => c.type === 'incluir') && (
              <section className="paper keys-status" aria-labelledby="chaves-t">
                <h2 id="chaves-t">Datas-chave no plano selecionado</h2>
                <KeyStatus r={selected} custom={deferred.custom} />
              </section>
            )}
          </div>
        </div>
      </div>

      <SettingsPanel settings={settings} update={update} result={result} />
    </div>
  );
}
