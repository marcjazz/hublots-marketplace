# Use a Node.js base image
FROM node:22-alpine AS builder

LABEL maintainer="Marco Kuidja <kuidjamarco@gmail.com>"

WORKDIR /app/vendor-panel

COPY package.json pnpm-lock.yaml ./

RUN corepack enable pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build
FROM node:22-alpine

WORKDIR /app/vendor-panel

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm && pnpm add -g serve

COPY --from=builder /app/vendor-panel/dist ./dist
COPY --from=builder /app/vendor-panel/public ./public

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
