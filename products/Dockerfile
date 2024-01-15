# Base Stage
FROM node:18-alpine3.16  as base
WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm

# Development Stage
FROM base as development


RUN pnpm install

COPY . .

EXPOSE 8001

CMD ["npm", "run", "dev:local"]

# Production Stage
FROM base as production

RUN pnpm install --production

COPY . .

CMD ["npm", "start"]
