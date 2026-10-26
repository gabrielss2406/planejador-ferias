---
name: Planejador de Férias
description: Uma pergunta, uma resposta: folha branca com número gigante e picote sobre uma casca grafite, em coluna única, com opções numa gaveta e plano que sai em PDF, calendário ou resumo.
colors:
  grafite: "#101820"
  grafite-2: "#1B2631"
  grafite-3: "#26323F"
  papel: "#FFFFFF"
  trilho: "#E6E9ED"
  tinta: "#101820"
  tinta-2: "#4B5866"
  sobre-grafite: "#9FB0C0"
  controle: "#6F7C89"
  divisor: "#C5CBD3"
  divisor-escuro: "#3A4856"
  picote: "#7D8B99"
  folga: "#AEB7C2"
  azul: "#2563EB"
  azul-escuro: "#1D4ED8"
  azul-claro: "#EFF4FF"
  ambar: "#FFB000"
  ambar-claro: "#FFF3D1"
  ok: "#047857"
  erro: "#B42318"
typography:
  answer-number:
    fontFamily: "JetBrains Mono, DejaVu Sans Mono, ui-monospace, monospace"
    fontSize: "80px"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  answer-unit:
    fontFamily: "Barlow Condensed, Arial Narrow, Liberation Sans Narrow, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.1
  answer-unit-mobile:
    fontFamily: "Barlow Condensed, Arial Narrow, Liberation Sans Narrow, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.1
  plan-figure:
    fontFamily: "JetBrains Mono, DejaVu Sans Mono, ui-monospace, monospace"
    fontSize: "28px"
    fontWeight: 800
  section-title:
    fontFamily: "Barlow Condensed, Arial Narrow, Liberation Sans Narrow, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "0.01em"
  period-title:
    fontFamily: "Barlow Condensed, Arial Narrow, Liberation Sans Narrow, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.2
  action:
    fontFamily: "Barlow Condensed, Arial Narrow, Liberation Sans Narrow, sans-serif"
    fontSize: "21px"
    fontWeight: 700
  button-label:
    fontFamily: "Barlow Condensed, Arial Narrow, Liberation Sans Narrow, sans-serif"
    fontSize: "18px"
    fontWeight: 700
  card-title:
    fontFamily: "Barlow Condensed, Arial Narrow, Liberation Sans Narrow, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.2
  sentence:
    fontFamily: "Barlow Condensed, Arial Narrow, Liberation Sans Narrow, sans-serif"
    fontSize: "19px"
    fontWeight: 500
    lineHeight: 1.35
  value:
    fontFamily: "JetBrains Mono, DejaVu Sans Mono, ui-monospace, monospace"
    fontSize: "18px"
    fontWeight: 700
  control:
    fontFamily: "Barlow Condensed, Arial Narrow, Liberation Sans Narrow, sans-serif"
    fontSize: "17px"
    fontWeight: 600
  body:
    fontFamily: "Barlow Condensed, Arial Narrow, Liberation Sans Narrow, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.35
  field-compact:
    fontFamily: "JetBrains Mono, DejaVu Sans Mono, ui-monospace, monospace"
    fontSize: "15px"
    fontWeight: 500
  label:
    fontFamily: "Barlow Condensed, Arial Narrow, Liberation Sans Narrow, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.3
  day-tag:
    fontFamily: "Barlow Condensed, Arial Narrow, Liberation Sans Narrow, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    letterSpacing: "0.04em"
rounded:
  hairline: "1px"
  xs: "2px"
  cell: "3px"
  sm: "4px"
  md: "6px"
  lg: "8px"
  full: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  page-bottom: "96px"
components:
  button-primary:
    backgroundColor: "{colors.azul}"
    textColor: "{colors.papel}"
    typography: "{typography.action}"
    rounded: "{rounded.sm}"
    padding: "0 32px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.azul-escuro}"
  button-segment:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    typography: "{typography.control}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "44px"
  button-segment-pressed:
    backgroundColor: "{colors.azul}"
    textColor: "{colors.papel}"
  field:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.sm}"
    padding: "0 10px"
    height: "44px"
  params-bar:
    backgroundColor: "{colors.trilho}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.lg}"
    padding: "14px 16px"
  button-floating:
    backgroundColor: "{colors.azul}"
    textColor: "{colors.papel}"
    typography: "{typography.button-label}"
    rounded: "{rounded.lg}"
    padding: "0 24px"
    height: "48px"
  button-floating-hover:
    backgroundColor: "{colors.azul-escuro}"
  button-secondary:
    backgroundColor: "{colors.grafite}"
    textColor: "{colors.papel}"
    typography: "{typography.button-label}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "52px"
  button-secondary-pressed:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
  button-mini:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    typography: "{typography.control}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "44px"
  drawer:
    backgroundColor: "{colors.trilho}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.lg}"
    padding: "4px 16px 16px"
    width: "840px"
  saved-item:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
  answer-sheet:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.lg}"
    padding: "18px 24px 16px"
  period-row:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    padding: "9px 24px"
    height: "44px"
  period-row-active:
    backgroundColor: "{colors.azul-claro}"
  plan-card:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
    height: "84px"
  plan-card-selected:
    backgroundColor: "{colors.azul-claro}"
  badge:
    backgroundColor: "{colors.grafite}"
    textColor: "{colors.papel}"
    typography: "{typography.label}"
    rounded: "{rounded.cell}"
    padding: "0 6px"
  change-chip:
    backgroundColor: "{colors.ambar}"
    textColor: "{colors.tinta}"
    typography: "{typography.label}"
    rounded: "{rounded.cell}"
    padding: "0 6px"
  year-ruler-track:
    backgroundColor: "{colors.grafite-3}"
    rounded: "{rounded.cell}"
    height: "28px"
  month-sheet:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.lg}"
    padding: "10px 18px 12px"
---

# Design System: Planejador de Férias

## Overview

**Creative North Star: "A Folhinha de Embarque"**

Uma pergunta, uma resposta. Uma folha de calendário de parede, branca, pendurada numa casca grafite, responde com um número gigante ("45 dias fora do trabalho") e um picote tracejado a separa dos períodos de férias. Tudo o que não é a resposta recua: os parâmetros cabem numa barra mínima acima dela, o resto mora numa gaveta aberta por um botão fixo "Mais opções" e abaixo da dobra. É um refinamento do redesign anterior, mesma identidade, menos peças: sem rail lateral, sem coluna de planos, sem tabela, sem cartões com código de barras.

O sistema é de tema único grafite, decisão fechada do usuário: não existe tema claro e nenhum deve ser inventado. Nome, slogan e logo (placa clara no cabeçalho) também são fixos. Papel branco é o que se lê e se compara; trilho cinza-claro é tudo que se preenche; o resto é grafite. Cor tem função: azul para férias, ação e seleção; âmbar só para feriado e mudança. Estado nunca é só cor.

O movimento é um sistema pequeno e explicativo, não decoração: existe para dar feedback (o toque foi recebido), mostrar estado (o que mudou, o que ficou selecionado) e manter continuidade (o número, a régua e os cartões mudam de lugar em vez de piscar). Nada se move sem motivo de estado; ver "Motion system" em Components.

**Key Characteristics:**
- Coluna única de 840px, lida de cima para baixo, resposta antes de qualquer opção.
- Número gigante em mono (80px; 68px no celular) como voz principal; palavras em Barlow Condensed.
- Picote tracejado com recortes semicirculares como assinatura estrutural, usado uma vez na folha de resposta.
- Plano: uma única sombra de folha, bordas de 1px (2px no botão flutuante) e troca de superfície para o resto.
- Alvos de toque de 44px em todo controle.
- Uma ação por vez no plano: Copiar resumo em azul, as demais em contorno; o plano sai como resumo, PDF ou arquivo de calendário.
- "Mais opções" é um botão fixo na base da tela que abre uma gaveta modal; nada de opções na página.
- Movimento só explica estado: duas curvas e uma escala de durações em variáveis (`--ease-*`, `--dur-*`), lidas também pelo JS; com menos movimento pedido, só cor e opacidade em ~80ms.

## Colors

Grafite e papel como par de superfícies, um azul funcional e um âmbar de aviso, sem terceira cor de acento.

### Primary
- **Azul Embarque** (`azul`): dias de férias, botão primário, botão flutuante "Mais opções", segmento pressionado, plano e período selecionados, faixa de encadernação, filete de 2px do cabeçalho, foco, accent de slider e caixas.
- **Azul Profundo** (`azul-escuro`): hover do botão primário.
- **Azul Névoa** (`azul-claro`): fundo do plano e do período selecionados.

### Secondary
- **Âmbar de Aviso** (`ambar`): feriado e mudança apenas (dia de feriado, marca de feriado na régua, chip de mudança do plano). **Âmbar Pálido** (`ambar-claro`) é o fundo do estado vazio, que avisa que nada foi encontrado.

### Neutral
- **Grafite** (`grafite`), **Grafite Elevado** (`grafite-2`), **Grafite Trilho** (`grafite-3`): casca e recortes do picote; `grafite-3` é a pista da régua do ano. `grafite-2` é mantido na paleta, mas hoje não pinta nenhuma superfície do CSS.
- **Papel** (`papel`) e **Trilho Claro** (`trilho`): folha, cartões e campos; trilho da barra de parâmetros, da gaveta "Mais opções" e dos dias de folga.
- **Tinta** (`tinta`) e **Tinta Secundária** (`tinta-2`): texto sobre papel. **Névoa sobre Grafite** (`sobre-grafite`): texto secundário sobre grafite e contorno dos botões secundários sobre a casca.
- **Contorno de Controle** (`controle`; também o contorno dos mini botões), **Divisor** (`divisor`), **Divisor Escuro** (`divisor-escuro`), **Picote** (`picote`), **Folga** (`folga`): bordas de campos, filetes, tracejado do picote e barras de folga na régua.
- **Verde Regra** (`ok`) e **Vermelho Regra** (`erro`): estado das datas-chave, sempre com ícone e texto.

### Named Rules
**The Amber Is Change Rule.** Âmbar significa feriado ou mudança, nada mais. Não decora, não marca seleção.
**The Blue Is Vacation Rule.** Azul marca o que o usuário tira, aciona ou escolheu; não vira cor de fundo de seção.
**The Not-By-Color Rule.** Todo estado tem segundo canal: texto, ícone de traço, ponto-chave, risco no dia indisponível, barra inferior no feriado, contorno branco no período ativo da régua.

## Typography

**Figures / Value Font:** JetBrains Mono (500, 700, 800; fallback DejaVu Sans Mono), self-hosted via @fontsource.
**Words / Label Font:** Barlow Condensed (500, 600, 700; fallback Arial Narrow), self-hosted via @fontsource.

**Character:** Mono tabular para todo número que se compara; condensada para a linguagem de sinalização e para as frases. Duas famílias, papéis nunca trocados.

### Hierarchy
O CSS declara uma escala de seis variáveis (`--t-num` 80px, `--t-tit` 24px, `--t-val` 18px, `--t-corpo` 16px, `--t-rot` 14px, mais `--t-sec` 30px, hoje sem uso); os demais tamanhos são degraus literais reaproveitados, registrados abaixo como parte do sistema.
- **Answer number** (mono 800, 80px, 0.95; 68px no celular): total de dias fora do trabalho. **Answer unit** (cond 700, 32px; 26px no celular): "dias fora do trabalho".
- **Plan figure** (mono 800, 28px): dias fora em cada cartão de plano.
- **Section title** (cond 700, 24px, 1.15; 22px no celular, sem caixa alta): títulos de seção, "Mais opções", "Seu ano de relance", "Escolha um plano". **Period title** (cond 700, 22px): "1º período" e nome do mês na folha do ano.
- **Action** (cond 700, 21px): "Copiar resumo". **Button label** (cond 700, 18px): botão flutuante, botões secundários do plano e "Adicionar" na gaveta. **Card title** (cond 700, 20px): nome do plano, nome do mês, subtítulos do painel.
- **Sentence** (cond 500, 19px, 1.35; 18px no celular, máx. 70ch): frase-resumo sob o número.
- **Value** (mono 700, 18px): datas dos períodos. **Control** (cond 600-700, 17-18px): texto de segmento, mini botão, "Fechar" da gaveta, link "Ver mais planos", texto de apoio e linhas de lista.
- **Body** (cond 500, 16px, 1.35): texto corrido, legendas, campo em mono 16px. **Field compact** (mono 500, 15px): campo de data, filtro de planos, sigla do feriado na lista; também o slogan no celular.
- **Label** (cond 600, 14px): rótulos de campo, dicas, selo, chip de mudança, dias da semana, meses da régua (esses em caixa alta com 0.04em). **Day tag** (cond 600, 13px): sigla de feriado dentro do dia da folha.

### Named Rules
**The Figures Are Mono Rule.** Datas, dias e contagens usam JetBrains Mono tabular; palavras usam Barlow Condensed.
**The Floor Is 14px Rule.** O menor texto é o rótulo de 14px; a única exceção construída é a sigla de 13px dentro do dia da folha.
**The Step Is Documented Rule.** Todo tamanho novo entra na lista acima ou usa um degrau existente; 15 e 17px são degraus reais (campo compacto e controle), não desvios.

## Layout

Uma coluna central de até 840px (`min(100%, 840px)`) sobre a casca, com padding lateral de 24px (16px no celular), 96px de respiro final (mais a área segura do aparelho, para o botão flutuante não cobrir o último bloco) e 22px entre blocos (24px no celular). Ordem fixa: cabeçalho de 64px com filete azul de 2px, barra de parâmetros, folha de resposta (número, picote, períodos), "Escolha um plano" com três cartões e a área de ações, régua "Seu ano de relance", "Planos salvos" (só quando há algum), calendário do ano recolhido, "Como funciona" e feriados. "Mais opções" não ocupa lugar na coluna: é o botão fixo, centrado na base da tela a 16px da borda (ou da área segura).

A barra de parâmetros quebra em linha: cidade e UF (flex 2), dias, períodos. Cartões de plano em grade auto-fit de 230px, 10px de vão; planos salvos em grade auto-fit de 340px (uma coluna no celular), 10px de vão. Área de ações: Copiar resumo e os botões secundários em linha de 10px de vão, cada um em linha própria no celular. Calendário anual em 4 colunas, 2 no celular. Ritmo: 4, 6, 8, 10, 12, 14, 16, 18 e 24px. Ponto de quebra único: 640px (celular), mais 420px para segmentos de dias que esticam. Alvo mínimo de toque 44px.

## Elevation & Depth

Plano por padrão. Profundidade vem da troca de superfície (grafite, papel, trilho), de filetes de 1px e do picote. A única sombra é a das folhas (resposta e mês), que as descola da casca; não há sombras de hover. O botão flutuante e a gaveta não projetam sombra: o botão se separa do conteúdo que rola por baixo com borda de 2px em grafite, e a gaveta com o véu grafite a 72% (`::backdrop`) e o filete de 1px do cabeçalho.

### Shadow Vocabulary
- **Sheet lift** (`box-shadow: 0 8px 14px -8px rgb(0 0 0 / .55)`): folha de resposta e folha do mês.
- **Holiday underline** (`inset 0 -5px 0 #FFB000`): feriado sobre dia de férias; é marca, não elevação.

### Named Rules
**The One Lift Rule.** Só as folhas projetam sombra. Cartões de plano, linhas e campos se distinguem por borda, fundo e cor.
**The Ring, Not Shadow Rule.** O que flutua sobre a folha (botão "Mais opções") ganha anel de borda de 2px na cor da casca, nunca sombra; a gaveta ganha véu, nunca sombra.

## Shapes

Cantos pequenos e práticos, em degraus reais do CSS: 8px nas folhas, painéis, na barra de parâmetros e no botão flutuante "Mais opções" (`lg`: a pílula é de canto de 8px, não totalmente arredondada; também os cantos superiores da gaveta, 8px 8px 0 0; as folhas do calendário só nos cantos superiores, 8px 8px 0 0, como folha pendurada); 6px em cartões de plano, itens de plano salvo e na placa do logo (`md`); 4px em controles, botões secundários e mini botões (`sm`); 3px em dias de calendário, selos, chip de mudança e pista da régua (`cell`, usado em seis lugares, degrau legítimo); 2px em quadradinhos de legenda (`xs`); 1px apenas na marca de feriado da régua (`hairline`, acidental por natureza: é a ponta de uma barra de 3px e não deve ser herdado por componente novo); 50% em pontos e nos recortes do picote.

Silhueta recorrente: o picote, tracejado de 3px com recortes semicirculares de 22px na cor da casca nas bordas da folha de resposta; faixa de encadernação azul de 8px com furos redondos no topo da folha do mês.

## Components

### Buttons
- **Primary** (`button-primary`): "Copiar resumo", azul, texto branco, 52px, 4px, 21px/700, hover em `azul-escuro`; ao copiar, o rótulo vira "Copiado" por 1,8s com fundo `ok` (`data-done`), ícone de marca que entra com escala de .8 a 1 em 150ms e sem hover de azul enquanto dura. No celular ocupa a largura toda. Botão "Adicionar" na gaveta: 44px, 18px/700.
- **Secondary** (`button-secondary`): "Salvar PDF", "Adicionar ao calendário (.ics)" e "Salvar plano", sobre a casca. Sem fundo, contorno de 1px em `sobre-grafite`, texto branco, 52px, 4px, 20px de padding lateral, 18px/700, ícone de traço de 16px à esquerda com 8px de vão; hover em `grafite-3`. Linha própria sob o primário (10px de vão), uma por linha no celular. "Salvar plano" alterna com `aria-pressed`: pressionado vira branco com texto tinta, o ícone de marcador preenchido e o rótulo "Plano salvo" (estado por texto, ícone e cor). Desabilitado a 60% de opacidade quando há 12 planos salvos, com aviso em texto ligado por `aria-describedby`.
- **Floating** (`button-floating`): "Mais opções", fixo, centrado na base (16px da borda ou da área segura, z-index 10), azul, texto branco, 48px, 24px de padding lateral, raio `lg` de 8px, borda de 2px em `grafite`, sem sombra, 18px/700, ícone de ajustes de 16px; hover em `azul-escuro`. `aria-haspopup="dialog"` e `aria-expanded` acompanham a gaveta.
- **Mini** (`button-mini`): botões do item salvo ("Copiar", "PDF", "Calendário", "Remover") e "Fechar" da gaveta: branco, contorno de 1px (`controle`), 44px, 4px, 12-14px de padding lateral, 17px/600, hover em `trilho`. Os rótulos curtos levam texto só para leitor de tela com o nome do plano.
- **Segment / chip** (`button-segment`): branco com contorno de 1px (`controle`), 44px, 17px/600; pressionado vira azul preenchido. Meses em grade de 4. Períodos usam rádio escondido sob o segmento ("até 1/2/3").
- **Link** : "Ver mais planos", texto branco sublinhado (4px de recuo, traço em `picote`), 44px de alvo.

### Fields
Branco, contorno 1px (`controle`), 4px, 44px, valor em mono 16px (15px em data); placeholder em condensada 17px. Foco: contorno azul de 2px com recuo de 2px.

### Params bar
Faixa trilho de 8px, 14px/16px de padding, rótulos de 14px/600 em `tinta-2`, dica de cidade abaixo. Três perguntas: cidade e UF, dias (30 ou "20, vendendo 10"), períodos (até 1, 2, 3).

### Answer sheet (folha de resposta)
Folha branca de 8px com sombra. No topo o número de 80px com a unidade e a frase de 19px; picote tracejado; abaixo, "Tire férias nestas datas" com linhas de período de 44px+, divididas por filetes de 1px. Período ativo: fundo `azul-claro` e contorno interno azul de 2px; clicar o destaca na régua. Entra com 220ms (deslize de 8px, opacidade de .35 a 1); ao trocar de plano, o número troca em 300ms e as linhas de período entram em sequência (ver Motion system). Estado vazio é um bloco de `ambar-claro`.

### Plan cards
Cartão branco de 6px, 84px mínimo, borda de 2px transparente; selecionado ganha `azul-claro`, borda azul e ícone de marca. Nome (20px), figura de dias fora (28px mono), contagem de períodos. **Selo** "Melhor opção" em grafite, 3px, só no primeiro. **Chip de mudança**: âmbar, texto tinta, ícone de seta e "+2 dias", "−1 dia" ou "novo"; acende em 400ms e a lista reordena no lugar por deslize (FLIP) de 360ms; o plano que passa a selecionado ganha o ícone de marca com entrada de 150ms.

### Year ruler ("Seu ano de relance")
Sem fundo próprio, direto sobre a casca: meses em caixa alta 14px, pista `grafite-3` de 28px, folga em `folga` (altura total), férias azuis de 16px, feriados em âmbar de 3px; período ativo ganha contorno branco de 2px. As marcas de folga e férias transitam `left` e `width` em 300ms (`--dur-num`), então a régua desliza de um plano ao outro em vez de saltar. Legenda de 16px abaixo.

### Month sheet and calendar
Folha branca com faixa azul de 8px e furos; dias em grade de 7: férias azul/branco, folga `trilho`, feriado âmbar com sigla, dia-chave com ponto de tinta no canto, dia indisponível `divisor` riscado. O calendário do ano usa os mesmos códigos em meses de 4 colunas.

### Actions (área de ações do plano)
Abaixo dos cartões, 16px de margem: Copiar resumo (azul) e, em linha própria, Salvar PDF, Adicionar ao calendário (.ics) e Salvar plano (botões secundários). Depois o aviso do art. 136 em 16px, `sobre-grafite`, até 70ch (e, se o limite de 12 for atingido, o aviso de lista cheia). Salvar PDF abre a impressão do navegador (ver Print sheet); o calendário baixa `ferias-AAAA.ics`.

### Saved plans ("Planos salvos")
Bloco recolhível sob as ações, aberto por padrão no desktop e fechado no celular, com título de 24px, filete de `divisor-escuro` e seta que gira. Mostra só quando há planos. Cada item (`saved-item`) é um cartão branco de 6px, 10px/14px de padding, sem borda nem sombra: figura de dias fora em mono 800 28px com "dias fora do trabalho" em 18px, ano em mono 14px à direita, uma linha por período em 16px `tinta-2` com a duração em mono 14px, e a linha de mini botões (6px de vão). É um retrato de datas e dias guardado no navegador (localStorage), mais novo primeiro, no máximo 12. Item salvo depois da primeira carga entra em 220ms (sobe 6px com opacidade); Remover esmaece o item em 120ms e só então o tira da lista, levando o foco ao título da lista, ou ao plano selecionado se a lista esvaziou. Os itens da primeira carga não animam.

### Drawer ("Mais opções")
Gaveta modal em `<dialog>` aberta com `showModal()`: base da tela, largura de até 840px, até 85% da altura, fundo `trilho`, cantos superiores de 8px, rolagem interna sem encadeamento. Véu `grafite` a 72%; o fundo da página não rola. Cabeçalho fixo de `trilho` com filete de 1px (`divisor`), título de 24px e botão "Fechar" (mini com ícone de cruz); corpo com 16px de padding, seções recolhíveis separadas por filete de 1px. Fecha com Esc, com o botão ou clicando no véu (todos passam pela mesma saída de 160ms, que desce 32px e esmaece o véu; sem animação suportada, fecha direto), e devolve o foco ao botão flutuante; o título nomeia o diálogo por `aria-labelledby`. Entra por deslize de 32px em 280ms e sai em 160ms (ver Motion system).

### Motion system
Tese: movimento é feedback (o toque chegou), estado (o que mudou) e continuidade (de onde veio). Se um movimento não explica uma dessas três coisas, ele não existe. Os tokens vivem em `:root` em `src/styles.css` e o JS (`src/components/motion.ts`) lê os mesmos valores, então há uma fonte só.

- **Easings.** `--ease-out` `cubic-bezier(.16,1,.3,1)`: entradas e deslocamentos (número, régua, linhas, gaveta, chip). `--ease-std` `cubic-bezier(.22,1,.36,1)`: trocas de estado, pressionar e saídas. Sem overshoot nem bounce.
- **Durações.** `--dur-press` 80ms (pressionar); `--dur-fb` 120ms (feedback, esmaecer opacidade); `--dur-state` 150ms (hover, seleção, seta, ícone de marca); `--dur-enter` 220ms (folha, linhas de período, item salvo, abrir seção); `--dur-num` 300ms (número da resposta e marcas da régua); `--dur-drawer` 280ms (entrada da gaveta); `--dur-drawer-out` 160ms (saída da gaveta); `--dur-exit` 120ms (saída de item).
- **Reduced motion.** Em `prefers-reduced-motion: reduce` as durações encolhem (`--dur-press` 60ms; `--dur-fb`, `--dur-state`, `--dur-enter` e `--dur-exit` 80ms) e ficam só cor e opacidade: sem deslocamento, escala, stagger, FLIP, deslize da gaveta (só o véu esmaece em `--dur-fb`) nem contagem do número (ele troca com opacidade de .4 a 1 em 80ms). Deslocamento, escala e altura só existem dentro de `no-preference`.
- **Hover só com mouse.** Todo hover mora em `@media (hover:hover) and (pointer:fine)`; no toque não há efeito grudado. `:active` vale em todo dispositivo.
- **Pressionar.** `:active` troca a cor de fundo e, em `no-preference`, desce 1px (`translateY(1px)`; o botão flutuante, `translateX(-50%) translateY(1px)`), sem sombra e sem escala.
- **Foco.** Anel de 2px azul aparece instantaneamente; nenhuma transição no foco.
- **Número da resposta** (`AnswerNumber`): ao mudar o valor, o novo número entra em 300ms deslizando .28em de baixo (aumentou) ou de cima (diminuiu); nunca na primeira carga.
- **Períodos** (`Periods`): ao trocar de plano, as linhas entram em 220ms com stagger de 40ms por linha e teto de 160ms de atraso; não rodam em re-render sem troca.
- **Reordenação dos planos** (`PlanBoard`): FLIP com Web Animations, 360ms, só na mesma lista e fora de reduced motion.
- **Abrir e fechar seções** (`details`): `::details-content` com `interpolate-size: allow-keywords` e `content-visibility` com `allow-discrete` animam altura e opacidade em 220ms; sem suporte a `::details-content`, abre e fecha direto e o conteúdo nunca fica escondido.
- **Interrupção.** Toda animação por JS cancela as anteriores (`getAnimations().cancel()`) antes de começar e é protegida por `canAnimate`; a saída da gaveta tem rede de segurança de 400ms e Esc, Fechar e véu passam pelo mesmo caminho; o foco volta ao botão ao fechar.

### Named Rules (movimento)
**The Motion Explains State Rule.** Movimento só explica estado, feedback ou continuidade; nunca decora.
**The No Bounce Rule.** Sem overshoot, mola ou bounce; as duas curvas terminam suaves.
**The No Lift Rule.** Cartões e botões não sobem no hover nem projetam sombra; pressionar desce 1px.
**The Always Cancelable Rule.** Toda animação pode ser interrompida e nunca deixa estado preso.
**The Mouse-Only Hover Rule.** Hover só com mouse; o toque tem `:active`.

### Print sheet (PDF)
Folha de impressão fora da tela (`display:none`), só visível em `@media print` com `@page` A4 e margem de 18mm; esconde tudo o mais, inclusive botão flutuante e gaveta. Papel branco, texto tinta, cores exatas: logo de 48px, ano em 24px `tinta-2`, número em mono 800 80px com "dias fora do trabalho" em 32px, frase de 19px, lista de períodos sob um picote tracejado de 3px (sem recortes), cada um com título de 22px, datas em mono 18px e "Sem trabalhar de..." em 16px, sem quebra no meio do item, o aviso do art. 136 e a data de geração em 14px. Sem sombras, sem azul de interface; fica fora da árvore de acessibilidade (`aria-hidden`).

## Do's and Don'ts

### Do:
- **Do** manter tema único grafite; folhas, cartões e linhas de período em papel branco, campos em trilho.
- **Do** colocar a resposta (número e picote) antes de qualquer opção, em coluna única.
- **Do** usar azul só para férias, ação e seleção; âmbar só para feriado e mudança.
- **Do** compor números em JetBrains Mono tabular e palavras em Barlow Condensed.
- **Do** dar a todo estado um segundo canal (texto, ícone, ponto, risco, barra, contorno).
- **Do** manter alvos de 44px (52px nos botões de ação do plano, 48px no flutuante) e foco visível de 2px azul.
- **Do** manter um único primário azul por área de ações; as demais ações do plano são secundárias em contorno.
- **Do** abrir opções adicionais na gaveta modal com foco devolvido ao botão que a abriu, `aria-haspopup`/`aria-expanded` no botão e título ligado por `aria-labelledby`.
- **Do** tirar durações e easings dos tokens `--dur-*` e `--ease-*` (no JS, via `motion.ts`); cor e opacidade de estado valem sempre, mais curtas em reduced motion.
- **Do** manter deslocamento, escala, stagger, FLIP e altura animada só dentro de `prefers-reduced-motion: no-preference`.
- **Do** restringir hover a `(hover:hover) and (pointer:fine)` e dar `:active` de 1px sem sombra; foco aparece instantâneo.
- **Do** cancelar a animação anterior antes de iniciar outra e dar saída curta (120-160ms) ao que sai.
- **Do** reutilizar os degraus documentados de tamanho (13 a 32px, 68/80px) e de raio (1, 2, 3, 4, 6, 8px, 50%); a pílula flutuante usa o raio `lg` de 8px.

### Don't:
- **Don't** criar tema claro ou variante de casca; a decisão de tema único é do usuário.
- **Don't** trocar nome, slogan ou logo.
- **Don't** usar âmbar como decoração ou seleção, nem azul como fundo de seção.
- **Don't** dar sombra ao botão flutuante, à gaveta ou aos botões; o botão flutuante se separa por borda de 2px.
- **Don't** colocar "Mais opções" de volta como painel na coluna, nem criar um segundo botão flutuante.
- **Don't** adicionar sombras além das folhas, nem reintroduzir rail lateral, tabela de planos, cartões com código de barras ou a imagem de praia do hero.
- **Don't** animar sem que o movimento explique estado, feedback ou continuidade; sem bounce, sem lift em cartões ou botões, sem animação decorativa.
- **Don't** usar outras famílias tipográficas nem texto abaixo de 14px em rótulos novos.
