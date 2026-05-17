---
sidebar_position: 1
---

# Introduction

Multimediary is a personal physical media library management system. It catalogues movies stored on DVDs, Blu-rays, and hard drives, enriches them with metadata from [TMDb](https://www.themoviedb.org), and lets you search, browse, and manage your entire collection from a single interface.

## What it does

- **Catalogue** — track movies by title, genre, actor, director, category, year, and quality
- **Physical inventory** — record which movie lives on which disk (DVD, Blu-ray, HDD) and browse all movies on a given disk
- **TMDb integration** — auto-import full metadata (poster, synopsis, cast, director, genres) from The Movie Database
- **Admin panel** — manage the library with role-based access control (super_admin, admin, editor, analyst)
- **Public browser** — a cinematic dark-themed site where anyone can explore the collection by genre, category, cast, and more

## Repository structure

```
multimediary/
├── backend/    Rails 8.1 API-only backend (PostgreSQL)
├── frontend/   Next.js 16 app — public browser + admin panel (port 3000)
├── docs/       This documentation site (Docusaurus 3, port 3002)
└── deploy/     Docker Compose, Caddyfile, and bootstrap scripts
```

## Stack at a glance

| Layer | Technology |
|---|---|
| API | Rails 8.1 (API-only), PostgreSQL 17 |
| Auth | Devise + devise-jwt, CanCanCan |
| Serialization | Blueprinter |
| Search | Ransack + Kaminari |
| Frontend | Next.js 16, React 19, Tailwind CSS v4 |
| State | TanStack Query v5, Zustand |
| Proxy | Caddy 2 (automatic HTTPS, reverse proxy) |
| Deploy | Docker, GitHub Actions, GHCR, Oracle VM |

## What is not yet built

- Video streaming from NAS
- Game collection management
- Public user accounts / favourites
