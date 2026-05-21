# Vaultiq

Personal finance workspace — track credit cards, loans, savings goals, and insights.

**Live site:** [https://stefan1230.github.io/Vaultiq/](https://stefan1230.github.io/Vaultiq/)

## Local development

```bash
npm install
npm start
```

## Deploy to GitHub Pages

### Option A — Automatic (recommended)

1. Push this repo to `https://github.com/stefan1230/Vaultiq`
2. On GitHub: **Settings → Pages → Build and deployment → Source:** choose **GitHub Actions**
3. Push to `master` (or `main`) — the workflow in `.github/workflows/deploy.yml` builds and deploys automatically

### Option B — Manual deploy

```bash
npm run deploy
```

This runs `npm run build` and publishes the `build` folder to the `gh-pages` branch.

## Supabase (cloud sync)

If login fails on the live site, add this URL in the Supabase dashboard:

**Authentication → URL configuration → Redirect URLs:**

```
https://stefan1230.github.io/Vaultiq/**
```

## Changing the GitHub Pages URL

If the repo name changes, update `homepage` in `package.json` and `PUBLIC_URL` in `.github/workflows/deploy.yml` to match `/YourRepoName`.
