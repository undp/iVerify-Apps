FROM node:lts-alpine
WORKDIR /app
COPY ./dist/apps/triage .
COPY ./ssl .
ENV PORT=3335
EXPOSE 3335
RUN npm install --production
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express
CMD node ./main.js
