# Use an official Node.js LTS image
FROM node:lts-alpine

# Create app directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the project files
COPY . .

USER node

# Start the server
CMD ["node", "app.js"]

# Expose the port the app runs on
EXPOSE 8000