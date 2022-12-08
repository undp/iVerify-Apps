FROM node:16.10 as builder

ARG ENVIRONMENT
RUN npm install npm@8 -g

# RUN apt-get update && \
#   apt-get install -y \
#   libgtk2.0-0 \
#   libnotify-dev \
#   libgconf-2-4 \
#   libnss3 \
#   libxss1 \
#   libasound2 \
#   xvfb

WORKDIR /workspace
COPY . .

RUN chmod +x /entrypoint.sh

ENV PATH /workspace/node_modules/.bin:$PATH
RUN npm install
RUN npm run build api


FROM node:16.10
WORKDIR /app

# RUN addgroup -g 1001 -S iverify && adduser -u 1001 -S iverify  -G iverify
COPY --from=builder /workspace/dist/apps/api .
# RUN chmod 750 -R /app
# RUN chown -R iverify:iverify /app

# USER iverify

ENV PORT=3333
EXPOSE 3333
RUN npm install --production
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express mysql

ENTRYPOINT ["/entrypoint.sh"]
# CMD ["./entrypoint.sh"]
CMD node ./main.js
