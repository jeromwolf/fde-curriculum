# Stage 1: Dependencies
FROM node:20-slim AS deps
RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# Stage 2: Build
FROM node:20-slim AS builder
RUN apt-get update && apt-get install -y openssl libssl-dev git && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Git commit hash for version display
ARG GIT_COMMIT_HASH
ENV NEXT_PUBLIC_GIT_COMMIT_HASH=${GIT_COMMIT_HASH}
ENV NEXT_TELEMETRY_DISABLED 1
# 토스페이먼츠 클라이언트 키 (빌드 시점에 필요)
ENV NEXT_PUBLIC_TOSS_CLIENT_KEY="test_ck_lpP2YxJ4K877JAdv7KX8RGZwXLOb"
RUN npx prisma generate
RUN npm run build

# Stage 3: Production
FROM node:20-slim AS runner
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
