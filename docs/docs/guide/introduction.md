---
sidebar_position: 1
---

# Introduction

Multimediary is a personal physical media library management system.
It catalogues movies stored on DVDs and hard drives, enriches them with
metadata from [TMDb](https://www.themoviedb.org), and lets you search,
browse, and manage your entire collection from a single interface.

## What it does

- **Catalogue** — track movies by title, genre, actor, director, category, year, and quality
- **Physical inventory** — record which movie lives on which disk (DVD, Blu-ray, HDD) and browse all movies on a given disk
- **TMDb integration** — auto-import full metadata (poster, plot, cast, director, genres) from The Movie Database
- **Admin panel** — manage the library with role-based access control (super_admin, admin, editor, analyst)

## What it will do (planned)

- Stream video from a NAS directly in the browser
- Manage PC game collections alongside movies
- Support additional media formats

## Repository structure

```
multimediary/
├── backend/    Rails 8.1 API-only backend (PostgreSQL)
├── docs/       This documentation site (Docusaurus)
└── frontend/   Next.js admin panel (not yet started)
```
