# Build stage
FROM node:22.16.0-alpine AS builder

WORKDIR /app

# Define build arguments with default values
ARG NEXT_PUBLIC_API_URL=https://evoapi.bestgov.ai

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy all source code (this includes tsconfig.json, lib/, etc.)
COPY . .

# Set environment variables from build arguments
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build the application
RUN pnpm run build

# Production stage
FROM node:22.16.0-alpine AS runner

WORKDIR /app

# Define build arguments again for the runner stage
ARG NEXT_PUBLIC_API_URL=https://evoapi.bestgov.ai

# Install pnpm globally
RUN npm install -g pnpm

# Install production dependencies only
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --no-frozen-lockfile

# Copy built assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3010
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Script to replace environment variables at runtime
COPY docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh

# Expose port
EXPOSE 3010

# Use entrypoint script to initialize environment variables before starting the app
ENTRYPOINT ["sh", "./docker-entrypoint.sh"] 
