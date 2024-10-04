FROM node:lts-alpine
WORKDIR /app
COPY ./dist/apps/publisher .
COPY ./ssl .
ENV PORT=3334
EXPOSE 3334
RUN npm install --production
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express
CMD node ./main.js
