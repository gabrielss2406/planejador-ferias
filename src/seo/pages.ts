import type { PlanOption } from '../lib/types';
import {
  ALL_UFS, UF_NAMES, YEARS, bestPlans, bridges, days, dm, dmWeek, isConfirmed, weekday, yearHolidays,
} from './calc';
import { abs, adSlot, adsOn, esc, type PageSpec, type SiteConfig } from './layout';

const CLT_URL = 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm';

export const paths = {
  guia: '/guia-ferias-clt/',
  privacidade: '/privacidade/',
  sobre: '/sobre/',
  contato: '/contato/',
  feriados: (y: number) => `/feriados-${y}/`,
  melhores: (y: number) => `/melhores-datas-ferias-${y}/`,
  estado: (y: number, uf: string) => `/feriados-${y}/${uf.toLowerCase()}/`,
};

const table = (head: string[], rows: string[][]) =>
  `<div class="c-wrap"><table class="c-table"><thead><tr>${head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${
    rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

const cta = (label = 'Simular minhas férias') => `<p><a class="c-cta" href="/">${esc(label)}</a></p>`;

function planBlock(p: PlanOption, n: number, N: number) {
  const gain = Math.max(0, p.off - N);
  const periods = p.periods.map((q, i) =>
    `<li><strong>${i + 1}º período:</strong> <span class="mono">${esc(dmWeek(q.s))} a ${esc(dmWeek(q.e))}</span> (${days(q.L)} de férias). Você fica sem trabalhar de ${esc(dmWeek(q.xs))} a ${esc(dmWeek(q.xe))} (${days(q.xe - q.xs + 1)}).</li>`).join('');
  return `<div class="c-plan"><h3>Plano ${n}</h3><p><b class="big">${p.off}</b> dias fora do trabalho usando ${days(N)} de férias${gain ? `, ${days(gain)} a mais do que os dias de férias` : ''}, em ${p.k === 1 ? '1 período' : `${p.k} períodos`}.</p><ul>${periods}</ul></div>`;
}

// ---------------------------------------------------------------------------------------------
// Guia CLT
// ---------------------------------------------------------------------------------------------
export function guiaPage(cfg: SiteConfig, updated: string): PageSpec {
  const faq: [string, string][] = [
    ['O empregador pode escolher a data das minhas férias?', 'Pode. A lei diz que a época das férias é a que melhor consulte os interesses do empregador (art. 136), dentro dos 12 meses seguintes ao período aquisitivo (art. 134). Isso não impede você de propor datas: chegar com uma proposta pronta costuma ajudar.'],
    ['Posso tirar férias antes de completar 12 meses de trabalho?', 'O direito às férias nasce depois do período aquisitivo de 12 meses (art. 130). Antecipar depende de acordo com a empresa.'],
    ['Posso dividir as férias sem a concordância da empresa?', 'Não. O fracionamento em até 3 períodos precisa da concordância do empregado e da empresa, e respeitar os mínimos do art. 134, §1º.'],
    ['Carnaval e Corpus Christi são feriados?', 'Não são feriados nacionais por lei: são pontos facultativos. Só valem como folga se a sua empresa conceder ou se houver lei, convenção ou acordo prevendo.'],
    ['Se a empresa não conceder as férias a tempo, o que acontece?', 'Passado o período concessivo, as férias devem ser pagas em dobro (art. 137).'],
  ];
  const body = `
<p class="lede">O que a CLT diz sobre quantos dias de férias você tem, como dividir, quando vender parte delas e quem decide a data, em linguagem simples.</p>
${adSlot(cfg, 'content')}
<h2 id="quantos-dias">Quantos dias de férias eu tenho?</h2>
<p>Depois de cada período de 12 meses de trabalho (o <strong>período aquisitivo</strong>), você tem direito a 30 dias corridos de férias, desde que não tenha faltado sem justificativa mais de 5 vezes (art. 130). Com mais faltas injustificadas, o direito diminui:</p>
${table(['Faltas injustificadas no período', 'Dias de férias'], [['até 5', '30'], ['de 6 a 14', '24'], ['de 15 a 23', '18'], ['de 24 a 32', '12']])}
<p>Os dias contam <strong>corridos</strong>: fins de semana e feriados dentro das férias entram na conta. Por isso vale começar logo depois de um fim de semana ou feriado e terminar logo antes de outro.</p>

<h2 id="quando">Quando posso tirar as férias?</h2>
<p>As férias são concedidas nos 12 meses seguintes ao período aquisitivo, o <strong>período concessivo</strong> (art. 134). A época é a que melhor atender ao interesse do empregador (art. 136). Se a empresa deixar o prazo passar, ela paga as férias em dobro (art. 137).</p>
<p>A empresa deve avisar por escrito com pelo menos 30 dias de antecedência (art. 135). Na prática, é o seu momento de negociar: quanto antes você levar uma proposta, mais fácil ela entrar no planejamento da equipe.</p>

<h2 id="dividir">Posso dividir as férias?</h2>
<p>Pode, <strong>com a sua concordância</strong>, em até 3 períodos. Um deles não pode ter menos de 14 dias corridos, e os outros não podem ter menos de 5 dias corridos cada (art. 134, §1º). Com 30 dias, alguns exemplos que cabem nas regras: 30; 15 + 15; 20 + 10; 14 + 8 + 8; 14 + 11 + 5.</p>
<p>O art. 134, §3º veda o início das férias nos 2 dias que antecedem feriado ou dia de repouso semanal remunerado. Por isso o <a href="/">planejador</a> não sugere começar de sexta a domingo nem a 1 ou 2 dias de um feriado. Confira com o RH como a sua empresa aplica essa regra antes de fechar as datas.</p>
<p>O <a href="/">planejador</a> testa todas as divisões permitidas e mostra as que deixam mais dias seguidos sem trabalhar.</p>

<h2 id="abono">Posso vender parte das férias?</h2>
<p>Pode converter até 1/3 das férias em dinheiro, o <strong>abono pecuniário</strong> (art. 143): com 30 dias, você vende 10 e descansa 20. É uma opção do empregado e deve ser pedida até 15 dias antes do fim do período aquisitivo (art. 143, §1º).</p>

<h2 id="pagamento">Quanto eu recebo?</h2>
<p>Você recebe a remuneração do período de férias com o acréscimo de 1/3 (Constituição, art. 7º, XVII). O pagamento deve sair até 2 dias antes do início das férias (art. 145). Este site não calcula valores: use o holerite ou o RH da sua empresa.</p>

<h2 id="perguntas">Perguntas frequentes</h2>
<dl class="c-faq">${faq.map(([q, a]) => `<dt>${esc(q)}</dt><dd><p>${esc(a)}</p></dd>`).join('')}</dl>
${adSlot(cfg, 'footer')}
<p>Texto da lei: <a href="${CLT_URL}" rel="noopener">CLT no site do Planalto</a> (arts. 129 a 153).</p>
${cta('Montar minhas férias')}`;
  return {
    path: paths.guia, updated,
    title: 'Férias pela CLT: quantos dias, como dividir e vender 10 dias (guia simples)',
    description: 'Guia direto sobre férias pela CLT: 30 dias, divisão em até 3 períodos, abono de 10 dias, aviso, pagamento e quem escolhe a data. Com os artigos da lei.',
    h1: 'Férias pela CLT: o guia simples',
    body,
    related: [{ href: paths.melhores(YEARS[1]), label: `Melhores datas de férias em ${YEARS[1]}` }, { href: paths.feriados(YEARS[1]), label: `Feriados de ${YEARS[1]}` }],
    jsonLd: [{
      '@context': 'https://schema.org', '@type': 'Article', headline: 'Férias pela CLT: o guia simples', inLanguage: 'pt-BR',
      dateModified: updated, mainEntityOfPage: abs(cfg, paths.guia), publisher: { '@type': 'Organization', name: cfg.siteName, url: cfg.siteUrl },
    }],
  };
}

// ---------------------------------------------------------------------------------------------
// Feriados por ano (nacional) e por estado
// ---------------------------------------------------------------------------------------------
function holidayTables(year: number, uf: string) {
  const all = yearHolidays(year, uf);
  const real = all.filter((h) => h.kind !== 'facultativo');
  const fac = all.filter((h) => h.kind === 'facultativo');
  const weekdays = real.filter((h) => weekday(h.i) !== 'sábado' && weekday(h.i) !== 'domingo');
  const label = (k: string) => (k === 'estadual' ? 'Estadual' : 'Nacional');
  const main = table(['Data', 'Dia da semana', 'Feriado', 'Tipo'], real.map((h) => [dm(h.i), esc(weekday(h.i)), esc(h.name), label(h.kind)]));
  const opt = table(['Data', 'Dia da semana', 'Ponto facultativo'], fac.map((h) => [dm(h.i), esc(weekday(h.i)), esc(h.name)]));
  return { all, real, fac, weekdays, main, opt };
}

function bridgeTable(year: number, uf: string) {
  const b = bridges(year, uf);
  if (!b.length) return '<p>Nenhum feriado em dia útil para emendar neste ano.</p>';
  return table(['Feriado', 'Quando', 'Férias para emendar', 'Dias seguidos fora'],
    b.map((x) => [esc(x.hol.name), esc(dmWeek(x.hol.i)), x.vacation ? days(x.vacation) : 'nenhum', `${x.off} (de ${esc(dm(x.from))} a ${esc(dm(x.to))})`]));
}

export function feriadosPage(cfg: SiteConfig, year: number, updated: string): PageSpec {
  const t = holidayTables(year, '');
  const confirmed = ALL_UFS.filter(isConfirmed);
  const body = `
<p class="lede">Em ${year}, o Brasil tem ${t.real.length} feriados nacionais; ${t.weekdays.length} caem de segunda a sexta. Veja as datas, os pontos facultativos e como emendar feriados com poucos dias de férias.</p>
${adSlot(cfg, 'content')}
<h2>Feriados nacionais de ${year}</h2>
${t.main}
<h2>Pontos facultativos em ${year}</h2>
<p>Carnaval e Corpus Christi não são feriados nacionais por lei. Só viram folga se a sua empresa conceder.</p>
${t.opt}
<h2>Feriadões e pontes em ${year}</h2>
<p>Quando o feriado cai no meio da semana, poucos dias de férias rendem uma folga longa. Os cálculos consideram fins de semana e outros feriados como folga.</p>
${bridgeTable(year, '')}
${adSlot(cfg, 'footer')}
<h2>Feriados do seu estado</h2>
<p>Cada estado tem feriados próprios, e cada cidade tem os municipais. Escolha o estado:</p>
<ul>${confirmed.map((uf) => `<li><a href="${paths.estado(year, uf)}">${esc(UF_NAMES[uf])} (${uf})</a></li>`).join('')}</ul>
<p>Para a sua cidade, use o <a href="/">planejador</a>: ele busca os feriados municipais de qualquer município.</p>
${cta()}`;
  return {
    path: paths.feriados(year), updated,
    title: `Feriados ${year}: lista completa, pontes e feriadões`,
    description: `Todos os feriados nacionais de ${year} com dia da semana, pontos facultativos e os feriadões que dá para emendar com poucos dias de férias.`,
    h1: `Feriados ${year}`,
    body,
    related: [
      { href: paths.melhores(year), label: `Melhores datas de férias em ${year}` }, { href: paths.guia, label: 'Guia de férias pela CLT' },
      ...YEARS.filter((y) => y !== year).map((y) => ({ href: paths.feriados(y), label: `Feriados ${y}` })),
    ],
  };
}

export function estadoPage(cfg: SiteConfig, year: number, uf: string, updated: string): PageSpec {
  const nome = UF_NAMES[uf];
  const ok = isConfirmed(uf);
  const t = holidayTables(year, uf);
  const est = t.real.filter((h) => h.kind === 'estadual');
  const top = bestPlans(year, 30, uf, 1)[0];
  const body = `
<p class="lede">${ok
    ? `${nome} tem ${est.length} ${est.length === 1 ? 'feriado estadual' : 'feriados estaduais'} em ${year}, além dos ${t.real.length - est.length} nacionais. Veja as datas e os feriadões para planejar as férias.`
    : `Esta página mostra os feriados nacionais de ${year} em ${nome}. Ainda estamos conferindo os feriados estaduais de ${nome} na lei estadual, então eles não aparecem aqui.`}</p>
${ok ? '' : `<p class="note">Os feriados estaduais de ${esc(nome)} ainda não foram conferidos. Confirme com o governo do estado ou com o RH.</p>`}
${adSlot(cfg, 'content')}
<h2>Feriados de ${year} em ${esc(nome)}</h2>
${t.main}
<h2>Pontos facultativos</h2>
${t.opt}
<h2>Feriadões e pontes em ${esc(nome)} em ${year}</h2>
${bridgeTable(year, uf)}
${top ? `<h2>Melhor plano de 30 dias em ${esc(nome)} em ${year}</h2><p>Combinando férias, fins de semana e os feriados acima, esta é a melhor divisão que o planejador encontra para ${esc(nome)}:</p>${planBlock(top, 1, 30)}` : ''}
${adSlot(cfg, 'footer')}
<h2>E o feriado da minha cidade?</h2>
<p>Cada município tem feriados próprios, como o aniversário da cidade e o dia do padroeiro. No <a href="/">planejador</a> você escolhe a cidade e os feriados municipais entram no cálculo (a base é aberta e pode estar incompleta: confirme com a prefeitura).</p>
${cta()}`;
  return {
    path: paths.estado(year, uf), updated, noindex: !ok,
    title: `Feriados ${year} em ${nome} (${uf}): estaduais, nacionais e feriadões`,
    description: `Feriados de ${year} em ${nome}: datas, pontos facultativos, feriadões e o melhor plano de férias combinando tudo.`,
    h1: `Feriados ${year} em ${nome}`,
    crumbs: [{ name: `Feriados ${year}`, path: paths.feriados(year) }],
    body,
    related: [
      { href: paths.feriados(year), label: `Feriados nacionais ${year}` }, { href: paths.melhores(year), label: `Melhores datas de férias em ${year}` },
      ...YEARS.filter((y) => y !== year && ok).map((y) => ({ href: paths.estado(y, uf), label: `Feriados ${y} em ${uf}` })),
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// Melhores datas de férias
// ---------------------------------------------------------------------------------------------
export function melhoresPage(cfg: SiteConfig, year: number, updated: string): PageSpec {
  const blocks = ([30, 20] as const).map((N) => {
    const plans = bestPlans(year, N);
    return `<h2>${N === 30 ? 'Com 30 dias de férias' : 'Com 20 dias de férias (vendendo 10)'}</h2>${
      N === 20 ? '<p>Se você vender 10 dias (abono pecuniário), descansa 20. Estas são as melhores divisões.</p>' : ''}${
      plans.map((p, i) => planBlock(p, i + 1, N)).join('')}`;
  });
  const first = bestPlans(year, 30, '', 1)[0];
  const body = `
<p class="lede">A melhor época para tirar férias em ${year} é a que emenda feriados e fins de semana: você usa os mesmos dias de férias e fica mais tempo sem trabalhar. Estes são os melhores planos que o planejador calcula para o país.</p>
${first ? `<p>O melhor plano de 30 dias deixa você <strong>${first.off} dias fora do trabalho</strong>: ${days(Math.max(0, first.off - 30))} a mais do que os 30 de férias.</p>` : ''}
${adSlot(cfg, 'content')}
${blocks[0]}
${blocks[1]}
${adSlot(cfg, 'footer')}
<h2>Como esses planos são escolhidos</h2>
<p>O planejador testa todas as divisões que a CLT permite (até 3 períodos; o menor com 5 dias ou mais e o maior com 14 dias ou mais) e pontua cada uma pelos dias seguidos que ela libera, emendando fins de semana e feriados. Só mostramos planos que começam de segunda a quinta e não nos 2 dias antes de um feriado (art. 134, §3º). Considera os feriados nacionais e trata Carnaval e Corpus Christi como pontos facultativos, que dependem da empresa. Quem define a época é o empregador (CLT, art. 136), então leve o plano como proposta.</p>
<p>Os resultados acima são para o Brasil inteiro. Com o seu estado, a sua cidade, os meses que você aceita e as datas que não pode faltar, o resultado muda: simule no planejador.</p>
${cta('Simular com os meus dados')}`;
  return {
    path: paths.melhores(year), updated,
    title: `Melhores datas para tirar férias em ${year}: planos prontos`,
    description: `Os melhores períodos para tirar férias em ${year}, emendando feriados e fins de semana: planos de 30 e de 20 dias, com datas e dias fora do trabalho.`,
    h1: `Melhores datas para tirar férias em ${year}`,
    body,
    related: [
      { href: paths.feriados(year), label: `Feriados ${year}` }, { href: paths.guia, label: 'Guia de férias pela CLT' },
      ...YEARS.filter((y) => y !== year).map((y) => ({ href: paths.melhores(y), label: `Melhores datas em ${y}` })),
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// Privacidade e 404
// ---------------------------------------------------------------------------------------------
export function privacidadePage(cfg: SiteConfig, updated: string): PageSpec {
  const contact = cfg.contactEmail
    ? `Para pedir informações ou a remoção de dados, escreva para <a href="mailto:${esc(cfg.contactEmail)}">${esc(cfg.contactEmail)}</a>.`
    : 'Para pedir informações ou a remoção de dados, use o contato informado no site.';
  const ads = adsOn(cfg)
    ? `<h2>Anúncios e cookies</h2>
<p>Este site exibe anúncios do Google AdSense. Antes de carregar qualquer anúncio, pedimos a sua escolha. Se você aceitar, o Google pode usar cookies e identificadores para mostrar anúncios com base nos seus interesses. Se recusar, mostramos apenas anúncios não personalizados, que não usam o seu histórico de navegação. Você pode mudar a escolha a qualquer momento em "Preferências de anúncios", no rodapé. Veja como o Google usa dados em <a href="https://policies.google.com/technologies/partner-sites" rel="noopener">policies.google.com/technologies/partner-sites</a>.</p>`
    : '<h2>Anúncios</h2><p>Hoje este site não exibe anúncios. Se isso mudar, esta página será atualizada e pediremos o seu consentimento antes de carregar qualquer anúncio.</p>';
  const body = `
<p class="lede">Resumo: o planejador guarda suas escolhas no seu navegador. Só o recurso de grupo envia dados ao nosso servidor.</p>
<h2>O que fica no seu navegador</h2>
<p>As configurações, os planos salvos, o plano escolhido e o identificador anônimo do navegador ficam no armazenamento local (localStorage). Eles não saem do seu aparelho, exceto no recurso de grupo.</p>
<h2>Férias em grupo</h2>
<p>Se você criar ou entrar num grupo, enviamos ao servidor o apelido que você escolheu, as datas do plano que você escolheu e um identificador anônimo do seu navegador. Quem tem o código de 5 números do grupo vê o apelido e as datas. Grupos sem uso por 90 dias são apagados. Você pode sair do grupo a qualquer momento, o que remove seus dados da sala.</p>
<h2>Cidade e feriados</h2>
<p>Ao buscar uma cidade, o nome digitado é enviado ao nosso servidor para listar municípios e feriados. Não guardamos essa busca ligada a você.</p>
${ads}
<h2>Seus direitos (LGPD)</h2>
<p>Você pode pedir acesso, correção ou exclusão dos dados que tratamos (Lei 13.709/2018). ${contact}</p>`;
  return {
    path: paths.privacidade, updated,
    title: 'Política de privacidade | Planejador de Férias',
    description: 'Que dados o Planejador de Férias guarda, o que vai ao servidor no recurso de grupo, como funcionam os anúncios e como exercer seus direitos pela LGPD.',
    h1: 'Política de privacidade', body,
  };
}

export function sobrePage(updated: string): PageSpec {
  const body = `
<p class="lede">O Planejador de Férias é uma ferramenta gratuita que ajuda quem trabalha com carteira assinada a escolher as datas das férias, antes de conversar com o empregador.</p>
<h2>O que ele faz</h2>
<p>Ele testa todas as divisões de férias que a CLT permite (até 3 períodos, o menor com 5 dias ou mais e o maior com 14 dias ou mais) e mostra as que deixam mais dias seguidos sem trabalhar, emendando fins de semana e feriados. Você vê o resultado em dias fora do trabalho, compara os planos, escolhe um e leva a proposta para negociar.</p>
<h2>De onde vêm os dados</h2>
<ul>
<li><strong>Regras de férias:</strong> a CLT, no site do <a href="${CLT_URL}" rel="noopener">Planalto</a> (arts. 129 a 153).</li>
<li><strong>Feriados nacionais:</strong> calculados no próprio site, inclusive os móveis, como Sexta-feira Santa.</li>
<li><strong>Feriados estaduais:</strong> cadastrados a partir das leis estaduais. Alguns estados ainda estão sendo conferidos e ficam marcados como tal.</li>
<li><strong>Feriados municipais:</strong> vêm de uma base aberta (<a href="https://github.com/joaopbini/feriados-brasil" rel="noopener">feriados-brasil</a>, licença MIT) que cobre cerca de 3.800 municípios. Não é fonte oficial e pode estar incompleta ou desatualizada. Confirme com a prefeitura.</li>
</ul>
<h2>O que o site não é</h2>
<p>Não é aconselhamento jurídico nem financeiro e não calcula valores a receber. Quem define a época das férias é o empregador (CLT, art. 136): as sugestões são uma proposta para negociar.</p>
<h2>Privacidade</h2>
<p>Suas escolhas ficam no seu navegador. Só o recurso opcional de grupo envia um apelido e as datas do plano escolhido ao nosso servidor. Os detalhes estão na <a href="${paths.privacidade}">política de privacidade</a>.</p>
<h2>Quem mantém e como é financiado</h2>
<p>É um projeto independente, mantido por uma pessoa. O site é gratuito. Para cobrir os custos, ele pode exibir anúncios, sempre fora da ferramenta de planejamento e com a sua escolha de consentimento antes de qualquer anúncio.</p>
<p>Encontrou uma data errada ou tem uma sugestão? Veja como falar com a gente em <a href="${paths.contato}">Contato</a>.</p>
${cta('Montar minhas férias')}`;
  return {
    path: paths.sobre, updated,
    title: 'Sobre o Planejador de Férias: como funciona e de onde vêm os dados',
    description: 'O que é o Planejador de Férias, como ele escolhe as melhores datas pela CLT, de onde vêm os feriados e o que o site não faz.',
    h1: 'Sobre o Planejador de Férias', body,
    related: [{ href: paths.guia, label: 'Guia de férias pela CLT' }, { href: paths.privacidade, label: 'Política de privacidade' }],
  };
}

export function contatoPage(cfg: SiteConfig, updated: string): PageSpec {
  const mail = cfg.contactEmail
    ? `<a href="mailto:${esc(cfg.contactEmail)}">${esc(cfg.contactEmail)}</a>`
    : 'o e-mail de contato informado no site';
  const body = `
<p class="lede">Fale com a gente por e-mail: ${mail}.</p>
<h2>Quando escrever</h2>
<ul>
<li><strong>Feriado errado ou faltando:</strong> diga a cidade (ou o estado), a data e, se tiver, o link da lei ou do decreto. Os feriados municipais vêm de uma base aberta e podem ter falhas.</li>
<li><strong>Erro em algum texto ou cálculo:</strong> conte onde viu e o que esperava ver.</li>
<li><strong>Sugestão de melhoria:</strong> toda ideia é bem-vinda.</li>
<li><strong>Dados do recurso de grupo:</strong> para remover um apelido ou um grupo, informe o código de 5 números. Você também pode sair do grupo direto no planejador, o que apaga seus dados da sala.</li>
<li><strong>Direitos da LGPD:</strong> pedidos de acesso, correção ou exclusão de dados (veja a <a href="${paths.privacidade}">política de privacidade</a>).</li>
</ul>
<h2>O que não respondemos</h2>
<p>Não damos orientação jurídica sobre o seu caso. Para dúvidas sobre direitos e acordos de férias, procure o RH, o sindicato da sua categoria ou um advogado trabalhista.</p>`;
  return {
    path: paths.contato, updated,
    title: 'Contato | Planejador de Férias',
    description: 'Como falar com o Planejador de Férias: feriado errado, sugestões, remoção de dados do grupo e pedidos da LGPD.',
    h1: 'Contato', body,
    related: [{ href: paths.sobre, label: 'Sobre o Planejador de Férias' }, { href: paths.privacidade, label: 'Política de privacidade' }],
  };
}

export function notFoundPage(updated: string): PageSpec {
  return {
    path: '/404.html', updated, noindex: true,
    title: 'Página não encontrada | Planejador de Férias', description: 'A página que você procura não existe.',
    h1: 'Página não encontrada',
    body: `<p class="lede">Não achamos essa página. Que tal montar suas férias?</p>${cta()}<p><a href="${paths.guia}">Guia de férias pela CLT</a></p>`,
  };
}

export function allPages(cfg: SiteConfig, updated: string): PageSpec[] {
  const out: PageSpec[] = [guiaPage(cfg, updated), sobrePage(updated), contatoPage(cfg, updated), privacidadePage(cfg, updated)];
  for (const y of YEARS) {
    out.push(feriadosPage(cfg, y, updated), melhoresPage(cfg, y, updated));
    for (const uf of ALL_UFS) out.push(estadoPage(cfg, y, uf, updated));
  }
  return out;
}

export function sitemapXml(cfg: SiteConfig, pages: PageSpec[], updated: string) {
  const urls = [{ path: '/', updated }, ...pages.filter((p) => !p.noindex)];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${
    urls.map((u) => `<url><loc>${esc(abs(cfg, u.path))}</loc><lastmod>${u.updated}</lastmod></url>`).join('\n')}\n</urlset>\n`;
}

export const robotsTxt = (cfg: SiteConfig) => `User-agent: *\nAllow: /\n\nSitemap: ${abs(cfg, '/sitemap.xml')}\n`;

export const adsTxt = (cfg: SiteConfig) =>
  cfg.adsenseClient ? `google.com, ${cfg.adsenseClient.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n` : '';

