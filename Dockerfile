# Multi-stage Dockerfile for NestJS (TypeScript) app
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build

# Production image
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy only the production artifacts
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY ./scripts/wait-for.sh ./scripts/wait-for.sh
RUN chmod +x ./scripts/wait-for.sh
COPY ./scripts/crypto-shim.js ./scripts/crypto-shim.js

# Preload the crypto shim so it runs before application modules are evaluated.
ENV NODE_OPTIONS=--require=./scripts/crypto-shim.js

EXPOSE 3000
CMD ["node", "dist/main.js"]
