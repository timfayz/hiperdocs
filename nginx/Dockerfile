FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY web.conf /etc/nginx/sites-enabled/web.conf
COPY https.conf /etc/nginx/snippets/https.conf

CMD ["nginx", "-g", "daemon off;"]