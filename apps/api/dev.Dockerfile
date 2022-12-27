# Use the latest Node image 16.14.0
FROM public.ecr.aws/docker/library/node:16-alpine
RUN apk update

# Create directory to work out of
RUN mkdir /app
WORKDIR /app

# Install dependencies first (assuming they'll change less frequently, this
# will make image re-builds faster)
RUN npm install -g npm@8.5.1
ADD ../package.json package.json
RUN npm install --legacy-peer-deps

# Build source code
ADD . /app
RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]