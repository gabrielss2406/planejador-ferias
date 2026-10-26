---
name: Planejador de Férias
description: Folhinha de parede com cartões de embarque destacáveis sobre uma casca grafite.
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
  azul-claro: "#EFF4FF"
  ambar: "#FFB000"
  ambar-claro: "#FFF3D1"
  ok: "#047857"
  erro: "#B42318"
typography:
  hero-number:
    fontFamily: "JetBrains Mono, DejaVu Sans Mono, ui-monospace, monospace"
    fontSize: "78px"
    fontWeight: 800
    lineHeight: 0.82
    letterSpacing: "-0.02em"
  section:
    fontFamily: "Barlow Condensed, Arial Narrow, Liberation Sans Narrow, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.06em"
  title:
    fontFamily: "Barlow Condensed, Arial Narrow, Liberation Sans Narrow, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "0.05em"
  value:
    fontFamily: "JetBrains Mono, DejaVu Sans Mono, ui-monospace, monospace"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.35
  body:
    fontFamily: "Barlow Condensed, Arial Narrow, Liberation Sans Narrow, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.35
  label:
    fontFamily: "Barlow Condensed, Arial Narrow, Liberation Sans Narrow, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.1em"
rounded:
  xs: "2px"
  sm: "4px"
  md: "6px"
  lg: "8px"
  full: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "22px"
  xxl: "28px"
components:
  button-primary:
    backgroundColor: "{colors.azul}"
    textColor: "{colors.papel}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.grafite}"
  button-segment:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
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
  sheet:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.lg}"
    padding: "10px 18px 12px"
  boarding-card:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.md}"
  plan-row:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    padding: "6px"
    height: "60px"
  plan-row-selected:
    backgroundColor: "{colors.azul-claro}"
  plan-change-band:
    backgroundColor: "{colors.ambar}"
    textColor: "{colors.tinta}"
  badge:
    backgroundColor: "{colors.grafite}"
    textColor: "{colors.papel}"
    rounded: "{rounded.xs}"
    padding: "0 6px"
  year-ruler:
    backgroundColor: "{colors.grafite-2}"
    textColor: "{colors.sobre-grafite}"
    padding: "10px 24px 12px"
---

# Design System: Planejador de Férias

## Overview

**Creative North Star: "A Folhinha de Embarque"**

Uma folha de calendário de parede, branca e de grade grande, pendurada sobre uma casca grafite; os períodos de férias viram cartões de embarque destacáveis por picote. O sistema é de tema único grafite, decisão deliberada: não existe tema claro e nenhum deve ser inventado. A folha, os cartões e a tabela de planos são papel branco; tudo o que é parâmetro fica num trilho cinza-claro; o resto é grafite.

A densidade é de painel de partidas: colunas fixas, números tabulares em mono, rótulos condensados em caixa alta. Cor tem função: azul para férias, ação e seleção; âmbar só para feriado e para mudança. Estado nunca é só cor: sempre há texto, ícone de traço ou marca geométrica ao lado.

Só nome, slogan e logo (placa clara no cabeçalho) vinham fixos; o resto foi construído em código, a partir do esboço de referência .impeccable/mocks/decision/folhinha-embarque.html.

**Key Characteristics:**
- Tema único grafite; papel branco para tudo que se lê e compara.
- Números gigantes em mono (78px) como voz principal; rótulos em Barlow Condensed uppercase.
- Picote tracejado com recortes semicirculares como assinatura estrutural.
- Plano, sem profundidade além de uma sombra de folha e de bordas de 1px.
- Alvos de toque de 44px em todo controle.

## Colors

Grafite e papel como par de superfícies, um azul funcional e um âmbar de aviso, sem terceira cor de acento.

### Primary
- **Azul Embarque** (`azul`): dias de férias, botão primário, segmento pressionado, cartão e plano selecionados, faixa de encadernação, filete do cabeçalho, foco.
- **Azul Névoa** (`azul-claro`): fundo da linha de plano selecionada.

### Secondary
- **Âmbar de Aviso** (`ambar`): feriado e mudança apenas (dia de feriado, linha de plano alterada, aviso da régua). Âmbar Pálido (`ambar-claro`) é o fundo do estado vazio.

### Neutral
- **Grafite** (`grafite`), **Grafite Elevado** (`grafite-2`), **Grafite Trilho** (`grafite-3`): casca, régua do ano, pista da régua.
- **Papel** (`papel`) e **Trilho Claro** (`trilho`): folha, cartões e campos; trilho de parâmetros e dias de folga.
- **Tinta** (`tinta`) e **Tinta Secundária** (`tinta-2`): texto sobre papel. **Névoa sobre Grafite** (`sobre-grafite`): texto secundário sobre grafite.
- **Contorno de Controle** (`controle`), **Divisor** (`divisor`), **Divisor Escuro** (`divisor-escuro`), **Picote** (`picote`), **Folga** (`folga`): bordas, filetes, tracejados e marcas de folga.
- Estado de regra: **Verde Regra** (`ok`) e **Vermelho Regra** (`erro`), sempre acompanhados de ícone e texto.

### Named Rules
**The Amber Is Change Rule.** Âmbar significa feriado ou mudança, nada mais. Não decora, não marca seleção.
**The Blue Is Vacation Rule.** Azul marca o que o usuário tira, aciona ou escolheu; não vira cor de fundo de seção.
**The Not-By-Color Rule.** Todo estado tem segundo canal: texto, ícone de traço, ponto-chave, risco no dia indisponível, barra inferior no feriado.

## Typography

**Display / Value Font:** JetBrains Mono (500, 700, 800; fallback DejaVu Sans Mono), self-hosted via @fontsource.
**Body / Label Font:** Barlow Condensed (500, 600, 700; fallback Arial Narrow), self-hosted via @fontsource.

**Character:** Mono tabular para todo número que se compara; condensada para a linguagem de sinalização. Duas famílias, papéis nunca trocados.

### Hierarchy
- **Hero number** (mono 800, 78px, 0.82; 64px no mobile): o total de dias fora do trabalho.
- **Section** (cond 700, 30px, 1.1, uppercase, 0.06em): títulos abaixo da dobra.
- **Title** (cond 700, 22px, uppercase, 0.05em): cabeçalho da folha do mês; 20px no nome do mês.
- **Value** (mono 700, 18px): números da tabela de planos.
- **Body** (cond 500, 16px, 1.35; 17-18px em textos de apoio): texto corrido, dicas.
- **Label** (cond 600, 14px, uppercase, 0.1em): rótulos de campo, segmentos de cartão, cabeçalho de tabela, legendas.

### Named Rules
**The Figures Are Mono Rule.** Datas, dias e contagens usam JetBrains Mono tabular; palavras usam Barlow Condensed.
**The Floor Is 14px Rule.** O menor texto é o rótulo de 14px (exceção construída: 13px nas siglas de feriado dentro do dia da folha).

## Layout

Desktop: grade de três colunas, 290px (parâmetros) | fluido (centro) | 410px (planos), cabeçalho de 64px e régua do ano em largura total, depois seções abaixo da dobra. De 1200 a 1360px as colunas viram 270 e 360px; de 981 a 1199px são duas colunas com planos sob o centro; até 980px é coluna única com resultado primeiro e painel de parâmetros recolhível, fixo na base (barra de 64px). Abaixo de 560px de contêiner os cartões de embarque viram carrossel com snap.

Ritmo: 4, 6, 8, 12, 16, 22 e 28px; padding do centro 22px (16px no mobile). Calendário anual em 4 colunas (3 em tablet, 2 em mobile). Alvo mínimo de toque 44px.

## Elevation & Depth

Plano por padrão. Profundidade vem da troca de superfície (grafite, papel, trilho), de filetes de 1px e do picote. A única sombra é a da folha do mês, que a descola da casca; não há sombras de hover.

### Shadow Vocabulary
- **Sheet lift** (`box-shadow: 0 8px 14px -8px rgb(0 0 0 / .55), 0 1px 0 rgb(255 255 255 / .06)`): só a folha do mês.
- **Holiday underline** (`inset 0 -5px 0 #FFB000`): feriado sobre dia de férias; é marca, não elevação.

### Named Rules
**The One Lift Rule.** Só a folha do mês projeta sombra. Cartões e linhas se distinguem por borda, faixa e fundo.

## Shapes

Cantos pequenos e práticos: 4px em controles, 6px em cartões e placa do logo, 8px nas folhas (apenas os cantos superiores, 8px 8px 0 0, como folha pendurada). Dias de calendário 3px, selos 3px, quadrados de legenda 2px, pontos e recortes 50%. Silhueta recorrente: picote, um tracejado (3px na folha, 2px no cartão) com recortes semicirculares na cor da casca nas bordas; faixa de encadernação azul de 8px com furos redondos no topo da folha; bloco de barras como textura no canhoto do cartão.

## Components

### Buttons
- **Primary** (`button-primary`): azul, texto branco, 44px, 4px, label uppercase 17px/700, tracking 0.06em. "Copiar resumo" sobe a 48px/20px e vira grafite no hover.
- **Segment / chip** (`button-segment`): branco com contorno de 1px (`controle`); pressionado vira azul preenchido. Meses em grade de 4.
- **Remover data-chave:** botão sem fundo de 44x44px (hover em trilho).

### Fields
Branco, contorno 1px (`controle`), 4px, 44px, valor em mono 16px; placeholder em condensada. Foco: contorno azul de 2px com recuo de 2px; slider e caixas usam accent azul.

### Sheet (Folha do mês)
Papel branco, faixa azul de 8px com furos, título em uppercase, grade de 7 colunas. Dia de férias azul/branco, folga trilho, feriado âmbar com sigla, dia-chave com ponto de tinta no canto, dia indisponível cinza riscado. Entra com 220ms.

### Boarding Card
Papel, faixa superior de 5px (`folga`; azul quando selecionado, picote no hover), contorno azul de 3px quando selecionado (aria-pressed). Segmentos rotulados (saída, retorno, duração, opção, folga contínua) em label + valor mono, separados por filetes; canhoto picotado com bloco de barras.

### Plan Board
Tabela de colunas fixas (Plano, Fora, Per., Maior bloco) com abas no topo (sublinhado azul de 3px quando selecionada). Linha: 60px, hover trilho, selecionada com azul-névoa e contorno azul interno de 2px. Linha alterada traz faixa âmbar em maiúsculas com ícone, que acende em 400ms.

### Year Ruler
Faixa grafite-2 em largura total: meses em uppercase, pista com folga cinza, férias azul (12px) e feriados âmbar (3px); legenda e aviso do art. 136 em âmbar sempre visíveis.

### Badge and Marks
Selo grafite com texto branco, 3px; marca de seleção em azul uppercase. Ícones: SVG de traço único 14px, 2px, pontas redondas, decorativos.

## Do's and Don'ts

### Do:
- **Do** manter tema único grafite; folha, cartões e tabela em papel branco.
- **Do** usar azul só para férias, ação e seleção; âmbar só para feriado e mudança.
- **Do** compor números em JetBrains Mono tabular e rótulos em Barlow Condensed uppercase com tracking.
- **Do** dar a todo estado um segundo canal (texto, ícone, ponto, risco, barra).
- **Do** manter alvos de 44px e foco visível de 2px azul.
- **Do** separar com picote quando a unidade é destacável (cartão, centro/cartões); usar bordas de 1px nos demais casos.

### Don't:
- **Don't** criar tema claro ou variante de casca; a decisão de tema único é do usuário.
- **Don't** usar âmbar como decoração ou seleção, nem azul como fundo de seção.
- **Don't** adicionar sombras além da folha, nem cartões brancos idênticos em grade sem segmentos rotulados.
- **Don't** usar outras famílias tipográficas nem texto abaixo de 14px em rótulos novos.
- **Don't** reintroduzir a imagem de praia do hero (hero.webp não é mais usada).
