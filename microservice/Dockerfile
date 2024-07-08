FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build 

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 core 
USER core

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env.example ./.env.example
COPY --from=builder /app/package.json .

COPY --from=builder --chown=core:nodejs /app/dist ./dist

EXPOSE 3030
CMD ["node", "."]