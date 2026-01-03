# Use the official Bun image
FROM oven/bun:latest

WORKDIR /app

# Install dependencies first (for better build caching)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy the source code
COPY . .

# Ensure the port matches your config
EXPOSE 2834

# Start the server
CMD ["bun", "run", "src/app.ts"]