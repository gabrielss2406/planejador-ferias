import logo from '../assets/logo.png';
import { fmt } from '../lib/dates';
import type { SavedPlan } from '../lib/types';
import { plural } from './format';

/** Folha de impressão (vira o PDF): fica fora da tela e só aparece em @media print. */
export function PrintSheet({ plan }: { plan: SavedPlan }) {
  const hoje = new Date().toLocaleDateString('pt-BR');
  return (
    <section className="print-sheet" aria-hidden="true">
      <img src={logo} alt="" className="ps-logo" />
      <p className="ps-year">Plano de férias {plan.year}</p>
      <p className="ps-off"><b className="mono">{plan.off}</b> dias fora do trabalho</p>
      <p className="ps-sub">Com {plan.N} dias de férias, em {plural(plan.k, 'período', 'períodos')}.</p>
      <ol className="ps-list">
        {plan.periods.map((p, i) => (
          <li key={i}>
            <b>{i + 1}º período</b>
            <span className="mono">{fmt(p.s)} a {fmt(p.e)} ({plural(p.L, 'dia', 'dias')})</span>
            <span>Sem trabalhar de {fmt(p.xs)} a {fmt(p.xe)}</span>
          </li>
        ))}
      </ol>
      <p className="ps-note">Quem define a época das férias é o empregador (CLT, art. 136): leve isto como uma proposta para negociar.</p>
      <p className="ps-date">Gerado em {hoje}</p>
    </section>
  );
}
