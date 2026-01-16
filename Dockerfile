FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS build
COPY --from=install /app/node_modules ./node_modules
COPY . .

FROM base AS release
COPY --from=install /app/node_modules ./node_modules
COPY --from=build /app .

RUN mkdir -p /app/data

USER bun
EXPOSE 3000

ENV DATABASE_URL=/app/data/app.db

ENTRYPOINT ["bun", "run", "src/index.ts"]
