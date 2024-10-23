# Use the official Node.js image as the base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/voting-service

# Copy package.json and package-lock.json
COPY voting-service/package*.json /usr/src/voting-service

# Install dependencies
RUN npm install

# Copy the rest of the application code
ADD voting-service /usr/src/voting-service

# Copy the proto folder into the project (one level up from voting-service)
RUN mkdir -p /usr/proto
ADD proto/*.proto /usr/proto

# Expose the port the app runs on
EXPOSE 5006

# Command to run the application
CMD ["npm", "run", "start"]