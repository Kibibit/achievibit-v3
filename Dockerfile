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

COPY . .
RUN pnpm install

# Copy the rest of the application code
COPY ./client ./client
COPY ./server ./server

# Copy server/login-app folder
COPY ./server/login-app ./server/login-app

# Build the client application
RUN cd client && pnpm run build:prod

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
COPY --from=build /app/server/achieveebeet.mp3 ./
COPY --from=build /app/server/package.json ./
COPY --from=build /app/server/pnpm-lock.yaml ./
COPY --from=build /app/server/client ./client
COPY --from=build /app/server/login-app ./login-app

# Create keys folder where the host can mount secrets
RUN mkdir -p ./server/keys

# Set environment variable to skip Chromium download
ENV PUPPETEER_SKIP_DOWNLOAD=true
# ENV HUSKY=0
ENV HUSKY_SKIP_HOOKS=true

# Install only production dependencies
RUN pnpm install --prod

# Expose the application's port
EXPOSE 10102

# Start the server application
CMD ["pnpm", "start:prod"]
