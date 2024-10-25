# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/api-gateway

# Copy package.json and package-lock.json into the working directory
COPY api-gateway/package*.json /usr/src/api-gateway

# Install dependencies
RUN npm install

# Copy the rest of the application code into the working directory
ADD api-gateway /usr/src/api-gateway

# Copy the proto folder into the project (one level up from api-gateway)
RUN mkdir -p /usr/src/proto
ADD proto/*.proto /usr/src/proto

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["npm", "start"]
