# Use multi-stage build to minimize final image size
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package files first to leverage Docker cache
COPY user-service/package*.json ./user-service/

# Install dependencies in user-service
WORKDIR /usr/src/app/user-service
RUN npm install

# Copy necessary source files
COPY user-service /usr/src/app/user-service/
COPY proto/*.proto /usr/src/app/proto/

# Start fresh with a new base image for the final stage
FROM node:20-alpine

# Create non-root user for security
RUN addgroup -g 1001 nodejs && \
  adduser -S -u 1001 -G nodejs nodejs

# Set working directory
WORKDIR /usr/src/app

# Copy built artifacts from builder stage
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/user-service/node_modules ./user-service/node_modules
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/user-service ./user-service
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/proto ./proto

# Set user
USER nodejs

# Expose the port the app runs on
EXPOSE 5005

# Set working directory for the application
WORKDIR /usr/src/app/user-service

# Command to run the application
CMD ["npm", "start"]