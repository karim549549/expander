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
COPY .env ./.env # Added this line

EXPOSE 3000
CMD ["node", "dist/main.js"]