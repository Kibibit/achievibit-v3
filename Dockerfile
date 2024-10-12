# =======================
# Build Stage
# =======================
FROM node:20 AS build

# Install pnpm globally
RUN npm install -g pnpm

ENV PUPPETEER_SKIP_DOWNLOAD=true
# ENV HUSKY=0
ENV HUSKY_SKIP_HOOKS=true

# Set the working directory
WORKDIR /app

# Copy package and lock files for both client and server
COPY ./client/package.json ./client/pnpm-lock.yaml ./client/
COPY ./server/package.json ./server/pnpm-lock.yaml ./server/

# Install dependencies
RUN cd client && pnpm install
RUN cd server && pnpm install

# Copy the rest of the application code
COPY ./client ./client
COPY ./server ./server

# Copy the achievibit-beta.private-key.pem file from the server root
COPY ./server/achievibit-beta.private-key.pem ./server
# Copy server/login-app folder
COPY ./server/login-app ./server/login-app

# Build the client application
RUN cd client && pnpm run build

# Build the server application
RUN cd server && pnpm run build

# =======================
# Runtime Stage
# =======================
FROM node:20-alpine AS runtime

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy the built server and client files
COPY --from=build /app/server/dist ./dist
COPY --from=build /app/server/package.json ./
COPY --from=build /app/server/pnpm-lock.yaml ./
COPY --from=build /app/server/client ./client
COPY --from=build /app/server/achievibit-beta.private-key.pem ./
COPY --from=build /app/server/login-app ./login-app

# Set environment variable to skip Chromium download
ENV PUPPETEER_SKIP_DOWNLOAD=true
# ENV HUSKY=0
ENV HUSKY_SKIP_HOOKS=true

# Install only production dependencies
RUN pnpm install

# Expose the application's port
EXPOSE 3003

# Start the server application
CMD ["pnpm", "start:prod"]
