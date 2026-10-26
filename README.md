# Planejador de férias

Aplicação estática em React + TypeScript (Vite), sem backend.
Sugere os melhores períodos de férias emendando fins de semana e feriados,
respeitando as regras da CLT (até 3 períodos, menor com 5 dias ou mais, maior com 14 dias ou mais).

## Estrutura

    index.html               entrada do Vite
    src/lib/                 lógica pura: datas, feriados, motor de busca e exportação (.ics, plano salvo)
    src/components/          parâmetros, planos, ações, planos salvos, folha de PDF, gaveta "Mais opções"
    src/hooks/useSettings.ts estado das configurações, salvo no localStorage
    src/hooks/useSavedPlans.ts planos favoritos (até 12), salvos no localStorage
    src/styles.css           estilos e tokens da identidade visual
    src/assets/              logo e imagem do hero (otimizadas a partir de logo.png e image.png)
    Dockerfile               build com Node, depois busybox httpd servindo o dist
    docker-compose.yml       sobe o container na porta 8080

## Ações sobre o plano

Abaixo de "Escolha um plano", para o plano selecionado:

- **Copiar resumo**: copia o plano em texto.
- **Salvar PDF**: abre o diálogo de impressão do navegador com uma folha limpa (uma página, sem a interface);
  escolha "Salvar como PDF". Não gera o arquivo direto.
- **Adicionar ao calendário (.ics)**: baixa um arquivo com um evento de dia inteiro por período, para abrir no Google Agenda, Outlook ou Apple Calendário.
- **Salvar plano**: guarda o plano (só datas e dias) no navegador, até 12. A lista "Planos salvos" aparece abaixo
  e cada item tem Copiar, PDF, Calendário e Remover. Planos salvos não reabrem os parâmetros que os geraram.

O botão flutuante **Mais opções**, fixo na base da tela, abre uma gaveta com ano, feriados, datas-chave, janela e meses e regras da CLT.

## Desenvolvimento

    npm install
    npm run dev      # http://localhost:5173
    npm test         # testes do motor de busca e da exportação (.ics)
    npm run build    # gera dist/

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
- As configurações e os planos salvos ficam no localStorage do navegador.
- A base de feriados municipais está em `CITIES`, em `src/lib/holidays.ts` e é demonstrativa.
  Confirme as datas com a prefeitura antes de confiar nelas.
- Próximo passo planejado: backend que consulta uma API de feriados e uma tabela própria
  de feriados municipais por código IBGE.
