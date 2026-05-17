# syntax=docker/dockerfile:1
# Builds the Docusaurus static site and serves it with Nginx.
#
# Build from the docs/ directory:
#   docker build -t docs .
#   docker run -p 8080:80 docs
#
# The generated API reference files (docs/api-reference/) must be committed
# before building. Run `npm run gen-api-docs` locally when openapi.yaml changes.

ARG NODE_VERSION=20

# ── Build stage ───────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --frozen-lockfile

COPY . .
RUN npm run build

# ── Serve stage ───────────────────────────────────────────────────────────────
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
# Docusaurus builds to /app/build/ — copy into /docs/ so Nginx serves it at /docs/
COPY --from=build /app/build /usr/share/nginx/html/docs

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
