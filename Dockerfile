FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .
RUN pnpm build
RUN pnpm prune --prod

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
