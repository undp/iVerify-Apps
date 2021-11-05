FROM nginxinc/nginx-unprivileged:1.20

RUN rm -rf /usr/share/nginx/html/*

COPY deploy/nginx-conf/nginx-default.conf /etc/nginx/conf.d/
COPY ./dist/apps/iverify /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
EXPOSE 8200

