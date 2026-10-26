import { MN } from '../lib/dates';
import { CITIES, findCity, UFS } from '../lib/holidays';
import type { PlanResult, Settings } from '../lib/types';
import { KeyDatesForm } from './KeyDatesForm';
import { NumberField } from './NumberField';

interface Props {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
}

const SPLIT_HINTS = [
  'Sem preferência: divide se isso render mais dias sem trabalhar.',
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
  if (S.city.trim()) return 'Cidade fora da base: uso feriados nacionais e do estado. Adicione os municipais em Mais opções, em Datas-chave.';
  return '';
}

/** Os três campos que respondem à pergunta: onde, quantos dias, em quantos períodos. */
export function QuickParams({ settings: S, update, result }: Props & { result: PlanResult }) {
  const setCity = (city: string) => {
    const ck = findCity(city);
    update(ck ? { city, uf: CITIES[ck][0] } : { city });
  };
  // "até N": o app usa o maior número de períodos marcado
  const maxK = ([3, 2, 1] as const).find((k) => S.parts[k]) ?? 0;
  const hint = cityHint(S, result);

  return (
    <section className="params" aria-label="Seus dados">
      <div className="p-city" role="group" aria-labelledby="city-l">
        <span className="lbl" id="city-l">Cidade e estado</span>
        <div className="pair">
          <input type="text" id="city" list="cities" placeholder="Digite sua cidade" autoComplete="off" aria-label="Cidade"
            value={S.city} onChange={(e) => setCity(e.target.value)} aria-describedby="city-hint" />
          <datalist id="cities">
            {Object.keys(CITIES).map((c) => <option key={c} value={c} />)}
          </datalist>
          <select id="uf" aria-label="Estado" value={S.uf} onChange={(e) => update({ uf: e.target.value })}>
            <option value="">UF</option>
            {UFS.map((u) => <option key={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <div className="p-days" role="group" aria-labelledby="days-l">
        <span className="lbl" id="days-l">Dias de férias</span>
        <div className="seg">
          <button type="button" aria-pressed={S.total === 30} onClick={() => update({ total: 30 })}>30</button>
          <button type="button" aria-pressed={S.total === 20} onClick={() => update({ total: 20 })}>20, vendendo 10</button>
          <label className="seg-other" htmlFor="total" data-active={S.total !== 30 && S.total !== 20}>
            <span>Outro</span>
            <NumberField id="total" value={S.total} min={5} max={30} fallback={30} clearOn={[30, 20]} onChange={(total) => update({ total })} />
            <span>dias</span>
          </label>
        </div>
      </div>

      <fieldset className="p-per">
        <legend>Períodos</legend>
        <div className="seg">
          {([1, 2, 3] as const).map((k) => (
            <label key={k} className="segopt">
              <input type="radio" name="parts" checked={maxK === k}
                onChange={() => update({ parts: { 1: true, 2: k >= 2, 3: k >= 3 } })} />
              <span>até {k}<span className="sr"> período{k > 1 ? 's' : ''}</span></span>
            </label>
          ))}
        </div>
      </fieldset>

      <p className="hint p-hint" id="city-hint">{hint}</p>
    </section>
  );
}

/** Corpo da gaveta "Mais opções": tudo o que não é a pergunta principal. */
export function OptionsBody({ settings: S, update }: Props) {
  const monthsOn = S.months.filter(Boolean).length;
  const toggleMonth =(i: number) => update({ months: S.months.map((m, j) => (j === i ? !m : m)) });

  return (
    <div className="opts">
      <div className="row field">
        <div>
          <label htmlFor="year">Ano</label>
          <select id="year" value={S.year} onChange={(e) => update({ year: +e.target.value })}>
            {[2026, 2027, 2028].map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
      </div>
      <p className="hint">&ldquo;Vendendo 10&rdquo; é o abono: você troca 10 dias por dinheiro e descansa 20. O app não calcula valores.</p>

      <h3>Feriados e blocos</h3>
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

      <KeyDatesForm custom={S.custom} onChange={(custom) => update({ custom })} />

      <details>
        <summary>Janela e meses</summary>
        <div className="det-body">
          <div className="row dates field">
            <div>
              <label htmlFor="wStart">Começar a partir de</label>
              <input type="date" id="wStart" value={S.wStart} onChange={(e) => update({ wStart: e.target.value })} />
            </div>
            <div>
              <label htmlFor="wEnd">Terminar até</label>
              <input type="date" id="wEnd" value={S.wEnd} onChange={(e) => update({ wEnd: e.target.value })} />
            </div>
          </div>
          <span className="lbl" id="months-l">Meses em que posso tirar férias</span>
          <div className="months-act">
            <button type="button" className="mini" disabled={monthsOn === 12} onClick={() => update({ months: Array(12).fill(true) })}>Selecionar todos</button>
            <button type="button" className="mini" disabled={monthsOn === 0} onClick={() => update({ months: Array(12).fill(false) })}>Limpar seleção</button>
          </div>
          <div className="months" role="group" aria-labelledby="months-l">
            {MN.map((m, i) => (
              <button key={m} type="button" className="chip-btn" aria-pressed={S.months[i]}
                aria-label={`${m}: ${S.months[i] ? 'liberado' : 'fora da busca'}`} onClick={() => toggleMonth(i)}>
                {m.slice(0, 3)}
              </button>
            ))}
          </div>
          <p className="hint" aria-live="polite">
            {monthsOn === 12
              ? 'Todos os meses já estão liberados. Toque num mês para tirá-lo, ou use Limpar seleção e escolha só os que quiser.'
              : monthsOn === 0
                ? 'Nenhum mês escolhido, então não há sugestões. Toque nos meses em que aceita tirar férias.'
                : `${monthsOn} ${monthsOn === 1 ? 'mês liberado' : 'meses liberados'}. Os riscados ficam fora da busca.`}
          </p>
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
  );
}
