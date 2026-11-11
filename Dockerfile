# ---- Small, production-ready image ----
FROM node:22-alpine

WORKDIR /app

# Install only production dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the app code
COPY src ./src
COPY public ./public

ENV PORT=3000
EXPOSE 3000

# Docker will mark the container unhealthy if /health stops responding
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Run as the non-root "node" user for security
USER node

CMD ["node", "src/server.js"]
