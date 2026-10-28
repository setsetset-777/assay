FROM node:25-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm@10
WORKDIR /repo

# --- Build: install workspace deps, build client, prune server for prod ---
FROM base AS build
# Copy manifests first so the install layer is cached
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/client/package.json apps/client/
COPY apps/server/package.json apps/server/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install --frozen-lockfile

COPY apps/client apps/client
COPY apps/server apps/server

RUN pnpm --filter ./apps/client build
RUN pnpm --filter ./apps/server build

# Self-contained server with prod deps only
RUN pnpm deploy --filter ./apps/server --prod /prod/server

# --- Runtime ---
FROM node:25-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /prod/server ./
COPY --from=build /repo/apps/client/dist ./public
USER node
EXPOSE 3000
CMD ["tsx", "index.ts"]
