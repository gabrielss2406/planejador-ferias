import logoUrl from '../assets/logo.png';
import { idx, MN, dateOf } from './dates';
import { joinNames, overlaps, type GroupMember } from './group';
import { COND, MONO, M, PAD, W, css, dias, loadImage, saveBlob, wrap } from './ticketImage';

const pad2 = (n: number) => String(n).padStart(2, '0');
const sh = (i: number) => `${pad2(dateOf(i).getUTCDate())}/${pad2(dateOf(i).getUTCMonth() + 1)}`;
const range = (s: number, e: number) => `${sh(s)} a ${sh(e)}`;

/** Corta o texto com reticências para caber em `max` pixels (usa a fonte já definida no contexto). */
function fit(ctx: CanvasRenderingContext2D, text: string, max: number) {
  if (ctx.measureText(text).width <= max) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + '…').width > max) t = t.slice(0, -1);
  return t + '…';
}

/** Desenha o "ticket do grupo": régua do ano por pessoa, datas de cada uma e os dias em que coincidem. */
export async function renderGroupTicket(members: GroupMember[], year: number): Promise<Blob> {
  const ink = css('--tinta', '#101820'), ink2 = css('--tinta-2', '#4B5866'), paper = css('--papel', '#FFFFFF');
  const shell = css('--grafite', '#101820'), perf = css('--picote', '#B8C0C9'), line = css('--trilho', '#E6E9ED');
  const blue = css('--azul', '#2563EB'), amber = css('--ambar', '#FFB000');

  await Promise.all([
    document.fonts.load(`800 100px ${MONO}`), document.fonts.load(`700 40px ${COND}`), document.fonts.load(`500 24px ${COND}`),
  ].map((p) => p.catch(() => null)));
  const logo = await loadImage(logoUrl).catch(() => null);

  const withPlan = members.filter((m) => m.plan?.year === year);
  const ov = overlaps(members, year);
  const inner = W - 2 * M - 2 * PAD;
  const note = 'Cada pessoa escolheu o próprio plano. Quem define a época das férias é o empregador (CLT, art. 136): leve isto como uma proposta para negociar.';

  const sentence = withPlan.length < 2
    ? 'Ainda não há dois planos de ' + year + ' para comparar.'
    : ov.length
      ? `Há ${ov.length === 1 ? 'um trecho' : `${ov.length} trechos`} com férias ao mesmo tempo, somando ${dias(ov.reduce((n, o) => n + o.e - o.s + 1, 0))}.`
      : 'Ninguém tem férias ao mesmo tempo neste ano.';

  const probe = document.createElement('canvas').getContext('2d')!;
  probe.font = `500 30px ${COND}`;
  const sentLines = wrap(probe, sentence, inner);
  const noteLines = wrap(probe, note, inner);

  const NAMEW = 210, ROW = 50;
  const headH = 120;
  const answerH = 190 + sentLines.length * 40;
  const rulerH = 64 + 64 + withPlan.length * ROW + 56;
  const listH = 64 + members.length * 50;
  const ovH = ov.length ? 64 + ov.length * 46 : 0;
  const footH = 40 + noteLines.length * 38 + 50;
  const sheetH = headH + answerH + rulerH + listH + ovH + footH;
  const H = sheetH + 2 * M;
  const S = 2;

  const canvas = document.createElement('canvas');
  canvas.width = W * S; canvas.height = H * S;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(S, S);
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = shell; ctx.fillRect(0, 0, W, H);
  const x0 = M, y0 = M, sw = W - 2 * M, L = x0 + PAD, R = x0 + sw - PAD;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 12;
  ctx.fillStyle = paper;
  ctx.beginPath(); ctx.roundRect(x0, y0, sw, sheetH, 16); ctx.fill();
  ctx.restore();

  // cabeçalho
  let y = y0 + 34;
  if (logo) { const h = 56; ctx.drawImage(logo, L, y, (logo.width / logo.height) * h, h); }
  ctx.fillStyle = ink2; ctx.textAlign = 'right'; ctx.font = `700 36px ${COND}`;
  ctx.fillText(`Férias em grupo ${year}`, R, y + 40);
  ctx.textAlign = 'left';

  // resposta: quantas pessoas já escolheram
  y = y0 + headH + 100;
  ctx.fillStyle = ink; ctx.font = `800 128px ${MONO}`;
  const numW = ctx.measureText(String(withPlan.length)).width;
  ctx.fillText(String(withPlan.length), L, y);
  ctx.font = `700 52px ${COND}`;
  ctx.fillText(withPlan.length === 1 ? 'pessoa com férias escolhidas' : 'pessoas com férias escolhidas', L + numW + 24, y);
  ctx.fillStyle = ink2; ctx.font = `500 30px ${COND}`;
  sentLines.forEach((l, i) => ctx.fillText(l, L, y + 56 + i * 40));

  // picote
  const py = y0 + headH + answerH;
  ctx.strokeStyle = perf; ctx.lineWidth = 3; ctx.setLineDash([12, 9]);
  ctx.beginPath(); ctx.moveTo(x0 + 22, py); ctx.lineTo(x0 + sw - 22, py); ctx.stroke();
  ctx.setLineDash([]); ctx.fillStyle = shell;
  ctx.beginPath(); ctx.arc(x0, py, 22, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x0 + sw, py, 22, 0, Math.PI * 2); ctx.fill();

  // régua do ano
  y = py + 72;
  ctx.fillStyle = ink; ctx.font = `700 34px ${COND}`;
  ctx.fillText(`O ano de ${year}, pessoa por pessoa`, L, y);
  y += 30;
  const j1 = idx(year, 0, 1), total = idx(year, 11, 31) - j1 + 1;
  const tx = L + NAMEW, tw = R - tx;
  const px = (i: number) => tx + ((i - j1) / total) * tw;
  ctx.font = `600 22px ${COND}`; ctx.fillStyle = ink2;
  MN.forEach((m, k) => ctx.fillText(m.slice(0, 3).toUpperCase(), px(idx(year, k, 1)) + 4, y + 14));
  y += 26;
  withPlan.forEach((m) => {
    ctx.font = `700 26px ${COND}`; ctx.fillStyle = ink;
    ctx.fillText(fit(ctx, m.name + (m.me ? ' (você)' : ''), NAMEW - 16), L, y + 30);
    ctx.fillStyle = line; ctx.beginPath(); ctx.roundRect(tx, y + 6, tw, 30, 4); ctx.fill();
    ctx.fillStyle = blue;
    m.plan!.periods.forEach((p) => ctx.fillRect(px(p.s), y + 11, Math.max(3, px(p.e + 1) - px(p.s)), 20));
    ov.filter((o) => o.pids.includes(m.pid)).forEach((o) => {
      const a = px(o.s), w = Math.max(3, px(o.e + 1) - a);
      ctx.fillStyle = amber; ctx.fillRect(a, y + 11, w, 20);
      ctx.save(); ctx.beginPath(); ctx.rect(a, y + 11, w, 20); ctx.clip();
      ctx.strokeStyle = 'rgba(16,24,32,.5)'; ctx.lineWidth = 2;
      for (let k = a - 24; k < a + w + 24; k += 7) { ctx.beginPath(); ctx.moveTo(k, y + 31); ctx.lineTo(k + 20, y + 11); ctx.stroke(); }
      ctx.restore();
    });
    y += ROW;
  });
  y += 8;
  ctx.font = `500 24px ${COND}`; ctx.fillStyle = blue; ctx.fillRect(L, y - 12, 18, 18);
  ctx.fillStyle = ink2; ctx.fillText('Férias', L + 28, y + 4);
  ctx.fillStyle = amber; ctx.fillRect(L + 130, y - 12, 18, 18);
  ctx.fillStyle = ink2; ctx.fillText('Coincide com alguém do grupo', L + 158, y + 4);
  y += 48;

  // datas de cada pessoa, em texto
  ctx.fillStyle = ink; ctx.font = `700 34px ${COND}`;
  ctx.fillText('Datas de cada um', L, y + 12);
  y += 28;
  members.forEach((m) => {
    ctx.strokeStyle = line; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke();
    ctx.fillStyle = ink; ctx.font = `700 28px ${COND}`;
    ctx.fillText(fit(ctx, m.name + (m.me ? ' (você)' : ''), NAMEW - 16), L, y + 34);
    if (m.plan?.year === year) {
      ctx.font = `700 24px ${MONO}`;
      ctx.fillText(m.plan.periods.map((p) => range(p.s, p.e)).join('  ·  '), tx, y + 33);
      ctx.fillStyle = ink2; ctx.font = `500 26px ${COND}`; ctx.textAlign = 'right';
      ctx.fillText(`${m.plan.off} dias fora`, R, y + 34); ctx.textAlign = 'left';
    } else {
      ctx.fillStyle = ink2; ctx.font = `500 26px ${COND}`;
      ctx.fillText(m.plan ? `escolheu um plano de ${m.plan.year}` : 'ainda não escolheu um plano', tx, y + 34);
    }
    y += 50;
  });
  y += 20;

  // dias em comum
  if (ov.length) {
    ctx.fillStyle = ink; ctx.font = `700 34px ${COND}`;
    ctx.fillText(`Férias ao mesmo tempo em ${year}`, L, y + 12);
    y += 28;
    ov.forEach((o) => {
      ctx.strokeStyle = line; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke();
      ctx.fillStyle = ink; ctx.font = `700 26px ${MONO}`;
      ctx.fillText(range(o.s, o.e), L, y + 33);
      ctx.font = `500 28px ${COND}`;
      ctx.fillText(fit(ctx, joinNames(o.names), tw - 160), tx, y + 34);
      ctx.fillStyle = ink2; ctx.textAlign = 'right';
      ctx.fillText(dias(o.e - o.s + 1), R, y + 34); ctx.textAlign = 'left';
      y += 46;
    });
    y += 20;
  }

  // rodapé
  y += 20;
  ctx.fillStyle = ink; ctx.font = `500 30px ${COND}`;
  noteLines.forEach((l, i) => ctx.fillText(l, L, y + i * 38));
  ctx.fillStyle = ink2; ctx.font = `500 24px ${COND}`;
  ctx.fillText(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, L, y + noteLines.length * 38 + 14);

  return new Promise((ok, fail) => canvas.toBlob((b) => (b ? ok(b) : fail(new Error('toBlob'))), 'image/png'));
}

export async function downloadGroupTicket(members: GroupMember[], year: number) {
  saveBlob(await renderGroupTicket(members, year), `ticket-grupo-ferias-${year}.png`);
}
