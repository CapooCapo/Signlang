# Stage 1: Build dependencies
FROM node:20-slim AS development

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install Angular CLI globally
RUN npm install -g @angular/cli@latest

# Copy package files
COPY package*.json ./

# Clean cache and install dependencies
# We use --legacy-peer-deps if needed for experimental versions
RUN npm cache clean --force && \
    rm -f package-lock.json && \
    npm install --loglevel notice --legacy-peer-deps && \
    npm install typescript@5.8.3 --save-dev --legacy-peer-deps

# Copy project files
COPY . .

# Ensure correct permissions
RUN mkdir -p /app/.angular && chown -R node:node /app

# Add entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

USER node

ENTRYPOINT ["entrypoint.sh"]

EXPOSE 4200

# Use polling for hot-reload in Docker environments
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--poll", "2000"]

# Stage 2: Production Build
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=production

# Stage 3: Production Server
FROM nginx:stable-alpine AS production
COPY --from=build /app/dist/web/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
