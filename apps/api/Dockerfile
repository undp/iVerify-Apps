FROM node:lts-alpine

# Add a new user "iverify" with user id 8877
RUN useradd -u 8877 iverify
# Change to non-root privilege
USER iverify

WORKDIR /app
COPY ./dist/apps/api .
ENV PORT=3333
EXPOSE ${PORT}

RUN npm install --production
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express mysql2
CMD node ./main.js


