---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Surface brief: app Planejador de Férias (src/App.tsx)

Modo: Operate. Redesign completo; só nome, slogan e logo ficam fixos (confirmado pelo usuário). Momento principal: comparar e escolher o plano.

## Audience, task, constraints
Trabalhador CLT que compara 3 a 6 divisões de férias e escolhe uma para negociar com o empregador. Toda a funcionalidade atual permanece (parâmetros, abas, seleção, copiar resumo, datas-chave, janela e meses, regras da CLT, localStorage, exportar PDF e calendário, planos salvos). Lógica em src/lib não muda. Estados nunca só por cor.

## Direction contract

THESIS: Uma pergunta, uma resposta: a folha de calendário de parede responde em números grandes e o picote separa o resultado dos períodos; tudo o que não é a resposta recua para "Mais opções" e para baixo da dobra. Recusa o painel lateral de formulário com cartões iguais e a repetição da mesma informação em vários lugares.


OWN-WORLD: Casca grafite #101820 (e #1B2631), folha e cartões brancos, trilho de parâmetros cinza-claro #E6E9ED, azul #2563EB para férias, ação e seleção, âmbar #FFB000 reservado para feriado e para mudança (linha alterada, alerta). Figuras tabulares em JetBrains Mono, rótulos em Barlow Condensed em caixa alta com tracking. Cartão em segmentos rotulados (SAÍDA, RETORNO, DURAÇÃO, OPÇÃO, FOLGA CONTÍNUA) com bloco de barras como textura. Picote tracejado com recortes semicirculares. Reconhecível sem conteúdo: folha branca de grade grande sobre grafite, cartões segmentados e painel de colunas fixas.

STORY: O visitante entende de relance "45 dias fora do trabalho", vê o plano escolhido como folha do mês e como três cartões de embarque, compara a lista ordenada por dias fora e acredita que o resultado é uma proposta para negociar (aviso do art. 136 sempre visível). Age escolhendo um plano e copiando o resumo.

FIRST VIEWPORT: Desktop 1440x900, coluna única de ~840px sobre casca grafite, lida de cima para baixo: barra de parâmetros mínima (cidade e estado, dias de férias 30 ou 20, períodos até 1/2/3); "Seu ano de relance" logo abaixo da busca; folha branca com o número gigante "45 dias fora do trabalho" e a frase-resumo, picote tracejado e "Tire férias nestas datas" com os períodos em linhas simples; "Escolha um plano" com os 3 melhores em cartões ("Melhor opção" no primeiro) e "Ver mais planos"; ações do plano: Copiar resumo (primário azul), Salvar PDF, Adicionar ao calendário (.ics) e Salvar plano, com o aviso do art. 136; "Planos salvos" quando houver; "Mais opções" é um botão FIXO flutuante na base da tela que abre uma gaveta modal. Sem rail lateral, sem tabela, sem calendário grande no primeiro viewport.


FORM: Folhinha de Embarque, direção pedida pelo usuário em re-roll ousado 1 (híbrido da Folhinha de Parede, meu candidato nº 1, com os componentes e cores do challenger vernacular-ephemera-boarding-pass-and-gate-board). seed:5e0a0ee18b45de20. Assinatura: períodos como cartões destacáveis por picote; lista reordena no lugar e a linha alterada fica âmbar até ser notada.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
Tema único grafite, decisão fechada (sem tema claro). Logo real (src/assets/logo.png) no cabeçalho sobre placa clara; hero.webp não é mais usado.
