FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .
ARG GRAPHQL_API
# Build the app
RUN npm run build

# Set the default command to run in development mode
CMD ["npm", "run", "dev"]

# Expose the default Vite development port
EXPOSE 5173