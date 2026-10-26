import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import logo from './assets/logo.png';
import hero from './assets/hero.webp';
import { HolidayList } from './components/HolidayList';
import { PlanList } from './components/PlanList';
import { SettingsPanel } from './components/SettingsPanel';
import { Calendar, Ribbon } from './components/YearView';
import { useSettings } from './hooks/useSettings';
import { plan } from './lib/planner';
import type { GroupKey } from './lib/types';

export default function App() {
  const { settings, update } = useSettings();
  const deferred = useDeferredValue(settings);
  const result = useMemo(() => plan(deferred), [deferred]);
  const [tab, setTab] = useState<GroupKey>('all');
  const [selIdx, setSelIdx] = useState(0);

  // mudar qualquer parâmetro volta a seleção para a melhor opção
  useEffect(() => { setSelIdx(0); }, [result]);

  const list = result.groups[tab] || [];
  const selected = list[selIdx] ?? list[0] ?? null;

  return (
    <>
    <header className="topbar">
      <span className="brand"><img src={logo} alt="Planejador de Férias — mais tempo para o que importa" /></span>
    </header>
    <div className="wrap">
      <SettingsPanel settings={settings} update={update} result={result} />
      <main>
        <section className="hero" style={{ '--hero-img': `url(${hero})` } as React.CSSProperties}>
          <p className="eyebrow">Mais tempo para o que importa</p>
          <h1>Planeje suas férias de forma <em>simples e segura</em></h1>
          <p>Como as férias contam em dias corridos, o ganho está nas pontas: começar logo depois de um fim de semana ou feriado e terminar logo antes de outro. O planejador testa todas as divisões permitidas e mostra as que mais emendam.</p>
        </section>
        <Ribbon year={deferred.year} selected={selected} result={result} />
        <PlanList result={result} year={deferred.year} custom={deferred.custom} tab={tab} onTab={(t) => { setTab(t); setSelIdx(0); }}
          selIdx={selIdx} onSelect={setSelIdx} />
        <Calendar year={deferred.year} selected={selected} result={result} />
        <HolidayList result={result} year={deferred.year} />
        <p className="foot">Quem define a época das férias é o empregador (CLT, art. 136), então trate as sugestões como uma proposta para negociar. A base de feriados municipais deste protótipo é demonstrativa: confirme com a prefeitura e use as datas-chave para completar o que faltar.</p>
      </main>
    </div>
    </>
  );
}
