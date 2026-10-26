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

- Hoje: aplicação estática em React + TypeScript (Vite), sem backend e sem login. Configurações ficam no `localStorage`.
- Parâmetros: ano, estado, cidade, dias de férias (30, ou 20 vendendo 10), número de períodos, preferência por blocos grandes, Carnaval e Corpus Christi como pontos facultativos, datas-chave (quero folga, não posso tirar férias, folga extra), janela e meses permitidos, mínimos da CLT.
- Feriados municipais são demonstrativos (base de protótipo). Não afirmar precisão; o usuário confirma com a prefeitura e completa com datas-chave.
- Planejado, ainda não existe: backend com API de feriados e tabela própria de feriados municipais por código IBGE.
- Planejado, ainda não existe: simulação financeira (valores a receber, 1/3, abono). Hoje o app não calcula valores.
- Deploy via Dockerfile (build com Node, servido por busybox httpd), sem nginx.

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

Rótulos explícitos e estados sempre acompanhados de texto, não só de cor (verde e laranja são códigos semânticos, nunca o único indicador). Contraste suficiente nos dois temas, claro e escuro.
