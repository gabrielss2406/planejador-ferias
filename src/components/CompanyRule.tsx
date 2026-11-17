import { useState } from 'react';
import type { CompanyRule as Rule } from '../lib/types';
import { Icon } from './Icon';
import { NumberField } from './NumberField';

const MAX_PERIODS = 3;
const START: Rule = { fixed: [14], free: 2, freeMin: 5 };

/** "14 + 2 períodos de no mínimo 5" */
export function describeRule(r: Rule): string {
  const parts = r.fixed.map((d) => `${d}`);
  if (r.free > 0) parts.push(`${r.free} ${r.free === 1 ? 'período' : 'períodos'} de no mínimo ${r.freeMin}`);
  return parts.join(' + ');
}

interface Props {
  rule?: Rule;
  total: number;
  onChange: (rule: Rule | undefined) => void;
}

export function CompanyRule({ rule, total, onChange }: Props) {
  const [open, setOpen] = useState(!!rule);
  const [draft, setDraft] = useState(14);

  const addFixed = () => {
    if (!rule || rule.fixed.length + rule.free >= MAX_PERIODS) return;
    onChange({ ...rule, fixed: [...rule.fixed, draft].sort((a, b) => b - a) });
  };
  // quantos livres cabem sem passar de 3 períodos no total
  const maxFree = rule ? MAX_PERIODS - rule.fixed.length : 0;

  return (
    <details open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>{rule ? `Regra da empresa (${describeRule(rule)})` : 'Regra da empresa'}</summary>
      <div className="det-body">
        <p className="hint lead-hint">Algumas empresas impõem a divisão das férias, por exemplo um período de exatamente 14 dias e mais 2 períodos de no mínimo 5. Informe aqui e o app só sugere planos nesse formato.</p>
        <label className="check">
          <input type="checkbox" checked={!!rule} onChange={(e) => onChange(e.target.checked ? START : undefined)} />
          <span>Minha empresa fixa a divisão<small>Substitui a escolha de “até 1, 2 ou 3 períodos”</small></span>
        </label>

        {rule && (
          <>
            <span className="lbl" id="fixed-l">Períodos com tamanho exato (dias)</span>
            <ul className="keys" aria-labelledby="fixed-l">
              {rule.fixed.map((d, i) => (
                <li key={`${d}-${i}`}>
                  <span>{d} dias</span>
                  <button type="button" aria-label={`Remover período fixo de ${d} dias`}
                    onClick={() => onChange({ ...rule, fixed: rule.fixed.filter((_, j) => j !== i) })}><Icon name="cross" /></button>
                </li>
              ))}
            </ul>
            <div className="row field">
              <div>
                <label htmlFor="fixedDraft">Novo período fixo</label>
                <NumberField id="fixedDraft" value={draft} min={5} max={30} fallback={14} onChange={setDraft} />
              </div>
            </div>
            <button type="button" className="btn add" disabled={rule.fixed.length + rule.free >= MAX_PERIODS} onClick={addFixed}>Adicionar período fixo</button>

            <div className="row field">
              <div>
                <label htmlFor="freeCount">Períodos livres</label>
                <select id="freeCount" value={Math.min(rule.free, maxFree)} onChange={(e) => onChange({ ...rule, free: +e.target.value })}>
                  {Array.from({ length: maxFree + 1 }, (_, n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="freeMin">Mínimo de cada livre</label>
                <NumberField id="freeMin" value={rule.freeMin} min={5} max={30} fallback={5} onChange={(freeMin) => onChange({ ...rule, freeMin })} />
              </div>
            </div>
            <p className="hint" aria-live="polite">{describeRule(rule)} = {total} dias. Os períodos livres dividem o que sobra depois dos fixos.</p>
          </>
        )}
      </div>
    </details>
  );
}
