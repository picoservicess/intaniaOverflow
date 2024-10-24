# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/notification-service

# Copy package.json and package-lock.json to the working directory
COPY notification-service/package*.json /usr/src/notification-service

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY notification-service/  /usr/src/notification-service

# Copy the user-service/libs directory
RUN mkdir -p /usr/src/user-service/src/libs
COPY user-service/src/libs/token.ts /usr/src/user-service/src/libs/token.ts
COPY user-service/package*.json /usr/src/user-service

# Create a tsconfig.json for the libs.ts compilation
RUN echo '{ \
  "compilerOptions": { \
  "target": "ES2020", \
  "module": "ESNext", \
  "moduleResolution": "bundler", \
  "esModuleInterop": true, \
  "outDir": "dist", \
  "strict": true, \
  "declaration": true \
  }, \
  "include": ["/usr/src/user-service/src/token.ts"] \
  }' > /usr/src/user-service/tsconfig.json

# Compile libs.ts to mjs
RUN cd /usr/src/user-service && \
  npm install
# npm install -g typescript && \
# tsc --project tsconfig.json && \
# mv dist/token.js dist/token.mjs && \
# cp dist/token.mjs ./token.mjs && \
# cp dist/token.d.ts ./token.d.ts

RUN cd /usr/src/notification-service

# Expose the port the app runs on
EXPOSE 5002

# Command to run the application
CMD ["npm", "start"]