import { YEARS } from './calc';
import { abs, adSlot, esc, type PageSpec, type SiteConfig } from './layout';
import { paths } from './paths';

const CLT_URL = 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm';

const table = (head: string[], rows: string[][]) =>
  `<div class="c-wrap"><table class="c-table"><thead><tr>${head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${
    rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

const cta = (label: string) => `<p><a class="c-cta" href="/">${esc(label)}</a></p>`;

const faqHtml = (faq: [string, string][]) => `<dl class="c-faq">${faq.map(([q, a]) => `<dt>${esc(q)}</dt><dd><p>${esc(a)}</p></dd>`).join('')}</dl>`;

const article = (cfg: SiteConfig, path: string, headline: string, updated: string) => ({
  '@context': 'https://schema.org', '@type': 'Article', headline, inLanguage: 'pt-BR',
  dateModified: updated, mainEntityOfPage: abs(cfg, path), publisher: { '@type': 'Organization', name: cfg.siteName, url: cfg.siteUrl },
});

/** Divisões válidas do art. 134, §1º: até 3 períodos, um com 14 dias ou mais e os demais com 5 ou mais. */
export function divisions(total: number): number[][] {
  const out: number[][] = [];
  const ok = (p: number[]) => p[0] >= 14 && p.slice(1).every((d) => d >= 5);
  if (ok([total])) out.push([total]);
  for (let a = total - 5; a >= 1; a--) {
    const b = total - a;
    if (b > a) continue;
    if (ok([a, b])) out.push([a, b]);
  }
  for (let a = total; a >= 1; a--) {
    for (let b = Math.min(a, total - a - 5); b >= 5; b--) {
      const c = total - a - b;
      if (c < 5 || c > b) continue;
      if (ok([a, b, c])) out.push([a, b, c]);
    }
  }
  return out;
}

const last = <T,>(a: T[]) => a[a.length - 1];
const fmtDiv = (d: number[]) => d.join(' + ');

// ---------------------------------------------------------------------------------------------
export function dividirPage(cfg: SiteConfig, updated: string): PageSpec {
  const d30 = divisions(30), d20 = divisions(20);
  const by = (list: number[][], k: number) => list.filter((d) => d.length === k);
  const faq: [string, string][] = [
    ['Preciso da concordância da empresa para dividir as férias?', 'Sim, e também a sua. A lei diz que, desde que haja concordância do empregado, as férias podem ser usufruídas em até três períodos (art. 134, §1º). Na prática, as duas partes combinam as datas.'],
    ['Qual é o menor período que posso pedir?', 'Cinco dias corridos. Um dos períodos precisa ter pelo menos 14 dias corridos; os outros não podem ter menos de 5 dias corridos cada um.'],
    ['Posso começar as férias numa sexta-feira?', 'A lei veda o início das férias nos 2 dias que antecedem feriado ou dia de repouso semanal remunerado (art. 134, §3º). Para quem folga aos domingos, isso afasta o início na sexta e no sábado. Confirme com o RH como a empresa aplica a regra no seu caso.'],
    ['Dividir em 3 períodos é melhor do que tirar 30 dias seguidos?', 'Depende do que você quer. Mais períodos permitem aproveitar mais feriados e fins de semana, mas cada período pede um início fora dos 2 dias antes de feriado ou descanso. O planejador compara as divisões e mostra quantos dias seguidos cada uma libera.'],
  ];
  const body = `
<p class="lede">Desde a reforma trabalhista, as férias de 30 dias podem ser divididas em até 3 períodos. Veja as regras, as divisões que cabem na lei e como escolher a que rende mais dias de folga.</p>
${adSlot(cfg, 'content')}
<h2>A regra do art. 134, §1º da CLT</h2>
<p>As férias são concedidas em um só período, mas, <strong>com a concordância do empregado</strong>, podem ser usufruídas em até três períodos. Um deles não pode ter menos de <strong>14 dias corridos</strong>, e os demais não podem ter menos de <strong>5 dias corridos</strong> cada um.</p>
<p>A divisão é sempre um acordo: a empresa não pode impor o fracionamento sozinha, e você não pode exigi-lo. Quem define a época continua sendo o empregador (art. 136), então chegue com uma proposta pronta.</p>

<h2>Quantas divisões existem?</h2>
<p>Com 30 dias de férias, há ${d30.length} formas de dividir dentro das regras: ${by(d30, 1).length} em um período, ${by(d30, 2).length} em dois e ${by(d30, 3).length} em três. Se você vender 10 dias (veja o <a href="${paths.abono}">abono pecuniário</a>), sobram 20 dias e as formas de dividir caem para ${d20.length}: ${by(d20, 1).length} em um período, ${by(d20, 2).length} em dois e ${by(d20, 3).length} em três.</p>
${table(['Períodos', 'Exemplos com 30 dias', 'Exemplos com 20 dias'], [
    ['1', fmtDiv(by(d30, 1)[0]), fmtDiv(by(d20, 1)[0])],
    ['2', `${fmtDiv(by(d30, 2)[0])}; ${fmtDiv(by(d30, 2)[Math.floor(by(d30, 2).length / 2)])}; ${fmtDiv(last(by(d30, 2)))}`, `${fmtDiv(by(d20, 2)[0])}; ${fmtDiv(last(by(d20, 2)))}`],
    ['3', `${fmtDiv(by(d30, 3)[0])}; ${fmtDiv(by(d30, 3)[Math.floor(by(d30, 3).length / 2)])}; ${fmtDiv(last(by(d30, 3)))}`, by(d20, 3).length ? `${fmtDiv(by(d20, 3)[0])}; ${fmtDiv(last(by(d20, 3)))}` : 'nenhuma'],
  ])}
<p>Os períodos podem vir em qualquer ordem: o que a lei limita é o tamanho de cada um, não a sequência em que você os tira.</p>

<h2>Por que dividir pode render mais folga</h2>
<p>As férias contam em dias corridos, então fins de semana e feriados dentro delas entram na conta. O ganho está nas pontas: começar logo depois de um fim de semana ou feriado e terminar logo antes de outro. Com mais períodos, você tem mais pontas para encaixar em feriados do ano.</p>
<p>Exemplo com 30 dias divididos em três períodos: um de 14 dias e dois de 8. Cada período pode ser colado a um feriadão diferente, de modo que os 30 dias de férias virem bem mais de 30 dias fora do trabalho ao longo do ano. O <a href="/">planejador</a> testa as ${d30.length} divisões e todas as datas de início possíveis no seu ano.</p>

<h2>O que a lei veda no início das férias</h2>
<p>O art. 134, §3º proíbe o início das férias nos 2 dias que antecedem feriado ou dia de repouso semanal remunerado. Quem descansa aos domingos não pode, por isso, começar as férias na sexta, no sábado nem nos dois dias antes de um feriado. O planejador já descarta essas datas, e só propõe inícios de segunda a quinta fora desses dias.</p>

<h2>Direitos de quem divide as férias</h2>
<ul>
<li>Cada período gera o seu aviso: a empresa informa por escrito, com pelo menos 30 dias de antecedência, as datas de início e fim (art. 135).</li>
<li>O pagamento de cada período deve sair até 2 dias antes do início dele (art. 145).</li>
<li>Os membros de uma mesma família que trabalham no mesmo estabelecimento têm direito a tirar férias juntos, se quiserem e se isso não prejudicar o serviço (art. 136, §1º).</li>
<li>O empregado estudante menor de 18 anos pode fazer as férias coincidirem com as férias escolares (art. 136, §2º).</li>
</ul>

<h2>Perguntas frequentes</h2>
${faqHtml(faq)}
${adSlot(cfg, 'footer')}
<p>Texto da lei: <a href="${CLT_URL}" rel="noopener">CLT no site do Planalto</a> (arts. 129 a 153). Para o panorama completo, veja o <a href="${paths.guia}">guia de férias pela CLT</a>.</p>
${cta('Ver as melhores divisões')}`;
  return {
    path: paths.dividir, updated,
    title: 'Como dividir as férias em até 3 períodos pela CLT (art. 134)',
    description: 'Regras para dividir as férias em até 3 períodos: um de 14 dias ou mais, os outros de 5 dias ou mais. Quantas divisões existem, exemplos e como render mais folga.',
    h1: 'Como dividir as férias em até 3 períodos',
    body,
    crumbs: [{ name: 'Guia de férias pela CLT', path: paths.guia }],
    related: [{ href: paths.abono, label: 'Abono pecuniário: vender 10 dias' }, { href: paths.aviso, label: 'Aviso, pagamento e férias coletivas' }, { href: paths.melhores(YEARS[1]), label: `Melhores datas em ${YEARS[1]}` }],
    jsonLd: [article(cfg, paths.dividir, 'Como dividir as férias em até 3 períodos', updated)],
  };
}

// ---------------------------------------------------------------------------------------------
export function abonoPage(cfg: SiteConfig, updated: string): PageSpec {
  const rows = [['até 5', 30], ['de 6 a 14', 24], ['de 15 a 23', 18], ['de 24 a 32', 12]].map(([f, d]) => [String(f), String(d), String((d as number) / 3), String((d as number) - (d as number) / 3)]);
  const faq: [string, string][] = [
    ['A empresa pode recusar o meu pedido de abono?', 'Não. A lei diz que é facultado ao empregado converter 1/3 das férias em abono pecuniário (art. 143). É um direito seu, desde que você peça no prazo.'],
    ['Até quando preciso pedir?', 'Até 15 dias antes do fim do período aquisitivo, ou seja, antes de completar os 12 meses de trabalho que dão direito às férias (art. 143, §1º).'],
    ['Posso vender mais do que 10 dias?', 'Não. O limite é 1/3 das férias a que você tem direito. Com 30 dias, são 10; com 24 dias, são 8.'],
    ['Posso vender e dividir as férias ao mesmo tempo?', 'Pode. Você vende até 1/3 e divide o restante em até 3 períodos, respeitando os mínimos do art. 134, §1º. Veja as regras em como dividir as férias.'],
    ['O abono tem o acréscimo de 1/3 da Constituição?', 'O abono é pago no valor da remuneração que seria devida nos dias vendidos (art. 143). Para saber o valor exato, confira o holerite ou o RH da empresa: este site não faz cálculo de valores.'],
  ];
  const body = `
<p class="lede">É possível trocar até 1/3 das férias por dinheiro. Veja como funciona o abono pecuniário, o prazo para pedir e como isso muda o planejamento das datas.</p>
${adSlot(cfg, 'content')}
<h2>O que é o abono pecuniário</h2>
<p>É a conversão de parte das férias em dinheiro. O art. 143 da CLT diz que é facultado ao empregado converter 1/3 do período de férias a que tiver direito em abono pecuniário, no valor da remuneração que lhe seria devida nos dias correspondentes. Na prática, quem tem 30 dias pode vender 10 e descansar 20.</p>
<p>A palavra decisiva é <strong>facultado ao empregado</strong>: a escolha é sua, e não da empresa.</p>

<h2>Quantos dias posso vender</h2>
<p>O 1/3 vale sobre os dias de férias que você tem direito, e esse número depende das faltas injustificadas no período aquisitivo (art. 130):</p>
${table(['Faltas injustificadas', 'Dias de férias', 'Dias que posso vender (1/3)', 'Dias de descanso'], rows)}

<h2>Prazo e pagamento</h2>
<ul>
<li><strong>Quando pedir:</strong> até 15 dias antes do término do período aquisitivo (art. 143, §1º). Peça por escrito e guarde o protocolo.</li>
<li><strong>Quando receber:</strong> o abono deve ser pago junto com a remuneração das férias, até 2 dias antes do início do descanso (art. 145).</li>
</ul>

<h2>Como o abono muda o planejamento</h2>
<p>Ao vender 10 dias, você passa a ter 20 dias para encaixar no calendário. Como as férias contam em dias corridos, 20 dias bem posicionados, colados em feriados e fins de semana, podem render mais de 20 dias seguidos fora do trabalho. Na página de <a href="${paths.melhores(YEARS[1])}">melhores datas de ${YEARS[1]}</a> há planos prontos de 20 dias, e no <a href="/">planejador</a> você escolhe quantos dias de férias terá.</p>
<p>Com 20 dias, as divisões possíveis em até 3 períodos são menos que com 30, porque cada período precisa de pelo menos 5 dias e um deles de 14 ou mais. Veja os números em <a href="${paths.dividir}">como dividir as férias</a>.</p>

<h2>Perguntas frequentes</h2>
${faqHtml(faq)}
${adSlot(cfg, 'footer')}
<p>Texto da lei: <a href="${CLT_URL}" rel="noopener">CLT no site do Planalto</a>. Em caso de dúvida sobre o seu contrato, procure o RH, o sindicato ou um advogado trabalhista.</p>
${cta('Planejar com 20 dias')}`;
  return {
    path: paths.abono, updated,
    title: 'Abono pecuniário: como vender 10 dias de férias (CLT, art. 143)',
    description: 'Como funciona a venda de 1/3 das férias: quem decide, prazo para pedir (15 dias antes do fim do período aquisitivo), quantos dias dá para vender e como planejar.',
    h1: 'Abono pecuniário: vender 10 dias de férias',
    body,
    crumbs: [{ name: 'Guia de férias pela CLT', path: paths.guia }],
    related: [{ href: paths.dividir, label: 'Como dividir as férias em até 3 períodos' }, { href: paths.aviso, label: 'Aviso, pagamento e férias coletivas' }, { href: paths.melhores(YEARS[1]), label: `Melhores datas em ${YEARS[1]}` }],
    jsonLd: [article(cfg, paths.abono, 'Abono pecuniário: vender 10 dias de férias', updated)],
  };
}

// ---------------------------------------------------------------------------------------------
export function avisoPage(cfg: SiteConfig, updated: string): PageSpec {
  const faq: [string, string][] = [
    ['A empresa pode me chamar durante as férias?', 'A lei não prevê trabalho durante as férias: o período é de descanso. Se isso acontecer, registre e converse com o RH ou o sindicato.'],
    ['Posso trabalhar para outra empresa nas minhas férias?', 'Em regra, não. O art. 138 proíbe prestar serviços a outro empregador durante as férias, salvo se você já mantiver outro contrato de trabalho regular com ele.'],
    ['E se eu sair da empresa com férias pendentes?', 'Na rescisão, as férias vencidas e as proporcionais são pagas com o acréscimo de 1/3 (arts. 146 e 147).'],
    ['Férias coletivas descontam do meu saldo?', 'Sim. Os dias de férias coletivas são descontados dos dias de férias a que você tem direito. Quem tem menos de 12 meses de casa goza férias proporcionais e inicia novo período aquisitivo (art. 140).'],
  ];
  const body = `
<p class="lede">Quem avisa, quando paga e o que acontece se o prazo passar: o passo a passo do que a empresa precisa fazer para conceder as férias, e como funcionam as férias coletivas.</p>
${adSlot(cfg, 'content')}
<h2>O aviso: 30 dias de antecedência, por escrito</h2>
<p>A empresa precisa comunicar as férias por escrito, com antecedência mínima de 30 dias (art. 135). A comunicação informa as datas de início e fim, e você assina o recibo. Por isso, o melhor momento para levar a sua proposta de datas é bem antes: se o aviso já vier fechado, a negociação fica mais difícil.</p>

<h2>O pagamento: até 2 dias antes</h2>
<p>A remuneração das férias, acrescida de 1/3 (Constituição, art. 7º, XVII), e o abono pecuniário, se você o pediu, devem ser pagos até 2 dias antes do início do período (art. 145). Se você dividir as férias, o mesmo vale para cada período. Este site não calcula valores: use o holerite ou o RH.</p>

<h2>O prazo: férias vencidas pagas em dobro</h2>
<p>As férias devem ser concedidas nos 12 meses seguintes ao período aquisitivo, o período concessivo (art. 134). Se a empresa deixar o prazo passar, ela paga as férias em dobro (art. 137). Você também pode pedir à Justiça do Trabalho que fixe a data (art. 137, §1º).</p>

<h2>Quem escolhe a data</h2>
<p>A época das férias é a que melhor consulte os interesses do empregador (art. 136). Isso não impede a negociação: leve uma proposta com datas que não deixem a equipe descoberta. Duas exceções ajudam: membros da mesma família que trabalham no mesmo local podem tirar férias juntos, se quiserem e sem prejuízo do serviço (art. 136, §1º), e o estudante menor de 18 anos pode coincidir as férias com as escolares (art. 136, §2º).</p>

<h2>Férias coletivas</h2>
<p>A empresa pode conceder férias coletivas a todos os empregados ou só a determinados setores ou estabelecimentos (art. 139). Pontos principais:</p>
<ul>
<li>Podem ser gozadas em <strong>até 2 períodos</strong> por ano, nenhum com menos de 10 dias corridos (art. 139, §1º).</li>
<li>A empresa precisa comunicar o órgão do Ministério do Trabalho com pelo menos 15 dias de antecedência, informar o sindicato e afixar aviso nos locais de trabalho (art. 139, §§2º e 3º).</li>
<li>Se você tem menos de 12 meses de casa, goza férias proporcionais e inicia novo período aquisitivo (art. 140).</li>
</ul>
<p>Em férias coletivas você não escolhe a data: o que dá para fazer é planejar o saldo restante, se houver, com o <a href="/">planejador</a>.</p>

<h2>Durante e depois das férias</h2>
<p>Durante as férias, você não pode prestar serviços a outro empregador, salvo se já tiver outro contrato de trabalho regular com ele (art. 138). Se sair da empresa, as férias vencidas e as proporcionais são pagas na rescisão, com o acréscimo de 1/3 (arts. 146 e 147).</p>

<h2>Perguntas frequentes</h2>
${faqHtml(faq)}
${adSlot(cfg, 'footer')}
<p>Veja também <a href="${paths.dividir}">como dividir as férias</a> e o <a href="${paths.abono}">abono pecuniário</a>. Texto da lei: <a href="${CLT_URL}" rel="noopener">CLT no site do Planalto</a>.</p>
${cta('Montar minhas férias')}`;
  return {
    path: paths.aviso, updated,
    title: 'Aviso, pagamento e férias coletivas: o que a CLT exige',
    description: 'O que a empresa precisa fazer para conceder férias: aviso com 30 dias, pagamento até 2 dias antes, pagamento em dobro fora do prazo e como funcionam as férias coletivas.',
    h1: 'Aviso, pagamento e férias coletivas',
    body,
    crumbs: [{ name: 'Guia de férias pela CLT', path: paths.guia }],
    related: [{ href: paths.dividir, label: 'Como dividir as férias em até 3 períodos' }, { href: paths.abono, label: 'Abono pecuniário: vender 10 dias' }, { href: paths.guia, label: 'Guia de férias pela CLT' }],
    jsonLd: [article(cfg, paths.aviso, 'Aviso, pagamento e férias coletivas', updated)],
  };
}
