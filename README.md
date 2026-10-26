# Planejador de férias

Aplicação estática em React + TypeScript (Vite), sem backend.
Sugere os melhores períodos de férias emendando fins de semana e feriados,
respeitando as regras da CLT (até 3 períodos, menor com 5 dias ou mais, maior com 14 dias ou mais).

## Estrutura

    index.html               entrada do Vite
    src/lib/                 lógica pura: datas, feriados e motor de busca (testável)
    src/components/          painel de parâmetros, planos, faixa do ano, calendário
    src/hooks/useSettings.ts estado das configurações, salvo no localStorage
    src/styles.css           estilos
    Dockerfile               build com Node, depois busybox httpd servindo o dist
    docker-compose.yml       sobe o container na porta 8080

## Desenvolvimento

    npm install
    npm run dev      # http://localhost:5173
    npm test         # testes do motor de busca
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
- As configurações do usuário ficam no localStorage do navegador.
- A base de feriados municipais está em `CITIES`, em `src/lib/holidays.ts` e é demonstrativa.
  Confirme as datas com a prefeitura antes de confiar nelas.
- Próximo passo planejado: backend que consulta uma API de feriados e uma tabela própria
  de feriados municipais por código IBGE.
