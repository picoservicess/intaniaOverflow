# Use multi-stage build to minimize final image size
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package files first to leverage Docker cache
COPY asset-service/package*.json ./asset-service/
COPY user-service/package*.json ./user-service/

# Install dependencies in asset-service
WORKDIR /usr/src/app/asset-service
RUN npm install

# Install dependencies and compile user-service libs
WORKDIR /usr/src/app/user-service
RUN npm install

# Copy necessary source files
COPY proto/*.proto /usr/src/app/proto/
COPY user-service/src/libs/auth.ts ./src/libs/
COPY asset-service /usr/src/app/asset-service/

# Start fresh with a new base image for the final stage
FROM node:20-alpine

# # Build the TypeScript code
# RUN npm run build

# Create non-root user for security
RUN addgroup -g 1001 nodejs && \
  adduser -S -u 1001 -G nodejs nodejs

# Set working directory
WORKDIR /usr/src/app

# Copy built artifacts from builder stage
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/asset-service/node_modules ./asset-service/node_modules
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/asset-service ./asset-service
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/proto ./proto
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/user-service/node_modules ./user-service/node_modules
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/user-service/src ./user-service/src

# Set user
USER nodejs

# Expose the port the app runs on
EXPOSE 5001

# Set working directory for the application
WORKDIR /usr/src/app/asset-service

# Command to run the application
CMD ["npm", "start"]