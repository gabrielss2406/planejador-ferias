---
name: Planejador de Férias
description: Uma pergunta, uma resposta: folha branca com número gigante e picote sobre uma casca grafite, em coluna única.
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
  page-bottom: "56px"
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
  more-panel:
    backgroundColor: "{colors.trilho}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.lg}"
    height: "60px"
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

Uma pergunta, uma resposta. Uma folha de calendário de parede, branca, pendurada numa casca grafite, responde com um número gigante ("45 dias fora do trabalho") e um picote tracejado a separa dos períodos de férias. Tudo o que não é a resposta recua: os parâmetros cabem numa barra mínima acima dela, o resto mora no painel recolhido "Mais opções" e abaixo da dobra. É um refinamento do redesign anterior, mesma identidade, menos peças: sem rail lateral, sem coluna de planos, sem tabela, sem cartões com código de barras.

O sistema é de tema único grafite, decisão fechada do usuário: não existe tema claro e nenhum deve ser inventado. Nome, slogan e logo (placa clara no cabeçalho) também são fixos. Papel branco é o que se lê e se compara; trilho cinza-claro é tudo que se preenche; o resto é grafite. Cor tem função: azul para férias, ação e seleção; âmbar só para feriado e mudança. Estado nunca é só cor.

**Key Characteristics:**
- Coluna única de 840px, lida de cima para baixo, resposta antes de qualquer opção.
- Número gigante em mono (80px; 68px no celular) como voz principal; palavras em Barlow Condensed.
- Picote tracejado com recortes semicirculares como assinatura estrutural, usado uma vez na folha de resposta.
- Plano: uma única sombra de folha, bordas de 1px e troca de superfície para o resto.
- Alvos de toque de 44px em todo controle.

## Colors

Grafite e papel como par de superfícies, um azul funcional e um âmbar de aviso, sem terceira cor de acento.

### Primary
- **Azul Embarque** (`azul`): dias de férias, botão primário, segmento pressionado, plano e período selecionados, faixa de encadernação, filete de 2px do cabeçalho, foco, accent de slider e caixas.
- **Azul Profundo** (`azul-escuro`): hover do botão primário.
- **Azul Névoa** (`azul-claro`): fundo do plano e do período selecionados.

### Secondary
- **Âmbar de Aviso** (`ambar`): feriado e mudança apenas (dia de feriado, marca de feriado na régua, chip de mudança do plano). **Âmbar Pálido** (`ambar-claro`) é o fundo do estado vazio, que avisa que nada foi encontrado.

### Neutral
- **Grafite** (`grafite`), **Grafite Elevado** (`grafite-2`), **Grafite Trilho** (`grafite-3`): casca e recortes do picote; `grafite-3` é a pista da régua do ano. `grafite-2` é mantido na paleta, mas hoje não pinta nenhuma superfície do CSS.
- **Papel** (`papel`) e **Trilho Claro** (`trilho`): folha, cartões e campos; trilho da barra de parâmetros, do painel "Mais opções" e dos dias de folga.
- **Tinta** (`tinta`) e **Tinta Secundária** (`tinta-2`): texto sobre papel. **Névoa sobre Grafite** (`sobre-grafite`): texto secundário sobre grafite.
- **Contorno de Controle** (`controle`), **Divisor** (`divisor`), **Divisor Escuro** (`divisor-escuro`), **Picote** (`picote`), **Folga** (`folga`): bordas de campos, filetes, tracejado do picote e barras de folga na régua.
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
- **Action** (cond 700, 21px): "Copiar resumo". **Card title** (cond 700, 20px): nome do plano, nome do mês, subtítulos do painel.
- **Sentence** (cond 500, 19px, 1.35; 18px no celular, máx. 70ch): frase-resumo sob o número.
- **Value** (mono 700, 18px): datas dos períodos. **Control** (cond 600-700, 17-18px): texto de segmento, botão, link "Ver mais planos", texto de apoio e linhas de lista.
- **Body** (cond 500, 16px, 1.35): texto corrido, legendas, campo em mono 16px. **Field compact** (mono 500, 15px): campo de data, filtro de planos, sigla do feriado na lista; também o slogan no celular.
- **Label** (cond 600, 14px): rótulos de campo, dicas, selo, chip de mudança, dias da semana, meses da régua (esses em caixa alta com 0.04em). **Day tag** (cond 600, 13px): sigla de feriado dentro do dia da folha.

### Named Rules
**The Figures Are Mono Rule.** Datas, dias e contagens usam JetBrains Mono tabular; palavras usam Barlow Condensed.
**The Floor Is 14px Rule.** O menor texto é o rótulo de 14px; a única exceção construída é a sigla de 13px dentro do dia da folha.
**The Step Is Documented Rule.** Todo tamanho novo entra na lista acima ou usa um degrau existente; 15 e 17px são degraus reais (campo compacto e controle), não desvios.

## Layout

Uma coluna central de até 840px (`min(100%, 840px)`) sobre a casca, com padding lateral de 24px (16px no celular), 56px de respiro final e 22px entre blocos (24px no celular). Ordem fixa: cabeçalho de 64px com filete azul de 2px, barra de parâmetros, folha de resposta (número, picote, períodos), "Escolha um plano" com três cartões e "Copiar resumo", régua "Seu ano de relance", "Mais opções" recolhido, calendário do ano recolhido, "Como funciona" e feriados.

A barra de parâmetros quebra em linha: cidade e UF (flex 2), dias, períodos. Cartões de plano em grade auto-fit de 230px, 10px de vão. Calendário anual em 4 colunas, 2 no celular. Ritmo: 4, 6, 8, 10, 12, 14, 16, 18 e 24px. Ponto de quebra único: 640px (celular), mais 420px para segmentos de dias que esticam. Alvo mínimo de toque 44px.

## Elevation & Depth

Plano por padrão. Profundidade vem da troca de superfície (grafite, papel, trilho), de filetes de 1px e do picote. A única sombra é a das folhas (resposta e mês), que as descola da casca; não há sombras de hover.

### Shadow Vocabulary
- **Sheet lift** (`box-shadow: 0 8px 14px -8px rgb(0 0 0 / .55)`): folha de resposta e folha do mês.
- **Holiday underline** (`inset 0 -5px 0 #FFB000`): feriado sobre dia de férias; é marca, não elevação.

### Named Rules
**The One Lift Rule.** Só as folhas projetam sombra. Cartões de plano, linhas e campos se distinguem por borda, fundo e cor.

## Shapes

Cantos pequenos e práticos, em degraus reais do CSS: 8px nas folhas, painéis e na barra de parâmetros (`lg`; as folhas do calendário só nos cantos superiores, 8px 8px 0 0, como folha pendurada); 6px em cartões de plano e na placa do logo (`md`); 4px em controles (`sm`); 3px em dias de calendário, selos, chip de mudança e pista da régua (`cell`, usado em seis lugares, degrau legítimo); 2px em quadradinhos de legenda (`xs`); 1px apenas na marca de feriado da régua (`hairline`, acidental por natureza: é a ponta de uma barra de 3px e não deve ser herdado por componente novo); 50% em pontos e nos recortes do picote.

Silhueta recorrente: o picote, tracejado de 3px com recortes semicirculares de 22px na cor da casca nas bordas da folha de resposta; faixa de encadernação azul de 8px com furos redondos no topo da folha do mês.

## Components

### Buttons
- **Primary** (`button-primary`): "Copiar resumo", azul, texto branco, 52px, 4px, 21px/700, hover em `azul-escuro`. No celular ocupa a largura toda. Botão "Adicionar" no painel: 44px, 18px/700.
- **Segment / chip** (`button-segment`): branco com contorno de 1px (`controle`), 44px, 17px/600; pressionado vira azul preenchido. Meses em grade de 4. Períodos usam rádio escondido sob o segmento ("até 1/2/3").
- **Link** : "Ver mais planos", texto branco sublinhado (4px de recuo, traço em `picote`), 44px de alvo.

### Fields
Branco, contorno 1px (`controle`), 4px, 44px, valor em mono 16px (15px em data); placeholder em condensada 17px. Foco: contorno azul de 2px com recuo de 2px.

### Params bar
Faixa trilho de 8px, 14px/16px de padding, rótulos de 14px/600 em `tinta-2`, dica de cidade abaixo. Três perguntas: cidade e UF, dias (30 ou "20, vendendo 10"), períodos (até 1, 2, 3).

### Answer sheet (folha de resposta)
Folha branca de 8px com sombra. No topo o número de 80px com a unidade e a frase de 19px; picote tracejado; abaixo, "Tire férias nestas datas" com linhas de período de 44px+, divididas por filetes de 1px. Período ativo: fundo `azul-claro` e contorno interno azul de 2px; clicar o destaca na régua. Entra com 220ms. Estado vazio é um bloco de `ambar-claro`.

### Plan cards
Cartão branco de 6px, 84px mínimo, borda de 2px transparente; selecionado ganha `azul-claro`, borda azul e ícone de marca. Nome (20px), figura de dias fora (28px mono), contagem de períodos. **Selo** "Melhor opção" em grafite, 3px, só no primeiro. **Chip de mudança**: âmbar, texto tinta, ícone de seta e "+2 dias", "−1 dia" ou "novo"; acende em 400ms e a lista reordena no lugar por deslize de 360ms.

### Year ruler ("Seu ano de relance")
Sem fundo próprio, direto sobre a casca: meses em caixa alta 14px, pista `grafite-3` de 28px, folga em `folga` (altura total), férias azuis de 16px, feriados em âmbar de 3px; período ativo ganha contorno branco de 2px. Legenda de 16px abaixo.

### Month sheet and calendar
Folha branca com faixa azul de 8px e furos; dias em grade de 7: férias azul/branco, folga `trilho`, feriado âmbar com sigla, dia-chave com ponto de tinta no canto, dia indisponível `divisor` riscado. O calendário do ano usa os mesmos códigos em meses de 4 colunas.

### More options
Painel trilho de 8px, cabeçalho de 60px com título de 24px e resumo à direita (oculto no celular), seta que gira 180 graus; dentro, seções recolhíveis separadas por filete de 1px.

## Do's and Don'ts

### Do:
- **Do** manter tema único grafite; folhas, cartões e linhas de período em papel branco, campos em trilho.
- **Do** colocar a resposta (número e picote) antes de qualquer opção, em coluna única.
- **Do** usar azul só para férias, ação e seleção; âmbar só para feriado e mudança.
- **Do** compor números em JetBrains Mono tabular e palavras em Barlow Condensed.
- **Do** dar a todo estado um segundo canal (texto, ícone, ponto, risco, barra, contorno).
- **Do** manter alvos de 44px e foco visível de 2px azul.
- **Do** reutilizar os degraus documentados de tamanho (13 a 32px, 68/80px) e de raio (1, 2, 3, 4, 6, 8px, 50%).

### Don't:
- **Don't** criar tema claro ou variante de casca; a decisão de tema único é do usuário.
- **Don't** trocar nome, slogan ou logo.
- **Don't** usar âmbar como decoração ou seleção, nem azul como fundo de seção.
- **Don't** adicionar sombras além das folhas, nem reintroduzir rail lateral, tabela de planos, cartões com código de barras ou a imagem de praia do hero.
- **Don't** usar outras famílias tipográficas nem texto abaixo de 14px em rótulos novos.
