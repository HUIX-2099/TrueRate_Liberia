# Feature additions for platform

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/victor-colemans-projects/v0-feature-additions-for-platform)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/iQjiONKZxIv)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/victor-colemans-projects/v0-feature-additions-for-platform](https://vercel.com/victor-colemans-projects/v0-feature-additions-for-platform)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/iQjiONKZxIv](https://v0.app/chat/iQjiONKZxIv)**

## Development

- **`npm run dev`** — Start dev server (Webpack; avoids Turbopack chunk-load errors).
- **`npm run dev:turbo`** — Start dev server with Turbopack (faster, but may hit ChunkLoadError).
- **`npm run dev:clean`** — Clear `.next` cache and start with Webpack (use if you see chunk-load errors).

### ChunkLoadError or URLs like `/_next//_next/static/...`

1. Stop the dev server, run `rm -rf .next`, then `npm run dev` again.
2. **Unregister the service worker** (especially if you ever ran `next start` on localhost): Chrome DevTools → **Application** → **Service Workers** → Unregister, then **Clear site data** for `localhost:3000`.
3. Hard refresh or try an incognito window (rules out extensions and stale cache).
4. Update Next: `npm update next` (patch releases often fix chunk path bugs).

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
