import { fmt } from './dates';
import type { SavedPlan } from './types';

/** Quem está numa sala e o que publicou (plano escolhido, se houver). */
export interface GroupMember {
  pid: string;
  name: string;
  /** é a própria pessoa que está olhando */
  me: boolean;
  updatedAt: number;
  plan: SavedPlan | null;
}

export interface Overlap {
  s: number;
  e: number;
  pids: string[];
  names: string[];
}

/**
 * Trechos de férias em que 2 ou mais pessoas estão fora ao mesmo tempo (só dias de férias,
 * não o fim de semana emendado). Só entram planos do ano pedido. Trechos vizinhos com as mesmas pessoas se unem.
 */
export function overlaps(members: GroupMember[], year: number): Overlap[] {
  const spans: { s: number; e: number; pid: string; name: string }[] = [];
  for (const m of members) {
    if (m.plan?.year !== year) continue;
    for (const p of m.plan.periods) spans.push({ s: p.s, e: p.e, pid: m.pid, name: m.name });
  }
  const cuts = [...new Set(spans.flatMap((p) => [p.s, p.e + 1]))].sort((a, b) => a - b);
  const out: Overlap[] = [];
  for (let i = 0; i < cuts.length - 1; i++) {
    const s = cuts[i], e = cuts[i + 1] - 1;
    const on = new Map<string, string>();
    for (const p of spans) if (p.s <= s && p.e >= e) on.set(p.pid, p.name);
    if (on.size < 2) continue;
    const pids = [...on.keys()].sort();
    const names = pids.map((k) => on.get(k)!);
    const last = out[out.length - 1];
    if (last && last.e + 1 === s && last.pids.join('|') === pids.join('|')) last.e = e;
    else out.push({ s, e, pids, names });
  }
  return out;
}

/** "Ana e Bia" / "Ana, Bia e Caio" */
export const joinNames = (names: string[]) =>
  names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`;

/** Resumo em texto do grupo para colar numa conversa: férias de cada pessoa e os dias em comum. */
export function groupSummaryText(members: GroupMember[], year: number): string {
  const lines = [`Férias em grupo ${year}`];
  for (const m of members) {
    const who = m.name + (m.me ? ' (eu)' : '');
    if (m.plan?.year === year) {
      lines.push(`- ${who}: ${m.plan.periods.map((p) => `${fmt(p.s)} a ${fmt(p.e)}`).join('; ')} (${m.plan.off} dias fora)`);
    } else {
      lines.push(`- ${who}: ${m.plan ? `plano de ${m.plan.year}` : 'ainda não escolheu'}`);
    }
  }
  const ov = overlaps(members, year);
  if (ov.length) {
    lines.push('', 'Férias ao mesmo tempo:');
    for (const o of ov) lines.push(`- ${fmt(o.s)} a ${fmt(o.e)}: ${joinNames(o.names)} (${o.e - o.s + 1} ${o.e === o.s ? 'dia' : 'dias'})`);
  } else if (members.filter((m) => m.plan?.year === year).length >= 2) {
    lines.push('', 'Ninguém tem férias ao mesmo tempo.');
  }
  return lines.join('\n');
}
