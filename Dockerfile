# 1) Build stage: compile TS -> JS and install deps
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# 2) Runtime stage: small image, only prod deps + built code
FROM node:20-alpine AS runtime

WORKDIR /app

# Node env
ENV NODE_ENV=production

# Copy only package files and install prod deps
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# Copy .env if you want to bake defaults (optional; usually mounted)
# COPY .env ./

# Expose app port (must match PORT in .env)
EXPOSE 3000

# Start the server
CMD ["node", "dist/index.js"]
