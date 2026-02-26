FROM node:20-alpine AS builder

WORKDIR /app

# copy backend sources from the repo subdirectory
COPY backend/package.json backend/tsconfig.json ./
COPY backend/src ./src
COPY backend/sql ./sql

RUN npm install && npm run build && \
  mkdir -p dist/docs && \
  cp src/docs/openapi.yaml dist/docs/openapi.yaml

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY backend/package.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/sql ./sql

EXPOSE 4000

CMD ["node", "dist/server.js"]
