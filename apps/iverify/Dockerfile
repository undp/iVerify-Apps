FROM nginx:1.18.0-alpine

RUN rm -rf /usr/share/nginx/html/*

RUN addgroup -g 1001 -S iverify && adduser -u 1001 -S iverify  -G iverify 

RUN chown -R iverify:iverify /usr/share/nginx/

USER iverify
COPY deploy/nginx-conf/nginx-default.conf /etc/nginx/conf.d/

COPY ./dist/apps/iverify /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
EXPOSE 8200