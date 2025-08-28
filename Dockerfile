# Use official Node.js LTS Alpine image
FROM node:22-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the source code
COPY . .

# Expose the port
EXPOSE 5000

# Start the server with the correct file
CMD ["node", "index.js"]
