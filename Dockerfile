FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Set build-time environment variable
ARG VITE_GRAPHQL_API
ENV VITE_GRAPHQL_API=${VITE_GRAPHQL_API}

# Build the application with env var available
RUN npm run build

# Install a simple server to serve static content
RUN npm install -g serve

# Create a runtime environment script
RUN echo '#!/bin/sh' > /app/run.sh && \
    echo 'echo "window.ENV = { VITE_GRAPHQL_API: \"$VITE_GRAPHQL_API\" };" > /app/dist/env-config.js' >> /app/run.sh && \
    echo 'serve -s dist -p 3000' >> /app/run.sh && \
    chmod +x /app/run.sh

# Expose the port
EXPOSE 3000

# Start the server with the runtime script
CMD ["/app/run.sh"]