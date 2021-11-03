FROM nginx:1.18.0-alpine

COPY deploy/nginx-conf/nginx-default.conf /etc/nginx/conf.d/
RUN rm -rf /usr/share/nginx/html/*

COPY ./dist/apps/iverify /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
EXPOSE 8200