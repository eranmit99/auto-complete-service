FROM node:21 as base

WORKDIR /home/node/app

COPY package*.json ./

RUN npm ci

COPY . .

FROM base as production

ENV NODE_PATH=./build

RUN npm run build