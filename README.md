# Amplify Demo App

A tiny **Vite + React** webapp used to demonstrate deploying from **GitHub** to
**AWS Amplify Hosting** with **GitHub Actions** for CI.

> The app itself is intentionally trivial. The interesting part is the pipeline
> around it: `git push` → CI checks → automatic build & deploy to a global CDN.

---

## Architecture

```
  Developer                GitHub                     AWS Amplify Hosting
 ┌─────────┐   git push  ┌──────────────────────┐   ┌───────────────────────┐
 │  local  │ ──────────► │ repo (main / PRs)    │   │  build (amplify.yml)  │
 │  edits  │             │                      │   │  ├─ npm ci            │
 └─────────┘             │  GitHub Actions (CI) │   │  ├─ npm run build     │
                         │  ├─ lint             │   │  └─ deploy → CDN+HTTPS │
                         │  ├─ test             │──►│                       │
                         │  └─ build            │   │  + per-PR previews    │
                         └──────────────────────┘   └───────────────────────┘
       CI: validate every push/PR        CD: Amplify auto-deploys `main`
```

- **CI = GitHub Actions** — runs `lint`, `test`, `build` on every push and PR.
- **CD = AWS Amplify** — watches the connected branch and, on each push,
  rebuilds using `amplify.yml` and deploys to its managed CDN with free HTTPS.

This split means GitHub never needs AWS credentials. (If you'd rather have
Actions do the deploy too, see `.github/workflows/ci-deploy.yml`.)

---

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # run the unit tests once
npm run lint       # eslint
npm run build      # production build → ./dist
npm run preview    # serve the production build locally
```

Requires Node 20+.

---

## Deploy to AWS Amplify (Git integration — recommended)

1. Push this repo to GitHub.
2. AWS Console → **Amplify** → **Create new app** → **Deploy with GitHub**.
3. Authorize AWS to access GitHub, then pick this repo + the `main` branch.
4. Amplify auto-detects `amplify.yml` (build settings). Confirm and deploy.
5. First build runs in ~1–2 min; you get a URL like
   `https://main.d1234abcd.amplifyapp.com`.

That's it — from now on **every push to `main` auto-deploys**, and every pull
request gets its own **preview deployment** (enable "Preview" in app settings).

### Key files

| File                              | Purpose                                            |
| --------------------------------- | -------------------------------------------------- |
| `amplify.yml`                     | Amplify build spec (how to build + what to deploy) |
| `.github/workflows/ci.yml`        | GitHub Actions CI (lint / test / build)            |
| `.github/workflows/ci-deploy.yml` | Optional: CI **and** deploy entirely in Actions    |
| `vite.config.js`                  | Vite + Vitest config                               |

---

## SPA routing note

This demo has a single route, so no rewrite is needed. If you add client-side
routing (e.g. React Router), add an Amplify **rewrite** so deep links work:

- Source: `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>`
- Target: `/index.html`
- Type: `200 (Rewrite)`

Set this under Amplify → App settings → **Rewrites and redirects**.
