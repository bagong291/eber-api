# Stage 1: Build the application
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build the application (if needed)
# RUN npm run build

# Stage 2: Production image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built application from builder stage
COPY --from=builder /app .

# Create directory for uploads
RUN mkdir -p /app/uploads

# Expose the port the app runs on
EXPOSE 3022

# Install bcrypt for seeders
RUN apk add --no-cache python3 make g++

# Copy seeders
COPY src/seeders ./src/seeders

# Create a script to run migrations, seeders, and start the app
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Command to run the application
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]
