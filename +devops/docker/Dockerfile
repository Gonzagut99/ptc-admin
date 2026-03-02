FROM node:25-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm
RUN pnpm i


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

#
# Variables de entorno públicas, que inician con NEXT_PUBLIC_ y que estarán disponibles en el código del cliente.
#
# Se definen como `ARG NEXT_PUBLIC_MY_VARIABLE` y su valor se establece en el archivo Jenkinsfile
#
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_JAVA_API_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_FARO_URL
ARG NEXT_PUBLIC_FARO_APP_NAME
ARG NEXT_PUBLIC_DEPLOYMENT_NUMBER
ARG NEXT_PUBLIC_CD_ENVIRONMENT

RUN npm i -g pnpm
RUN pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

RUN apk add curl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
