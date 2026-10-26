import { fmt } from '../lib/dates';
import type { KeyDate, PlanOption, PlanResult } from '../lib/types';
import { CopyButton, KeyStatus, summaryText } from './planParts';

interface Props { option: PlanOption; result: PlanResult; year: number; custom: KeyDate[]; position: number }

export function SelectedPlan({ option: r, result, year, custom, position }: Props) {
  return (
    <aside className="selected" aria-label="Plano selecionado">
      <h2>Plano selecionado</h2>
      <p className="sel-pos">Opção {position} da lista.</p>
      <ol className="sel-pers">
        {r.periods.map((p) => (
          <li key={p.s}>
            <b>{p.L} dias</b> de férias, {fmt(p.s)} a {fmt(p.e)}
            <span>Folga contínua de {fmt(p.xs)} a {fmt(p.xe)} ({p.xe - p.xs + 1} dias)</span>
          </li>
        ))}
      </ol>
      <KeyStatus r={r} custom={custom} />
      <div className="actions"><CopyButton text={summaryText(r, year, result.N)} /></div>
    </aside>
  );
}
