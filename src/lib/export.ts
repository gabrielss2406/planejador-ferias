import { dateOf, fmt } from './dates';
import type { PlanOption, SavedPlan } from './types';

const pad = (n: number) => String(n).padStart(2, '0');

/** Identidade estável do plano: ano mais as datas de início dos períodos. */
export const planId = (year: number, r: { periods: { s: number }[] }) =>
  `${year}:${r.periods.map((p) => p.s).join('-')}`;

/** Foto do plano calculado, independente dos parâmetros atuais. */
export function toSaved(r: PlanOption, year: number, N: number, savedAt: number = Date.now()): SavedPlan {
  return {
    id: planId(year, r),
    year,
    N,
    off: r.off,
    k: r.k,
    periods: r.periods.map(({ s, e, L, xs, xe }) => ({ s, e, L, xs, xe })),
    savedAt,
  };
}

/** AAAAMMDD a partir do índice de dia (UTC, sem fuso). */
const icsDate = (i: number) => {
  const d = dateOf(i);
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;
};

const icsStamp = (ms: number) => {
  const d = new Date(ms);
  return `${icsDate(Math.floor(ms / 864e5))}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
};

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

/** Dobra a linha em 75 bytes (RFC 5545); as continuações começam com um espaço. */
function fold(line: string) {
  const enc = new TextEncoder();
  const out: string[] = [];
  let cur = '', bytes = 0;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    if (bytes + n > (out.length ? 74 : 75)) { out.push(cur); cur = ''; bytes = 0; }
    cur += ch; bytes += n;
  }
  out.push(cur);
  return out.join('\r\n ');
}

/** Arquivo .ics: um evento de dia inteiro por período de férias (DTEND é exclusivo). */
export function buildIcs(plan: SavedPlan): string {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Planejador de Ferias//PT-BR//', 'CALSCALE:GREGORIAN'];
  plan.periods.forEach((p, i) => {
    const nome = plan.periods.length > 1 ? `Férias ${i + 1}/${plan.periods.length} (${p.L} dias)` : `Férias (${p.L} dias)`;
    const desc = `Sem trabalhar de ${fmt(p.xs)} a ${fmt(p.xe)}. Proposta para negociar: quem define a época das férias é o empregador (CLT, art. 136).`;
    lines.push(
      'BEGIN:VEVENT',
      `UID:${plan.id.replace(/[^0-9a-z-]/gi, '')}-${i + 1}@planejador-ferias`,
      `DTSTAMP:${icsStamp(plan.savedAt)}`,
      `DTSTART;VALUE=DATE:${icsDate(p.s)}`,
      `DTEND;VALUE=DATE:${icsDate(p.e + 1)}`,
      `SUMMARY:${esc(nome)}`,
      `DESCRIPTION:${esc(desc)}`,
      'TRANSP:OPAQUE',
      'END:VEVENT',
    );
  });
  lines.push('END:VCALENDAR');
  return lines.map(fold).join('\r\n') + '\r\n';
}

/** Baixa um arquivo gerado no navegador. */
export function downloadFile(name: string, content: string, mime: string) {
  const url = URL.createObjectURL(new Blob([content], { type: `${mime};charset=utf-8` }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
