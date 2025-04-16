FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

ARG GRAPHQL_API
ENV GRAPHQL_API=${GRAPHQL_API}

# Build the application
RUN npm run build

# Install a simple server to serve static content
RUN npm install -g serve

# Expose the port that serve will use
EXPOSE 3000

# Start the server
CMD ["serve", "-s", "dist", "-p", "3000"]