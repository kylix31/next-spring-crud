FROM node:18-alpine AS base

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the source code
COPY . .

# Build the Next.js application
RUN npm run build

# Start the application
CMD ["npm", "start"]

