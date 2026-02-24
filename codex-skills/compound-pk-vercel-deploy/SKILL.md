---
name: compound-pk-vercel-deploy
description: Deploy and maintain the Compound PK Astro website on Vercel with repeatable checks. Use when Codex needs to configure Vercel deployment, run preflight quality and build checks, update project URL metadata, or execute preview/production deploy commands for this repository.
---

# Compound PK Vercel Deploy

## Overview

Use this skill to make Vercel deployment repeatable for the Compound PK Astro site.

## Deployment Workflow

1. Confirm project metadata:
- Ensure `src/config/config.json` has the correct `site.base_url` for the target Vercel domain.
- Keep `astro.config.mjs` configured with `@astrojs/vercel` adapter.

2. Run local preflight:
- Execute `scripts/preflight.ps1` from this skill.
- Resolve any `astro check` or build failures before deployment.

3. Run Vercel deploy:
- Execute `scripts/deploy-vercel.ps1` for preview deploys.
- Pass `-Prod` only when explicitly asked for production deployment.

4. Validate deployment settings:
- Confirm Vercel project uses `Framework Preset: Astro`.
- Confirm `Build Command: npm run build` and `Output Directory: dist`.
- Confirm required environment variables are set in Vercel before deployment.

## Commands

```powershell
# Preflight checks in repository root
powershell -ExecutionPolicy Bypass -File .\codex-skills\compound-pk-vercel-deploy\scripts\preflight.ps1

# Preview deploy (recommended default)
powershell -ExecutionPolicy Bypass -File .\codex-skills\compound-pk-vercel-deploy\scripts\deploy-vercel.ps1

# Production deploy (only when requested)
powershell -ExecutionPolicy Bypass -File .\codex-skills\compound-pk-vercel-deploy\scripts\deploy-vercel.ps1 -Prod
```

## References

- Use `references/deployment-checklist.md` for repository-specific deployment checks.
