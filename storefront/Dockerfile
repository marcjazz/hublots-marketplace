# Use a Node.js base image
FROM node:22-alpine AS builder

LABEL maintainer="Marco Kuidja <kuidjamarco@gmail.com>"

WORKDIR /app/storefront

COPY package.json pnpm-lock.yaml ./

RUN corepack enable pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:22-alpine

RUN apk add --no-cache curl

WORKDIR /app/storefront

ENV NEXT_SHARP_PATH=/usr/bin/node

COPY --from=builder /app/storefront/public ./public
COPY --from=builder /app/storefront/.next/standalone ./
COPY --from=builder /app/storefront/.next/static ./.next/static
EXPOSE 3000

CMD ["node", "server.js"]
