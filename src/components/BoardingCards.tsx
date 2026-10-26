import { useEffect, useRef } from 'react';
import type { PlanOption } from '../lib/types';
import { fmt } from '../lib/dates';
import { Icon } from './Icon';
import { plural, short } from './format';

interface Props {
  option: PlanOption;
  position: number;
  active: number;
  onPick: (i: number) => void;
}

/** Um cartão de embarque por período. Escolher o cartão escolhe o período que a folha mostra. */
export function BoardingCards({ option, position, active, onPick }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const total = option.periods.length;

  // No carrossel (celular), traz o cartão ativo para a vista sem rolar a página.
  useEffect(() => {
    const box = scroller.current;
    const card = box?.children[active] as HTMLElement | undefined;
    if (!box || !card || box.scrollWidth <= box.clientWidth) { first.current = false; return; }
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    box.scrollTo({
      left: card.offsetLeft - (box.clientWidth - card.offsetWidth) / 2,
      behavior: reduce || first.current ? 'auto' : 'smooth',
    });
    first.current = false;
  }, [active, option]);

  return (
    <div className="cards-block">
      <p className="cards-count" aria-live="polite">
        <span className="dots" aria-hidden="true">{option.periods.map((p, i) => <i key={p.s} className={i === active ? 'on' : ''} />)}</span>
        Período {active + 1} de {total}
      </p>
      <div className="cards" ref={scroller} role="group" aria-label="Períodos do plano selecionado">
        {option.periods.map((p, i) => {
          const on = i === active;
          return (
            <button key={p.s} type="button" className="card" aria-pressed={on} onClick={() => onPick(i)}>
              <span className="card-top"><span>Período {i + 1}</span><span>{on ? <><Icon name="mark" />Na folha</> : 'Ver na folha'}</span></span>
              <span className="seg"><small>SAÍDA</small><b>{fmt(p.s)}</b></span>
              <span className="seg"><small>RETORNO</small><b>{fmt(p.xe + 1)}</b></span>
              <span className="seg"><small>DURAÇÃO</small><b>{plural(p.L, 'dia', 'dias')}</b></span>
              <span className="seg"><small>OPÇÃO</small><b>{position} · P{i + 1}</b></span>
              <span className="seg wide">
                <small>FOLGA CONTÍNUA</small>
                <b>{short(p.xs)} a {short(p.xe)} · {p.xe - p.xs + 1} d</b>
              </span>
              <span className="stub" aria-hidden="true"><span className="code" /></span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
