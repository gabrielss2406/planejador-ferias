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

  return (
    <aside className="panel" aria-label="Configurações">
      <h2>Seus parâmetros</h2>
      <p className="lead">Tudo recalcula na hora que você muda.</p>

      <fieldset>
        <legend>Quando e onde</legend>
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
            value={S.city} onChange={(e) => setCity(e.target.value)} />
          <datalist id="cities">
            {Object.keys(CITIES).map((c) => <option key={c} value={c} />)}
          </datalist>
          <p className="hint">{cityHint(S, result)}</p>
        </div>
      </fieldset>

      <fieldset>
        <legend>Seus dias de férias</legend>
        <div className="field">
          <label htmlFor="total">Dias corridos</label>
          <div className="seg" style={{ marginBottom: 8 }}>
            <button type="button" aria-pressed={S.total === 30} onClick={() => update({ total: 30 })}>30</button>
            <button type="button" aria-pressed={S.total === 20} onClick={() => update({ total: 20 })}>20 (vendendo 10)</button>
          </div>
          <NumberField id="total" value={S.total} min={5} max={30} fallback={30} onChange={(total) => update({ total })} />
        </div>
        <div className="field">
          <label>Pode dividir em quantos períodos?</label>
          {([1, 2, 3] as const).map((k) => (
            <label key={k} className="check">
              <input type="checkbox" checked={!!S.parts[k]} onChange={(e) => setPart(k, e.target.checked)} /> {k} período{k > 1 ? 's' : ''}
            </label>
          ))}
        </div>
        <div className="field">
          <label htmlFor="split">Preferência por blocos grandes</label>
          <input type="range" id="split" min={0} max={3} step={1} value={S.split}
            onChange={(e) => update({ split: +e.target.value })} />
          <p className="hint">{SPLIT_HINTS[S.split]}</p>
        </div>
      </fieldset>

      <fieldset>
        <legend>Feriados</legend>
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
      </fieldset>

      <KeyDatesForm custom={S.custom} onChange={(custom) => update({ custom })} />

      <details>
        <summary>Janela e meses</summary>
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
        <label>Meses permitidos</label>
        <div className="months">
          {MN.map((m, i) => (
            <button key={m} type="button" className="chip-btn" aria-pressed={S.months[i]} onClick={() => toggleMonth(i)}>
              {m.slice(0, 3)}
            </button>
          ))}
        </div>
      </details>

      <details>
        <summary>Regras da CLT</summary>
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
      </details>
    </aside>
  );
}

