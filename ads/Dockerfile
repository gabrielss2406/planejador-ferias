# Serviço mínimo do domínio raiz (hubproject.space): serve o ads.txt do AdSense e uma página inicial simples.
FROM busybox:1.36
# contexto de build = raiz do repositório (assim o Easypanel e o compose usam o mesmo caminho)
COPY ads/www/ /www/
# consentimento de anúncios: o mesmo script do app
COPY public/site.js /www/site.js
EXPOSE 80
CMD ["httpd", "-f", "-p", "80", "-h", "/www"]
