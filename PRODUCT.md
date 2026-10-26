# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Trabalhadores CLT no Brasil que planejam as próprias férias. Abrem o planejador antes de conversar com o empregador, para escolher datas de descanso e chegar com uma proposta. O trabalho é decidir quando tirar férias e como dividi-las.

## Product Purpose

Sugere os melhores períodos de férias emendando fins de semana e feriados, respeitando as regras da CLT (até 3 períodos, menor com 5 dias ou mais, maior com 14 dias ou mais). Sucesso é o usuário sair com um plano concreto, com mais dias fora do trabalho do que os dias de férias gastos, que ele possa negociar.

## Positioning

Testa todas as divisões permitidas pela CLT e mostra as que mais emendam feriados e fins de semana. Um calendário comum ou um app de férias que só registra datas não faz essa busca.

## Operating Context

Férias contam em dias corridos, então o ganho está nas pontas: começar logo depois de um fim de semana ou feriado e terminar logo antes de outro. Quem define a época das férias é o empregador (CLT, art. 136); as sugestões são uma proposta para negociar, não uma decisão.

## Capabilities and Constraints

- Hoje: React + TypeScript (Vite). O cálculo roda no navegador; configurações, planos salvos e o plano escolhido ficam no `localStorage`. Não há login.
- Férias em grupo: servidor próprio (Node + SQLite) com salas de 5 dígitos. Cada pessoa escolhe um plano e o grupo vê apelidos e datas dos planos escolhidos, com os dias em comum. Identidade anônima por navegador; quem tem o código vê os dados; até 20 pessoas; salas expiram após 90 dias sem uso.
- Parâmetros: ano, estado, cidade, dias de férias (30, ou 20 vendendo 10), número de períodos, preferência por blocos grandes, Carnaval e Corpus Christi como pontos facultativos, datas-chave (quero folga, não posso tirar férias, folga extra), janela e meses permitidos, mínimos da CLT.
- Feriados municipais vêm de base aberta, sem garantia de precisão (sem servidor, de uma lista curta demonstrativa). Não afirmar precisão; o usuário confirma com a prefeitura e completa com datas-chave.
- Feriados por cidade: API própria (`/api/municipios`, `/api/feriados`) sobre uma base aberta de feriados municipais por código IBGE, importada e versionada (cobre cerca de 3.800 dos 5.570 municípios; não é fonte oficial). O app avisa a cobertura de cada cidade e pede confirmação com a prefeitura. Estaduais ainda incompletos (GO, MG, MT sem registro).
- Planejado, ainda não existe: simulação financeira (valores a receber, 1/3, abono). Hoje o app não calcula valores.
- Deploy via Dockerfile (build com Node; o servidor Node serve o app e a API dos grupos, com volume para o SQLite), sem nginx.

## Brand Commitments

Nome: Planejador de Férias. Slogan: "Mais tempo para o que importa." Mensagem principal: "Planeje suas férias de forma simples e segura." Ativos: `logo.png`, `image.png` e o guia `Identidade_Visual_Planejador_de_Ferias.pdf` na raiz. Tom de voz do guia: português claro, frases curtas, linguagem humana; explicar termos da CLT quando necessário, sem prometer precisão jurídica ou financeira absoluta.

## Evidence on Hand

Regras da CLT e feriados nacionais/estaduais codificados em `src/lib`. Não há depoimentos, clientes, métricas de uso ou preços; não inventar.

## Product Principles

- Dizer quanto de folga o plano rende, em dias, antes de qualquer detalhe.
- Tratar a sugestão como proposta para negociar, nunca como direito garantido.
- Mostrar o que é incerto (feriados municipais, pontos facultativos) em vez de esconder.
- Explicar termos da CLT em linguagem simples quando aparecerem.
- Manter tudo local e imediato: o resultado recalcula na hora que o usuário muda um parâmetro.

## Accessibility & Inclusion

Rótulos explícitos e estados sempre acompanhados de texto, não só de cor (verde e laranja são códigos semânticos, nunca o único indicador). A interface usa uma única casca grafite nos dois esquemas de cor, decisão deliberada e fechada do redesign; não há tema claro planejado. Folha e cartões brancos mantêm contraste >= 4.5:1 sobre ela.
