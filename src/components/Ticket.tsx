import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { fmt } from '../lib/dates';
import type { KeyDate, Period, PlanOption, PlanResult } from '../lib/types';
import { planKey, plural, short } from './format';
import { canAnimate, dur, ease, reduced } from './motion';
import { Icon } from './Icon';
import { KeyStatus } from './planParts';
import { Strike } from './Strike';

interface Props {
  selected: PlanOption | null;
  result: PlanResult;
  year: number;
  custom: KeyDate[];
  /** período destacado no ano (null = nenhum) */
  active: number | null;
  onPick: (i: number | null) => void;
  /** plano descartado: a folha aparece riscada e o botão vira "Restaurar" */
  discarded: boolean;
  /** acabou de ser descartado: o risco é desenhado na hora */
  striking: boolean;
  onDiscard: () => void;
  /** é o plano que a pessoa escolheu */
  isChosen: boolean;
  onChoose: () => void;
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

/** O número da resposta: quando o valor muda, o novo entra deslizando de baixo (sobe) ou de cima (desce). Nunca na primeira carga. */
function AnswerNumber({ value }: { value: number }) {
  const el = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  useLayoutEffect(() => {
    const was = prev.current;
    prev.current = value;
    const n = el.current;
    if (was === value || !n || !canAnimate(n)) return;
    n.getAnimations().forEach((a) => a.cancel());
    const from = reduced()
      ? { opacity: 0.4 }
      : { opacity: 0, transform: `translateY(${value > was ? '.28em' : '-.28em'})` };
    n.animate([from, { opacity: 1, transform: 'none' }], { duration: reduced() ? dur('fb', 80) : dur('num', 300), easing: ease('out') });
  }, [value]);
  return <span ref={el} className="answer-num">{value}</span>;
}

/** Linhas de período: entram em sequência curta só quando o plano selecionado muda, não a cada render. */
function Periods({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  const ul = useRef<HTMLUListElement>(null);
  const prev = useRef(id);
  useLayoutEffect(() => {
    const was = prev.current;
    prev.current = id;
    const list = ul.current;
    if (was === id || !list || reduced()) return;
    Array.from(list.children).forEach((li, i) => {
      if (!canAnimate(li)) return;
      li.getAnimations().forEach((a) => a.cancel());
      li.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
        { duration: dur('enter', 220), delay: Math.min(i * 40, 160), easing: ease('out'), fill: 'backwards' });
    });
  }, [id]);
  return <ul ref={ul} className="periods" aria-labelledby={label}>{children}</ul>;
}

/** A resposta: quanto de folga o plano rende, em uma frase, e as datas de cada período. */
export function Ticket({ selected, result, year, custom, active, onPick, discarded, striking, onDiscard, isChosen, onChoose }: Props) {
  // confirmação: o pulso só roda ao escolher, não ao trocar de plano já escolhido
  const [just, setJust] = useState(false);
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
    <section className={'ticket' + (discarded ? ' off' : '') + (isChosen ? ' chosen' : '') + (just && isChosen ? ' just' : '')} onAnimationEnd={(e) => { if (e.target === e.currentTarget) setJust(false); }} aria-label="Resumo do plano">
      {isChosen && <span className="badge mine ticket-flag">Plano escolhido</span>}
      <div className="answer">
        <p className="answer-top" aria-hidden="true">
          <AnswerNumber value={off} />
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
        <Periods id={planKey(selected)} label="datas-t">
          {selected.periods.map((p, i) => (
            <PeriodRow key={p.s} p={p} i={i} on={active === i} onPick={() => onPick(active === i ? null : i)} />
          ))}
        </Periods>
        {custom.some((c) => c.type === 'incluir') && (
          <div className="keys-status">
            <h3>Suas datas-chave</h3>
            <KeyStatus r={selected} custom={custom} />
          </div>
        )}
      </div>
      <div className="ticket-foot">
        <button type="button" className="ticket-x ticket-ok" aria-pressed={isChosen} onClick={() => { setJust(!isChosen); onChoose(); }}>
          <span key={String(isChosen)} className="ok-ic"><Icon name="check" /></span>{isChosen ? 'Plano escolhido' : 'Escolher este plano'}
        </button>
        <button type="button" className="ticket-x" onClick={onDiscard}>
          <Icon name={discarded ? 'undo' : 'cross'} />{discarded ? 'Restaurar plano' : 'Descartar plano'}
        </button>
      </div>
      {discarded && <Strike draw={striking} />}
    </section>
  );
}
