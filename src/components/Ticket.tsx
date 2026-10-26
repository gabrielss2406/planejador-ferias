import { fmt } from '../lib/dates';
import type { KeyDate, Period, PlanOption, PlanResult } from '../lib/types';
import { plural, short } from './format';
import { KeyStatus } from './planParts';

interface Props {
  selected: PlanOption | null;
  result: PlanResult;
  year: number;
  custom: KeyDate[];
  /** período destacado no ano (null = nenhum) */
  active: number | null;
  onPick: (i: number | null) => void;
}

const holText = (list: { name: string }[]) => {
  const names = [...new Set(list.map((h) => h.name))];
  return names.length > 2 ? `${names.slice(0, 2).join(', ')} e mais ${names.length - 2}` : names.join(', ');
};

function PeriodRow({ p, i, on, onPick }: { p: Period; i: number; on: boolean; onPick: () => void }) {
  const rest = p.xe - p.xs + 1;
  const gain = p.holGain ?? [], inside = p.holInside ?? [];
  return (
    <li>
      <button type="button" className="period" aria-pressed={on} onClick={onPick}>
        <span className="period-main">
          <b>{i + 1}º período</b>
          <span className="mono">{short(p.s)} a {short(p.e)}</span>
          <span>{plural(p.L, 'dia', 'dias')} de férias</span>
        </span>
        <span className="period-sub">Você fica sem trabalhar de {fmt(p.xs)} a {fmt(p.xe)} ({rest} dias).</span>
        {gain.length > 0 && <span className="period-sub">{gain.length > 1 ? 'Feriados que emendam' : 'Feriado que emenda'}: {holText(gain)}</span>}
        {inside.length > 0 && <span className="period-sub">Feriado dentro das férias: {holText(inside)}</span>}
      </button>
    </li>
  );
}

/** A resposta: quanto de folga o plano rende, em uma frase, e as datas de cada período. */
export function Ticket({ selected, result, year, custom, active, onPick }: Props) {
  if (!selected || result.error || selected.off <= 0) {
    return (
      <section className="empty" aria-label="Resumo do plano">
        <p aria-live="polite"><b>{result.error ?? 'Nenhuma combinação encontrada.'}</b></p>
        <p>Tente liberar mais meses, ampliar a janela, remover datas bloqueadas ou permitir mais períodos.</p>
      </section>
    );
  }
  const { off, gain } = selected;
  return (
    <section className="ticket" aria-label="Resumo do plano">
      <div className="answer">
        <p className="answer-top" aria-hidden="true">
          <span className="answer-num">{off}</span>
          <span className="answer-unit">dias fora do trabalho</span>
        </p>
        <p className="answer-sentence" aria-live="polite">
          <span className="sr">{off} dias fora do trabalho. </span>
          {gain > 0
            ? `Você usa ${plural(result.N, 'dia', 'dias')} de férias e ganha +${gain} emendando fins de semana e feriados.`
            : `Você usa ${plural(result.N, 'dia', 'dias')} de férias, sem dias extras neste plano.`}
        </p>
      </div>
      <div className="perf" aria-hidden="true" />
      <div className="periods-wrap">
        <h2 id="datas-t">Tire férias nestas datas em {year}</h2>
        <ul className="periods" aria-labelledby="datas-t">
          {selected.periods.map((p, i) => (
            <PeriodRow key={p.s} p={p} i={i} on={active === i} onPick={() => onPick(active === i ? null : i)} />
          ))}
        </ul>
        {custom.some((c) => c.type === 'incluir') && (
          <div className="keys-status">
            <h3>Suas datas-chave</h3>
            <KeyStatus r={selected} custom={custom} />
          </div>
        )}
      </div>
    </section>
  );
}
