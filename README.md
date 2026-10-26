# Planejador de férias

Aplicação estática (HTML + CSS + JavaScript, sem build e sem backend).
Sugere os melhores períodos de férias emendando fins de semana e feriados,
respeitando as regras da CLT (até 3 períodos, menor com 5 dias ou mais, maior com 14 dias ou mais).

## Estrutura

    public/index.html        a aplicação inteira
    Dockerfile               imagem nginx servindo a pasta public
    nginx.conf               configuração usada dentro do container
    docker-compose.yml       sobe o container na porta 8080
    nginx-host.conf.example  alternativa para nginx instalado direto na VPS

## Opção A: Docker (recomendada)

    unzip planejador-ferias.zip && cd planejador-ferias
    docker compose up -d --build

O site fica em http://IP-DA-VPS:8080.

Para usar um domínio com HTTPS, coloque seu proxy reverso (nginx, Caddy ou Traefik)
apontando para localhost:8080. Exemplo com Caddy:

    ferias.seudominio.com.br {
        reverse_proxy localhost:8080
    }

## Opção B: nginx direto na VPS

    sudo mkdir -p /var/www/ferias
    sudo cp public/index.html /var/www/ferias/
    sudo cp nginx-host.conf.example /etc/nginx/sites-available/ferias
    sudo nano /etc/nginx/sites-available/ferias        # troque o server_name
    sudo ln -s /etc/nginx/sites-available/ferias /etc/nginx/sites-enabled/
    sudo nginx -t && sudo systemctl reload nginx
    sudo certbot --nginx -d ferias.seudominio.com.br   # HTTPS gratuito

## Observações

- Crie um registro DNS tipo A do seu domínio apontando para o IP da VPS antes do certbot.
- As fontes vêm do Google Fonts. Se quiser zero dependência externa, baixe-as e sirva localmente.
- As configurações do usuário ficam no localStorage do navegador.
- A base de feriados municipais está em `CITIES` dentro do index.html e é demonstrativa.
  Confirme as datas com a prefeitura antes de confiar nelas.
- Próximo passo planejado: backend que consulta uma API de feriados e uma tabela própria
  de feriados municipais por código IBGE.
