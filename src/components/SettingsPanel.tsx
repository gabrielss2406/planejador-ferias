import { useState, useSyncExternalStore } from 'react';
import { MN } from '../lib/dates';
import { CITIES, findCity, UFS } from '../lib/holidays';
import type { PlanResult, Settings } from '../lib/types';
import { KeyDatesForm } from './KeyDatesForm';
import { NumberField } from './NumberField';

interface Props {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  result: PlanResult;
}

const SPLIT_HINTS = [
  'Sem preferência: divide se isso render mais folga.',
  'Divide só se ganhar pelo menos 1 dia a mais por período extra.',
  'Divide só se ganhar pelo menos 2 dias a mais por período extra.',
  'Divide só se ganhar pelo menos 3 dias a mais por período extra.',
];

const MOBILE_Q = '(max-width: 980px)';
function useIsMobile() {
  return useSyncExternalStore(
    (cb) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {};
      const mq = window.matchMedia(MOBILE_Q);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => (typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(MOBILE_Q).matches),
    () => false,
  );
}

function summaryLine(S: Settings) {
  const ks = ([1, 2, 3] as const).filter((k) => S.parts[k]);
  const max = ks.length ? Math.max(...ks) : 0;
  const per = max === 0 ? 'nenhum período marcado' : max === 1 ? '1 período' : `até ${max} períodos`;
  return [S.year, S.uf, `${S.total} dias`, per].filter(Boolean).join(' · ');
}

function cityHint(S: Settings, result: PlanResult) {
  const ck = findCity(S.city);
  if (ck) {
    const n = CITIES[ck][1].length;
    return `${ck}/${result.uf}: ${n} feriado${n === 1 ? '' : 's'} municipa${n === 1 ? 'l' : 'is'} na base. Confirme com a prefeitura.`;
  }
  if (S.city.trim()) return 'Cidade fora da base: uso feriados nacionais e do estado. Adicione os municipais em Datas-chave, como folga extra.';
  return 'Sem cidade: uso feriados nacionais e do estado escolhido.';
}

export function SettingsPanel({ settings: S, update, result }: Props) {
  const setPart = (k: 1 | 2 | 3, v: boolean) => update({ parts: { ...S.parts, [k]: v } });
  const toggleMonth = (i: number) => update({ months: S.months.map((m, j) => (j === i ? !m : m)) });
  const setCity = (city: string) => {
    const ck = findCity(city);
    update(ck ? { city, uf: CITIES[ck][0] } : { city });
  };

  const mobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <aside className="panel" aria-label="Configurações">
      {/* Uma única árvore nos dois tamanhos (não perde o rascunho ao girar a tela). No desktop fica sempre aberto e sem summary visível. */}
      <details className="panel-shell" open={!mobile || mobileOpen}
        onToggle={(e) => { if (mobile) setMobileOpen(e.currentTarget.open); }}>
        <summary className="panel-toggle">
          <span className="panel-toggle-text">
            <strong>Ajustar parâmetros</strong>
            <span className="panel-sum">{summaryLine(S)}</span>
          </span>
        </summary>

        <div className="panel-body">
          <h2>Seus parâmetros</h2>
          <p className="lead">Tudo recalcula na hora que você muda.</p>

          <div className="row field">
            <div>
              <label htmlFor="year">Ano</label>
              <select id="year" value={S.year} onChange={(e) => update({ year: +e.target.value })}>
                {[2026, 2027, 2028].map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="uf">Estado</label>
              <select id="uf" value={S.uf} onChange={(e) => update({ uf: e.target.value })}>
                <option value="">—</option>
                {UFS.map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="city">Cidade</label>
            <input type="text" id="city" list="cities" placeholder="Digite sua cidade" autoComplete="off"
              value={S.city} onChange={(e) => setCity(e.target.value)} aria-describedby="city-hint" />
            <datalist id="cities">
              {Object.keys(CITIES).map((c) => <option key={c} value={c} />)}
            </datalist>
            <p className="hint" id="city-hint">{cityHint(S, result)}</p>
          </div>

          <div className="field">
            <label htmlFor="total">Dias corridos</label>
            <div className="seg">
              <button type="button" aria-pressed={S.total === 30} onClick={() => update({ total: 30 })}>30</button>
              <button type="button" aria-pressed={S.total === 20} onClick={() => update({ total: 20 })}>20 (vendendo 10)</button>
            </div>
            <NumberField id="total" value={S.total} min={5} max={30} fallback={30} onChange={(total) => update({ total })} />
            <p className="hint">&ldquo;Vendendo 10&rdquo; é o abono: você troca 10 dias por dinheiro e descansa 20. O app não calcula valores.</p>
          </div>

          <fieldset className="periods">
            <legend>Pode dividir em quantos períodos?</legend>
            {([1, 2, 3] as const).map((k) => (
              <label key={k} className="check">
                <input type="checkbox" checked={!!S.parts[k]} onChange={(e) => setPart(k, e.target.checked)} />
                <span>{k} período{k > 1 ? 's' : ''}</span>
              </label>
            ))}
          </fieldset>

          <details>
            <summary>Preferências de feriados e blocos</summary>
            <div className="det-body">
              <label className="check">
                <input type="checkbox" checked={S.carnaval} onChange={(e) => update({ carnaval: e.target.checked })} />
                <span>Carnaval (segunda e terça)<small>Ponto facultativo: depende da empresa</small></span>
              </label>
              <label className="check">
                <input type="checkbox" checked={S.corpus} onChange={(e) => update({ corpus: e.target.checked })} />
                <span>Corpus Christi<small>Ponto facultativo: depende da empresa</small></span>
              </label>
              <label className="check">
                <input type="checkbox" checked={S.penal} onChange={(e) => update({ penal: e.target.checked })} />
                <span>Evitar feriado dentro das férias<small>Feriado em dia útil dentro do período é folga que você já teria de graça</small></span>
              </label>
              <div className="field split">
                <label htmlFor="split">Preferência por blocos grandes</label>
                <input type="range" id="split" min={0} max={3} step={1} value={S.split}
                  aria-describedby="split-hint" onChange={(e) => update({ split: +e.target.value })} />
                <p className="hint" id="split-hint">Quanto mais à direita, mais o app prefere férias em poucos blocos longos, em vez de vários curtos. {SPLIT_HINTS[S.split]}</p>
              </div>
            </div>
          </details>

          <KeyDatesForm custom={S.custom} onChange={(custom) => update({ custom })} />

          <details>
            <summary>Janela e meses</summary>
            <div className="det-body">
              <div className="row field">
                <div>
                  <label htmlFor="wStart">Começar a partir de</label>
                  <input type="date" id="wStart" value={S.wStart} onChange={(e) => update({ wStart: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="wEnd">Terminar até</label>
                  <input type="date" id="wEnd" value={S.wEnd} onChange={(e) => update({ wEnd: e.target.value })} />
                </div>
              </div>
              <span className="lbl" id="months-l">Meses permitidos</span>
              <div className="months" role="group" aria-labelledby="months-l">
                {MN.map((m, i) => (
                  <button key={m} type="button" className="chip-btn" aria-pressed={S.months[i]} onClick={() => toggleMonth(i)}>
                    {m.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </details>

          <details>
            <summary>Regras da CLT</summary>
            <div className="det-body">
              <div className="row field">
                <div>
                  <label htmlFor="minPart">Menor período (mín.)</label>
                  <NumberField id="minPart" value={S.minPart} min={5} max={15} fallback={5} onChange={(minPart) => update({ minPart })} />
                </div>
                <div>
                  <label htmlFor="maxMin">Maior período (mín.)</label>
                  <NumberField id="maxMin" value={S.maxMin} min={14} max={30} fallback={14} onChange={(maxMin) => update({ maxMin })} />
                </div>
              </div>
              <p className="hint">A lei exige que o menor período tenha 5 dias ou mais e que o maior tenha 14 dias ou mais, em até 3 períodos. Os campos só deixam você ser mais exigente.</p>
            </div>
          </details>
        </div>
      </details>
    </aside>
  );
}
