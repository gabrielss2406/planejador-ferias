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
