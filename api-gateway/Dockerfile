# Use multi-stage build to minimize final image size
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package files first to leverage Docker cache
COPY api-gateway/package*.json ./api-gateway/

# Install dependencies in api-gateway
WORKDIR /usr/src/app/api-gateway
RUN npm install

# Copy necessary source files
COPY proto/*.proto /usr/src/app/proto/
COPY api-gateway /usr/src/app/api-gateway/

# Start fresh with a new base image for the final stage
FROM node:20-alpine

# Create non-root user for security
RUN addgroup -g 1001 nodejs && \
  adduser -S -u 1001 -G nodejs nodejs

# Set working directory
WORKDIR /usr/src/app

# Copy built artifacts from builder stage
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/api-gateway/node_modules ./api-gateway/node_modules
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/api-gateway ./api-gateway
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/proto ./proto

# Set user
USER nodejs

# Expose the port the app runs on
EXPOSE 80

# Set working directory for the application
WORKDIR /usr/src/app/api-gateway

# Command to run the application
CMD ["npm", "start"]
