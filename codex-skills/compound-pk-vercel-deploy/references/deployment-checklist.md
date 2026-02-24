# Compound PK Deployment Checklist

## Repository Checks

1. Confirm `package.json` includes `@astrojs/vercel`.
2. Confirm `astro.config.mjs` contains `adapter: vercel()`.
3. Confirm `vercel.json` includes required security headers.
4. Confirm `src/config/config.json` has correct:
- `site.base_url` (your Vercel domain)
- `site.base_path` (usually `/`)
- `site.trailing_slash` (match preferred URL strategy)

## Vercel Project Checks

1. Framework preset: `Astro`.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Install command: `npm install`.
5. Production branch: set to your default branch.
6. Environment variables: add any needed by content integrations or analytics.

## Release Flow

1. Run preflight script.
2. Deploy preview and validate content, navigation, and metadata.
3. Deploy production when explicitly requested.
