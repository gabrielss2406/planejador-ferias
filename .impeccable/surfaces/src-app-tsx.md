---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Surface brief: app Planejador de Férias (src/App.tsx)

Modo: Operate. Redesign completo; só nome, slogan e logo ficam fixos (confirmado pelo usuário). Momento principal: comparar e escolher o plano.

## Audience, task, constraints
Trabalhador CLT que compara 3 a 6 divisões de férias e escolhe uma para negociar com o empregador. Toda a funcionalidade atual permanece (parâmetros, abas, seleção, copiar resumo, datas-chave, janela e meses, regras da CLT, tema claro e escuro, localStorage). Lógica em src/lib não muda. Estados nunca só por cor.

## Direction contract

THESIS: A folha de calendário de parede, com números de dia gigantes, é a tela do plano escolhido; cada período vira um cartão de embarque destacável por picote, e a lista de planos é um painel de partidas que reordena no lugar. Recusa o arranjo padrão: painel lateral de formulário com cartões brancos iguais.

OWN-WORLD: Casca grafite #101820 (e #1B2631), folha e cartões brancos, trilho de parâmetros cinza-claro #E6E9ED, azul #2563EB para férias, ação e seleção, âmbar #FFB000 reservado para feriado e para mudança (linha alterada, alerta). Figuras tabulares em JetBrains Mono, rótulos em Barlow Condensed em caixa alta com tracking. Cartão em segmentos rotulados (SAÍDA, RETORNO, DURAÇÃO, OPÇÃO, FOLGA CONTÍNUA) com bloco de barras como textura. Picote tracejado com recortes semicirculares. Reconhecível sem conteúdo: folha branca de grade grande sobre grafite, cartões segmentados e painel de colunas fixas.

STORY: O visitante entende de relance "45 dias fora do trabalho", vê o plano escolhido como folha do mês e como três cartões de embarque, compara a lista ordenada por dias fora e acredita que o resultado é uma proposta para negociar (aviso do art. 136 sempre visível). Age escolhendo um plano e copiando o resumo.

FIRST VIEWPORT: Desktop 1440x900, grade de 3 colunas e 3 linhas. Cabeçalho grafite com marca tipográfica e slogan sobre filete azul. Coluna esquerda 290px: trilho claro com Parâmetros (ano, estado, cidade, dias, presets 30 e 20, períodos). Centro: "45" em mono 78px com "dias fora do trabalho"; folha branca do período selecionado (grade do mês, férias em azul, folga cinza, feriado âmbar), picote, três cartões de embarque dos períodos. Coluna direita 410px: abas, tabela de planos (Plano, Fora, Per., Maior bloco) com linha selecionada e linha em âmbar para mudança, botão azul "Copiar resumo" na base. Rodapé: régua do ano jan-dez com férias, folga e feriados, e o aviso da CLT. Ação primária: Copiar resumo (azul, base da coluna direita). Referência: .impeccable/mocks/decision/folhinha-embarque.html.

FORM: Folhinha de Embarque, direção pedida pelo usuário em re-roll ousado 1 (híbrido da Folhinha de Parede, meu candidato nº 1, com os componentes e cores do challenger vernacular-ephemera-boarding-pass-and-gate-board). seed:5e0a0ee18b45de20. Assinatura: períodos como cartões destacáveis por picote; lista reordena no lugar e a linha alterada fica âmbar até ser notada.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
Logo real (src/assets/logo.png) entra no cabeçalho sobre placa clara; imagem de praia (hero.webp) deixa de ser usada no hero, decidir se some ou vira detalhe. Comportamento em tema claro: a casca grafite é o próprio tema do app; definir equivalente claro sem perder o contraste da folha.
