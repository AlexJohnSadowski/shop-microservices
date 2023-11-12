# Base Stage
FROM node:18-alpine3.16  as base

WORKDIR /app

COPY package*.json ./

# Development Stage
FROM base as development

RUN npm install

COPY . .

EXPOSE 8001

CMD ["npm", "run", "dev:local"]

# Production Stage
FROM base as production

RUN npm install --production

COPY . .

CMD ["npm", "start"]
