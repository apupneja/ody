FROM node:22-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --omit=dev
COPY --from=build /app/dist ./dist
COPY server ./server

ENV PORT=3001
EXPOSE 3001

CMD ["node", "server/index.js"]
