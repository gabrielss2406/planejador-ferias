import { useEffect, useRef, useState } from 'react';
import { fmt } from '../lib/dates';
import { buildIcs, downloadFile } from '../lib/export';
import type { SavedPlan } from '../lib/types';
import type { SavedApi } from '../hooks/useSavedPlans';
import { Icon } from './Icon';
import { plural } from './format';
import { dur } from './motion';
import { CopyButton, summaryText } from './planParts';

interface Props {
  saved: SavedApi;
  onPrint: (p: SavedPlan) => void;
}

/** Planos favoritos: fotos de datas e dias, para comparar depois mesmo mudando os parâmetros. */
export function SavedPlans({ saved, onPrint }: Props) {
  const { plans, remove } = saved;
  const [open, setOpen] = useState(() => !!window.matchMedia?.('(min-width: 641px)').matches);
  const head = useRef<HTMLElement>(null);
  // itens presentes na primeira carga não animam a entrada; os salvos depois entram
  const initial = useRef<Set<string> | null>(null);
  if (initial.current === null) initial.current = new Set(plans.map((p) => p.id));
  // itens saindo: ficam na lista, esmaecem e só então são removidos
  const [leaving, setLeaving] = useState<string[]>([]);
  const timers = useRef(new Set<number>());
  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);
  if (!plans.length) return null;

  const drop = (id: string) => {
    if (leaving.includes(id)) return;
    setLeaving((l) => [...l, id]);
    const t = window.setTimeout(() => {
      timers.current.delete(t);
      remove(id);
      setLeaving((l) => l.filter((x) => x !== id));
      // o item some: leva o foco para um lugar que continua na tela
      setTimeout(() => {
        if (plans.length > 1) head.current?.focus();
        else document.querySelector<HTMLElement>('.plan-radio:checked')?.focus();
      });
    }, dur('exit', 120));
    timers.current.add(t);
  };

  return (
    <details className="saved" open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary ref={head}><h2>Planos salvos ({plans.length})</h2></summary>
      <ul className="saved-list">
        {plans.map((p) => {
          const nome = `plano de ${p.year} com ${p.off} dias fora do trabalho`;
          return (
            <li key={p.id} className={'saved-item' + (initial.current!.has(p.id) ? '' : ' enter') + (leaving.includes(p.id) ? ' leaving' : '')}>
              <p className="saved-off"><b className="mono">{p.off}</b> dias fora do trabalho<span className="saved-year mono">{p.year}</span></p>
              <ul className="saved-per">
                {p.periods.map((q, i) => <li key={i}>{fmt(q.s)} a {fmt(q.e)} <span className="mono">({plural(q.L, 'dia', 'dias')})</span></li>)}
              </ul>
              <div className="saved-act">
                <CopyButton className="mini" label="Copiar" context={nome} text={summaryText(p, p.year, p.N)} />
                <button type="button" className="mini" onClick={() => onPrint(p)}>
                  <Icon name="download" />PDF<span className="sr"> do {nome}</span>
                </button>
                <button type="button" className="mini" onClick={() => downloadFile(`ferias-${p.year}.ics`, buildIcs(p), 'text/calendar')}>
                  <Icon name="calendar" />Calendário<span className="sr"> do {nome}</span>
                </button>
                <button type="button" className="mini" onClick={() => drop(p.id)}>
                  Remover<span className="sr"> {nome}</span>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
