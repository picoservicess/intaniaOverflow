# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/thread-service

# Copy package.json and package-lock.json into the working directory
COPY thread-service/package*.json /usr/src/thread-service

# Install dependencies
RUN npm install

# Copy the rest of the application code into the working directory
ADD thread-service /usr/src/thread-service

# Copy the proto folder into the project (one level up from thread-service)
RUN mkdir -p /usr/src/proto
ADD proto/*.proto /usr/src/proto

# Expose the port the app runs on
EXPOSE 30043

# Command to run the application
CMD ["npm", "start"]
