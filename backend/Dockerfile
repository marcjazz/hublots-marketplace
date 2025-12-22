# Use a Node.js base image
FROM node:22-alpine AS builder

LABEL maintainer="Marco Kuidja <kuidjamarco@gmail.com>"

WORKDIR /app/backend

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

# If your backend has a build step (e.g., TypeScript compilation), uncomment and adjust this line:
RUN yarn build

FROM node:22-alpine

WORKDIR /app/backend

COPY --from=builder /app/backend/package.json ./
COPY --from=builder /app/backend/yarn.lock ./
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/.medusa/server ./
EXPOSE 9000

CMD ["/bin/sh", "-c", "yarn start"]