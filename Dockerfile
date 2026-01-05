# Use Node.js as the base image
FROM node:20-slim

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy local code to the container image
COPY . .

# Build the frontend (Vite)
RUN npm run build

# Expose the port the app runs on
EXPOSE 5000

# Run the web service on container startup
CMD [ "npm", "start" ]
