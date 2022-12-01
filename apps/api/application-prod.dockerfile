# FROM node:14.17.1 as builder

# # ARG ENVIRONMENT
# # RUN npm install npm -g

# RUN apt-get update && \
#   apt-get install -y \
#   libgtk2.0-0 \
#   libnotify-dev \
#   libgconf-2-4 \
#   libnss3 \
#   libxss1 \
#   libasound2 \
#   xvfb

# WORKDIR /workspace
# COPY . .


# RUN npm install
# ENV PATH /workspace/node_modules/.bin:$PATH
# RUN nx build --maxWorkers=1 --memoryLimit=5120 api


# FROM node:lts-alpine
# WORKDIR /app

# RUN addgroup -g 1001 -S iverify && adduser -u 1001 -S iverify  -G iverify
# COPY --from=builder /workspace/dist/apps/api .
# RUN chmod 750 -R /app
# RUN chown -R iverify:iverify /app

# USER iverify

# ENV PORT=3333
# EXPOSE 3333
# RUN npm install --production
# RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express mysql

# CMD node ./main.js


###################
# BUILD FOR PRODUCTION
###################

FROM node:16.3.0-alpine As build

WORKDIR /workspace

ENV PATH /workspace/node_modules/.bin:$PATH
RUN nx build --maxWorkers=1 --memoryLimit=5120 api

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

# RUN npm run build

ENV NODE_ENV production

RUN npm install -f --only=production && npm cache clean --force
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express mysql

USER node

###################
# PRODUCTION
###################

FROM node:16.3.0-alpine As production

RUN addgroup -g 1001 -S iverify && adduser -u 1001 -S iverify  -G iverify
COPY --from=builder /workspace/dist/apps/api .
RUN chmod 750 -R /app
RUN chown -R iverify:iverify /app

USER iverify

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

ENV PORT=3333
EXPOSE 3333


CMD [ "node", "dist/main.js" ]
