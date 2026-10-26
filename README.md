# Planejador de férias

Aplicação em React + TypeScript (Vite). O cálculo roda todo no navegador; só o recurso **Férias em grupo** usa um servidor pequeno (Node + SQLite).
Sugere os melhores períodos de férias emendando fins de semana e feriados,
respeitando as regras da CLT (até 3 períodos, menor com 5 dias ou mais, maior com 14 dias ou mais).

## Estrutura

    index.html               entrada do Vite
    src/lib/                 lógica pura: datas, feriados, motor de busca e exportação (.ics, plano salvo)
    src/components/          parâmetros, planos, ações, planos salvos, gaveta "Mais opções"
    src/hooks/useSettings.ts estado das configurações, salvo no localStorage
    src/hooks/useSavedPlans.ts planos favoritos (até 12), salvos no localStorage
    src/styles.css           estilos e tokens da identidade visual
    src/assets/              logo e imagem do hero (otimizadas a partir de logo.png e image.png)
    server/                  servidor Node: serve o dist e a API dos grupos (SQLite embutido, sem dependências)
    shared/planShape.mjs     validação do plano, usada pelo navegador e pelo servidor
    Dockerfile               build com Node, depois o servidor Node servindo o dist e a API
    docker-compose.yml       sobe o container na porta 8080, com volume para o banco

## Ações sobre o plano

Abaixo de "Escolha um plano", para o plano selecionado:

- **Copiar resumo**: copia o plano em texto.
- **Salvar ticket**: baixa uma imagem PNG do ticket de viagem do plano (número de dias fora, períodos e aviso do art. 136).
- **Adicionar ao calendário (.ics)**: baixa um arquivo com um evento de dia inteiro por período, para abrir no Google Agenda, Outlook ou Apple Calendário.
- **Escolher este plano**: marca o plano que você de fato vai levar (um só, guardado no navegador). Ele ganha o selo "Escolhido" e é o que o grupo enxerga.
- **Salvar plano**: guarda o plano (só datas e dias) no navegador, até 12. A lista "Planos salvos" aparece abaixo
  e cada item tem Copiar, Ticket, Calendário e Remover. Planos salvos não reabrem os parâmetros que os geraram.

O botão flutuante **Mais opções**, fixo na base da tela, abre uma gaveta com ano, feriados, datas-chave, janela e meses e regras da CLT.

## Férias em grupo

A seção "Férias em grupo" liga pessoas por um código de 5 números. Uma pessoa cria o grupo e passa o código; as outras entram com
ele e um apelido. Cada uma vê, numa régua do ano, o plano escolhido dos colegas e os dias em que as férias coincidem.

- Sem login: o navegador guarda um identificador anônimo, que autoriza a pessoa a editar só o próprio apelido e plano.
- Quem tem o código vê o apelido e as datas do plano escolhido. Não há senha: não use para dados sensíveis.
- Até 20 pessoas por grupo; grupos sem uso há 90 dias são apagados; há limite de pedidos por IP.
- Os dados ficam em SQLite (`DB_FILE`, padrão `data/ferias.db`; no Docker, o volume `/data`).

## Desenvolvimento

    npm install
    npm run server   # API dos grupos em http://localhost:3001 (precisa de Node 22.13+)
    npm run dev      # http://localhost:5173, repassa /api para o servidor
    npm test         # motor de busca, exportação (.ics), sobreposição de grupo e API/servidor
    npm run build    # gera dist/
    npm start        # serve dist/ e a API (depois do build)

## Como rodar (Docker)

    unzip planejador-ferias.zip && cd planejador-ferias
    docker compose up -d --build

O site fica em http://IP-DA-VPS:8080.

Para usar um domínio com HTTPS, coloque seu proxy reverso (Caddy, Traefik ou o do seu provedor)
apontando para localhost:8080. Exemplo com Caddy:

    ferias.seudominio.com.br {
        reverse_proxy localhost:8080
    }

## Observações

- Para HTTPS, crie um registro DNS tipo A do seu domínio apontando para o IP da VPS antes de configurar o proxy reverso.
- As fontes vêm do Google Fonts. Se quiser zero dependência externa, baixe-as e sirva localmente.
- As configurações, os planos salvos e o plano escolhido ficam no localStorage do navegador.
- A base de feriados municipais está em `CITIES`, em `src/lib/holidays.ts` e é demonstrativa.
  Confirme as datas com a prefeitura antes de confiar nelas.
- Próximo passo planejado: consulta a uma API de feriados e uma tabela própria
  de feriados municipais por código IBGE (no mesmo servidor).
