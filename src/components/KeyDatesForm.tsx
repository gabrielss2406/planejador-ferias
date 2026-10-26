import { useState } from 'react';
import { fmt, parseISO } from '../lib/dates';
import { Icon } from './Icon';
import type { KeyDate, KeyDateType } from '../lib/types';

const TYPE_LABEL: Record<KeyDateType, string> = {
  incluir: 'quero ficar sem trabalhar', evitar: 'bloqueada', folga: 'folga extra',
};

interface Props {
  custom: KeyDate[];
  onChange: (custom: KeyDate[]) => void;
}

export function KeyDatesForm({ custom, onChange }: Props) {
  const [label, setLabel] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [type, setType] = useState<KeyDateType>('incluir');

  const add = () => {
    if (!start) { document.getElementById('kStart')?.focus(); return; }
    onChange([...custom, { id: String(Date.now()), label: label.trim(), start, end, type }]);
    setLabel(''); setStart(''); setEnd('');
  };

  const [open, setOpen] = useState(custom.length > 0);
  const count = custom.length;

  return (
    <details open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>{count > 0 ? `Datas-chave (${count})` : 'Datas-chave'}</summary>
      <div className="det-body">
      <p className="hint lead-hint">Data-chave é um dia ou período que pesa na escolha: você quer estar sem trabalhar, não pode tirar férias ou tem uma folga extra (como feriado local).</p>
      <div className="field">
        <label htmlFor="kLabel">O que é</label>
        <input type="text" id="kLabel" placeholder="Ex.: casamento da Ana" value={label} onChange={(e) => setLabel(e.target.value)} />
      </div>
      <div className="row dates field">
        <div>
          <label htmlFor="kStart">De</label>
          <input type="date" id="kStart" value={start} onChange={(e) => setStart(e.target.value)} />
        </div>
        <div>
          <label htmlFor="kEnd">Até (opcional)</label>
          <input type="date" id="kEnd" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="kType">Como tratar</label>
        <select id="kType" value={type} onChange={(e) => setType(e.target.value as KeyDateType)}>
          <option value="incluir">Quero estar sem trabalhar</option>
          <option value="evitar">Não posso tirar férias</option>
          <option value="folga">Folga extra (feriado local, recesso)</option>
        </select>
      </div>
      <button type="button" className="btn add" onClick={add}>Adicionar data</button>
      <ul className="keys">
        {custom.map((c) => {
          const a = parseISO(c.start), b = parseISO(c.end);
          const d = a == null ? '' : b != null && b > a ? `${fmt(a)} a ${fmt(b)}` : fmt(a);
          return (
            <li key={c.id}>
              <span>{c.label || 'Sem nome'}<br /><span className="t">{d} · {TYPE_LABEL[c.type]}</span></span>
              <button type="button" aria-label={`Remover data-chave: ${c.label || 'Sem nome'}`} onClick={() => onChange(custom.filter((x) => x.id !== c.id))}><Icon name="cross" /></button>
            </li>
          );
        })}
      </ul>
      </div>
    </details>
  );
}
