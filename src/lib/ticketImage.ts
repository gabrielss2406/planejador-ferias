import logoUrl from '../assets/logo.png';
import { fmt } from './dates';
import type { SavedPlan } from './types';

const W = 1200;
const M = 48; // margem de grafite em volta da folha
const PAD = 56;
const MONO = '"JetBrains Mono","DejaVu Sans Mono",monospace';
const COND = '"Barlow Condensed","Arial Narrow",sans-serif';

const css = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

const loadImage = (src: string) => new Promise<HTMLImageElement>((ok, fail) => {
  const img = new Image();
  img.onload = () => ok(img);
  img.onerror = fail;
  img.src = src;
});

function wrap(ctx: CanvasRenderingContext2D, text: string, width: number) {
  const lines: string[] = [];
  let cur = '';
  for (const word of text.split(' ')) {
    const next = cur ? `${cur} ${word}` : word;
    if (cur && ctx.measureText(next).width > width) { lines.push(cur); cur = word; } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

const dias = (n: number) => `${n} ${n === 1 ? 'dia' : 'dias'}`;

/** Desenha o "ticket de viagem" das férias (a folha branca com picote sobre grafite) e devolve o PNG. */
export async function renderTicket(plan: SavedPlan): Promise<Blob> {
  const ink = css('--tinta', '#101820'), ink2 = css('--tinta-2', '#4B5866'), paper = css('--papel', '#FFFFFF');
  const shell = css('--grafite', '#101820'), perf = css('--picote', '#B8C0C9'), line = css('--trilho', '#E6E9ED'), blue = css('--azul', '#2563EB');

  await Promise.all([
    document.fonts.load(`800 100px ${MONO}`), document.fonts.load(`700 40px ${COND}`), document.fonts.load(`500 24px ${COND}`),
  ].map((p) => p.catch(() => null)));
  const logo = await loadImage(logoUrl).catch(() => null);

  const inner = W - 2 * M - 2 * PAD;
  const gain = Math.max(0, plan.off - plan.N);
  const sentence = gain > 0
    ? `Você usa ${dias(plan.N)} de férias e ganha +${gain} emendando fins de semana e feriados.`
    : `Você usa ${dias(plan.N)} de férias, sem dias extras neste plano.`;
  const note = 'Quem define a época das férias é o empregador (CLT, art. 136): leve isto como uma proposta para negociar.';

  // medir antes de desenhar, para dimensionar a altura
  const probe = document.createElement('canvas').getContext('2d')!;
  probe.font = `500 30px ${COND}`;
  const sentLines = wrap(probe, sentence, inner);
  const noteLines = wrap(probe, note, inner);
  const rowH = 124;

  const headH = 120;
  const answerH = 190 + sentLines.length * 40;
  const periodsH = 92 + plan.periods.length * rowH;
  const footH = 40 + noteLines.length * 38 + 50;
  const sheetH = headH + answerH + periodsH + footH;
  const H = sheetH + 2 * M;
  const S = 2; // nitidez em telas de alta densidade

  const canvas = document.createElement('canvas');
  canvas.width = W * S; canvas.height = H * S;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(S, S);
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = shell; ctx.fillRect(0, 0, W, H);
  const x0 = M, y0 = M, sw = W - 2 * M;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 12;
  ctx.fillStyle = paper;
  ctx.beginPath(); ctx.roundRect(x0, y0, sw, sheetH, 16); ctx.fill();
  ctx.restore();

  // cabeçalho
  let y = y0 + 34;
  if (logo) { const h = 56; ctx.drawImage(logo, x0 + PAD, y, (logo.width / logo.height) * h, h); }
  ctx.fillStyle = ink2; ctx.textAlign = 'right'; ctx.font = `700 36px ${COND}`;
  ctx.fillText(`Plano de férias ${plan.year}`, x0 + sw - PAD, y + 40);
  ctx.textAlign = 'left';

  // resposta
  y = y0 + headH + 100;
  ctx.fillStyle = ink; ctx.font = `800 128px ${MONO}`;
  const numW = ctx.measureText(String(plan.off)).width;
  ctx.fillText(String(plan.off), x0 + PAD, y);
  ctx.font = `700 52px ${COND}`;
  ctx.fillText('dias fora do trabalho', x0 + PAD + numW + 24, y);
  ctx.fillStyle = ink2; ctx.font = `500 30px ${COND}`;
  sentLines.forEach((l, i) => ctx.fillText(l, x0 + PAD, y + 56 + i * 40));

  // picote com recortes semicirculares
  const py = y0 + headH + answerH;
  ctx.strokeStyle = perf; ctx.lineWidth = 3; ctx.setLineDash([12, 9]);
  ctx.beginPath(); ctx.moveTo(x0 + 22, py); ctx.lineTo(x0 + sw - 22, py); ctx.stroke();
  ctx.setLineDash([]); ctx.fillStyle = shell;
  ctx.beginPath(); ctx.arc(x0, py, 22, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x0 + sw, py, 22, 0, Math.PI * 2); ctx.fill();

  // períodos
  y = py + 72;
  ctx.fillStyle = ink; ctx.font = `700 34px ${COND}`;
  ctx.fillText(`Tire férias nestas datas em ${plan.year}`, x0 + PAD, y);
  y += 20;
  plan.periods.forEach((p, i) => {
    ctx.strokeStyle = line; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x0 + PAD, y); ctx.lineTo(x0 + sw - PAD, y); ctx.stroke();
    ctx.fillStyle = ink; ctx.font = `700 34px ${COND}`;
    ctx.fillText(`${i + 1}º período`, x0 + PAD, y + 42);
    ctx.font = `700 28px ${MONO}`;
    ctx.fillText(`${fmt(p.s)} a ${fmt(p.e)}`, x0 + PAD + 190, y + 40);
    ctx.fillStyle = blue; ctx.font = `700 30px ${COND}`;
    ctx.textAlign = 'right'; ctx.fillText(`${dias(p.L)} de férias`, x0 + sw - PAD, y + 42); ctx.textAlign = 'left';
    ctx.fillStyle = ink2; ctx.font = `500 26px ${COND}`;
    ctx.fillText(`Você fica sem trabalhar de ${fmt(p.xs)} a ${fmt(p.xe)} (${p.xe - p.xs + 1} dias).`, x0 + PAD, y + 86);
    y += rowH;
  });

  // rodapé
  y += 40;
  ctx.fillStyle = ink; ctx.font = `500 30px ${COND}`;
  noteLines.forEach((l, i) => ctx.fillText(l, x0 + PAD, y + i * 38));
  ctx.fillStyle = ink2; ctx.font = `500 24px ${COND}`;
  ctx.fillText(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, x0 + PAD, y + noteLines.length * 38 + 14);

  return new Promise((ok, fail) => canvas.toBlob((b) => (b ? ok(b) : fail(new Error('toBlob'))), 'image/png'));
}

export async function downloadTicket(plan: SavedPlan) {
  const blob = await renderTicket(plan);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `ticket-ferias-${plan.year}.png`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
