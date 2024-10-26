# Use multi-stage build to minimize final image size
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package files first to leverage Docker cache
COPY notification-service/package*.json ./notification-service/
COPY user-service/package*.json ./user-service/

# Install dependencies in notification-service
WORKDIR /usr/src/app/notification-service
RUN npm install

# Install dependencies and compile user-service libs
WORKDIR /usr/src/app/user-service
RUN npm install

# Copy necessary source files
COPY proto/*.proto /usr/src/app/proto/
COPY user-service/src/libs/token.ts ./src/libs/
COPY notification-service /usr/src/app/notification-service/

# Start fresh with a new base image for the final stage
FROM node:20-alpine

# Create non-root user for security
RUN addgroup -g 1001 nodejs && \
  adduser -S -u 1001 -G nodejs nodejs

# Set working directory
WORKDIR /usr/src/app

# Copy built artifacts from builder stage
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/notification-service/node_modules ./notification-service/node_modules
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/notification-service ./notification-service
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/proto ./proto
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/user-service/node_modules ./user-service/node_modules
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/user-service/src ./user-service/src

# Set user
USER nodejs

# Expose the port the app runs on
EXPOSE 5002

# Set working directory for the application
WORKDIR /usr/src/app/notification-service

# Command to run the application
CMD ["npm", "start"]