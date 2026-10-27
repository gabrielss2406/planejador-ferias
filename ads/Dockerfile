# Serviço mínimo do domínio raiz (hubproject.space): serve o ads.txt do AdSense e uma página inicial simples.
FROM busybox:1.36
COPY www/ /www/
EXPOSE 80
CMD ["httpd", "-f", "-p", "80", "-h", "/www"]
