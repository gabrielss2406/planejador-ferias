# Domínio raiz: `ads.txt` do AdSense

O AdSense procura o `ads.txt` na raiz do domínio cadastrado (`https://hubproject.space/ads.txt`). O app roda no
subdomínio `planejadordeferias.hubproject.space`, então a raiz precisa de um serviço próprio. Esta pasta é esse serviço:
um `busybox httpd` que serve `www/` (o `ads.txt`, o `robots.txt` e uma página inicial simples com link para o planejador).

## Subir

1. **DNS:** crie um registro `A` do domínio raiz `hubproject.space` apontando para o IP do servidor (o do subdomínio já existe).
2. **Container:** o contexto de build é a **raiz do repositório** (`docker build -f ads/Dockerfile .`). Na raiz do repositório,

       docker compose up -d --build ads

   Ele escuta na porta 8081 do servidor (o planejador fica na 8080).
3. **HTTPS:** o Google só aceita `https`. Use o proxy reverso que você já tem; exemplo com Caddy:

       hubproject.space {
           reverse_proxy localhost:8081
       }

       planejadordeferias.hubproject.space {
           reverse_proxy localhost:8080
       }

4. **Conferir:**

       curl -i https://hubproject.space/ads.txt

   Deve responder `200`, `Content-Type: text/plain` e a linha `google.com, pub-1072676310072772, DIRECT, f08c47fec0942fa0`.
   Não pode haver redirecionamento para outro domínio. Depois, no AdSense, peça a verificação do site.

## Trocar o ID do AdSense

Edite `ads/www/ads.txt` e `adsenseClient` em `../site.config.json` com o mesmo ID. Um teste (`npm test`) falha se os dois
divergirem. Reconstrua com `docker compose up -d --build ads`.

## Easypanel

Crie um serviço de app apontando para este repositório, com **caminho do Dockerfile** `ads/Dockerfile` e contexto na raiz
(o padrão). Porta do container: 80. Adicione o domínio `hubproject.space` ao serviço (o Easypanel emite o HTTPS).
