import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HowItWorks } from '../components/HowItWorks';
import { paths } from './paths';

/**
 * Texto da página inicial que já vem no HTML (antes do JavaScript): o app é uma SPA e, sem isto, quem lê só o HTML
 * (buscadores, revisão de anúncios) veria uma página quase vazia. O React troca este bloco ao montar o app.
 * "Como funciona" é o mesmo componente que o app mostra, para o texto ter uma fonte só.
 */
export function homeHtml(year: number) {
  const y = [2026, 2027, 2028].includes(year) ? year : 2027;
  return `<div class="home-static">
<h1>Planejador de Férias: as melhores datas para tirar férias pela CLT</h1>
<p>O Planejador de Férias é uma ferramenta gratuita para quem trabalha com carteira assinada e quer tirar férias com mais folga. Você informa o ano, o seu estado e a sua cidade, quantos dias de férias tem e os meses em que aceita descansar. Ele testa todas as divisões que a CLT permite e mostra os planos que deixam mais dias seguidos sem trabalhar, emendando fins de semana e feriados.</p>
<h2>Para quem é</h2>
<p>Para quem tem direito a 30 dias de férias e quer aproveitar bem cada feriado e cada fim de semana, para quem vai vender 10 dias e precisa encaixar 20, e para quem precisa chegar ao RH com datas concretas em vez de uma ideia solta. O planejador trata Carnaval e Corpus Christi como pontos facultativos, que só valem se a empresa conceder, e mostra feriados estaduais e municipais da cidade que você escolher.</p>
<h2>Como usar</h2>
<ol>
<li>Informe o ano, o estado, a cidade e quantos dias de férias você tem (30 ou 20, se vender 10 dias).</li>
<li>Veja os melhores planos: cada um mostra as datas de cada período e quantos dias você fica sem trabalhar.</li>
<li>Descarte os que não servem, escolha o seu plano e salve o ticket, copie o resumo ou adicione ao calendário.</li>
<li>Se quiser combinar com colegas ou família, crie um grupo e compare os planos escolhidos.</li>
</ol>
<p>Nada precisa de cadastro. Suas escolhas ficam no seu navegador; só o recurso de grupo envia um apelido e as datas do plano escolhido ao servidor.</p>
${renderToStaticMarkup(createElement(HowItWorks))}
<h2>Um exemplo prático</h2>
<p>Em um ano em que o Carnaval e a Sexta-feira Santa caem em fevereiro e março, e Tiradentes cai numa quarta-feira, um período de férias bem posicionado pode transformar poucos dias de férias em mais de uma semana inteira fora do trabalho. O planejador procura esses encaixes para você e mostra quantos dias de folga cada plano rende a mais do que os dias de férias usados. Em muitos anos, 30 dias de férias bem divididos chegam a mais de 40 dias seguidos sem trabalhar, porque os fins de semana e os feriados nas pontas dos períodos não gastam férias.</p>
<h2>Perguntas frequentes</h2>
<h3>Posso escolher a data das minhas férias?</h3>
<p>Quem define a época das férias é o empregador (CLT, art. 136), em geral dentro dos 12 meses seguintes ao período aquisitivo. As datas do planejador são uma proposta para você levar ao RH e negociar.</p>
<h3>Dá para dividir as férias?</h3>
<p>Sim, em até 3 períodos e com a sua concordância: um deles com pelo menos 14 dias corridos e os outros com pelo menos 5 dias corridos cada (art. 134, §1º). As férias também não podem começar nos 2 dias que antecedem feriado ou dia de repouso semanal (art. 134, §3º).</p>
<h3>Quantos dias posso vender?</h3>
<p>Até um terço das férias, ou seja, 10 dias, no abono pecuniário (art. 143). Nesse caso você descansa 20 dias, e o planejador calcula os melhores planos para essa conta.</p>
<h3>De onde vêm os feriados?</h3>
<p>Os nacionais são calculados no próprio site. Os estaduais vêm das leis estaduais e os municipais de uma base aberta, que pode estar incompleta: confirme sempre com a prefeitura. Veja os detalhes na página <a href="${paths.sobre}">Sobre</a>.</p>
<h2>Guias e consultas</h2>
<ul>
<li><a href="${paths.guia}">Guia de férias pela CLT</a>: dias de direito, aviso, pagamento e quem escolhe a data.</li>
<li><a href="${paths.dividir}">Como dividir as férias em até 3 períodos</a></li>
<li><a href="${paths.abono}">Abono pecuniário: vender 10 dias de férias</a></li>
<li><a href="${paths.aviso}">Aviso, pagamento e férias coletivas</a></li>
<li><a href="${paths.feriados(y)}">Feriados ${y}</a> e <a href="${paths.melhores(y)}">melhores datas para tirar férias em ${y}</a></li>
</ul>
</div>`;
}
