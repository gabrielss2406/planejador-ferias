FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# servidor próprio: serve o app e a API de grupos (SQLite embutido no Node, sem dependências extras)
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=80 DB_FILE=/data/ferias.db DIST_DIR=/app/dist
COPY --from=build /app/dist ./dist
COPY server ./server
COPY shared ./shared
VOLUME /data
EXPOSE 80
CMD ["node", "--disable-warning=ExperimentalWarning", "server/index.mjs"]
