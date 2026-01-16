FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS install
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS build
COPY --from=install /app/node_modules ./node_modules
COPY . .

RUN mkdir -p /app/data
ENV DATABASE_URL=/app/data/app.db
RUN bun run db:push
RUN bun run db:seed

FROM base AS release
COPY --from=install /app/node_modules ./node_modules
COPY --from=build /app .

USER bun
EXPOSE 3000

ENV DATABASE_URL=/app/data/app.db

ENTRYPOINT ["bun", "run", "src/index.ts"]
