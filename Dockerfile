FROM node:18-alpine
WORKDIR /app

COPY package.json package-lock.json pnpm-lock.yaml ./

RUN yarn global add pnpm && pnpm i

COPY . .

RUN yarn build

EXPOSE 3000

CMD yarn start