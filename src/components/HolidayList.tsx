import { dateOf, fmt } from '../lib/dates';
import { KIND } from '../lib/holidays';
import type { PlanResult } from '../lib/types';

export function HolidayList({ result, year }: { result: PlanResult; year: number }) {
  const arr = [...result.hol].filter(([i]) => dateOf(i).getUTCFullYear() === year).sort((a, b) => a[0] - b[0]);
  return (
    <details className="hol-list paper">
      <summary>Feriados considerados em {year} ({arr.length})</summary>
      <p className="hint">Os feriados municipais vêm de uma base aberta, sem garantia de precisão: confirme com a prefeitura e use as datas-chave para completar o que faltar.</p>
      <ul>
        {arr.map(([i, h]) => (
          <li key={i}><span>{fmt(i)} · {h.name}</span><span>{KIND[h.kind]}</span></li>
        ))}
      </ul>
    </details>
  );
}
