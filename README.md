# Compound PK

Long-term investing content for Pakistanis, built with Astro.

## Quick Start

```bash
npm install
npm run dev
```

Open: `http://localhost:4321`

## Key Features

- Built with Astro for fast static pages
- Markdown and MDX content support
- Blog taxonomy pages (authors, categories, tags)
- Client-side search with Fuse.js
- SEO-ready metadata, sitemap, and robots support
- Config-driven site settings in `src/config/config.json`

## Common Commands

```bash
npm run dev      # local development
npm run check    # Astro type/content checks
npm run build    # production build to dist/
npm run preview  # preview built site locally
```

## Project Structure

- `src/content/posts/` blog posts
- `src/content/pages/` static pages
- `src/content/authors/` author profiles
- `src/config/config.json` site metadata and base URL
- `public/` static assets

## Deployment

This repo is platform-agnostic. Connect the GitHub repository to your hosting provider and use:

- Build command: `npm run build`
- Output directory: `dist`
