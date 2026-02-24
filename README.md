# Compound PK

> Long-term investing, simplified.

A blog for Pakistanis on what it takes to achieve FIRE (Financial Independence, Retire Early).

## Development

```bash
npm install
npm run dev
```

## Quality + Build

```bash
npm run check
npm run build
```

## OpenAI Codex Skills

Installed curated skills:
- `openai-docs`
- `vercel-deploy`

Custom project skill created:
- Repo copy: `codex-skills/compound-pk-vercel-deploy`
- Installed copy: `C:\Users\abida\.codex\skills\compound-pk-vercel-deploy`

After installing new skills, restart Codex to pick them up.

## Deploy To Vercel

This project is configured for Vercel with:
- `@astrojs/vercel` adapter in `astro.config.mjs`
- Security headers in `vercel.json`

### 1) Prepare config

Update site URL before production deploy:
- `src/config/config.json` -> `site.base_url` to your real Vercel domain.

### 2) Local preflight

```bash
powershell -ExecutionPolicy Bypass -File .\codex-skills\compound-pk-vercel-deploy\scripts\preflight.ps1
```

### 3) First-time Vercel setup

```bash
npx vercel login
npx vercel link
```

### 4) Preview deploy (default)

```bash
powershell -ExecutionPolicy Bypass -File .\codex-skills\compound-pk-vercel-deploy\scripts\deploy-vercel.ps1
```

### 5) Production deploy

```bash
powershell -ExecutionPolicy Bypass -File .\codex-skills\compound-pk-vercel-deploy\scripts\deploy-vercel.ps1 -Prod
```

### 6) Vercel dashboard checks

Project settings should be:
- Framework Preset: `Astro`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## License

MIT
