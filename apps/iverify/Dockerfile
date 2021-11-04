
FROM node:14.17.1 as builder

ARG ENVIRONMENT

RUN npm install npm@latest -g

RUN apt-get update && \
  apt-get install -y \
  libgtk2.0-0 \
  libnotify-dev \
  libgconf-2-4 \
  libnss3 \
  libxss1 \
  libasound2 \
  xvfb

WORKDIR /workspace
COPY package.json ./
COPY package-lock.json ./

RUN npm install
RUN npm install font-awesome

ENV PATH /workspace/node_modules/.bin:$PATH

COPY . .

RUN ng build iverify --configuration=production

FROM nginx:1.18.0-alpine

RUN rm -rf /usr/share/nginx/html/*

RUN addgroup -g 1001 -S iverify && adduser -u 1001 -S iverify  -G iverify 
USER iverify
COPY deploy/nginx-conf/nginx-default.conf /etc/nginx/conf.d/

COPY --from=builder /workspace/dist/apps/iverify /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
EXPOSE 8200