# Use the latest Node.js LTS (20.x) on Alpine Linux
FROM node:25-alpine

# Set the working directory
WORKDIR /home/node/app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the app port
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]