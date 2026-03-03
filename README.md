# Green Gables — Operations Platform

Single-page operations hub for Green Gables Florist & Farm. Manages the full event lifecycle from client inquiry through post-event closure.

## What It Does

15 modules, one screen: Clients → Estimates → Events → Catalog → Wholesale → Schedule → Assignments → Tasks → Time Clock → Overhead → Venues → Rentals → Whiteboard → Team Board. All data persists in browser localStorage.

## Go Live on GitHub Pages

### Step 1 — Create the repo

Go to [github.com/new](https://github.com/new) and create a new repository named `green-gables-ops`. Set it to **Public**. Do not add a README (we have one).

### Step 2 — Push the code

Open a terminal on your computer. Run these commands one at a time:

```
git clone https://github.com/YOUR-USERNAME/green-gables-ops.git
```

Copy all the project files into that folder (everything from this download — `src/`, `index.html`, `package.json`, `vite.config.js`, `.github/`, `.gitignore`).

Then:

```
cd green-gables-ops
git add .
git commit -m "v12 — production ready"
git push origin main
```

### Step 3 — Enable GitHub Pages

1. Go to your repo on GitHub
2. Click **Settings** (gear icon, top menu)
3. Click **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. That's it — the workflow file will handle the rest

### Step 4 — Wait ~2 minutes

GitHub Actions will build and deploy automatically. Watch progress under the **Actions** tab in your repo.

When the green check appears, your site is live at:

```
https://YOUR-USERNAME.github.io/green-gables-ops/
```

### Every future update

Edit files, commit, push. The site rebuilds automatically.

```
git add .
git commit -m "description of change"
git push origin main
```

## If You Don't Have Git Installed

### Option A — GitHub Desktop (easiest)

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Sign in with your GitHub account
3. Create new repo → name it `green-gables-ops`
4. Copy project files into the folder it creates
5. Click **Commit to main** → **Push origin**
6. Go to Settings → Pages → Source: GitHub Actions

### Option B — Upload directly on GitHub

1. Create repo at [github.com/new](https://github.com/new)
2. Click **uploading an existing file**
3. Drag all project files in (maintain folder structure)
4. Commit
5. Then manually create `.github/workflows/deploy.yml` via Add File → Create New File
6. Settings → Pages → Source: GitHub Actions

## Important Notes

**Data lives in your browser.** localStorage means your data stays on whichever device/browser you use. Different browser = different data. Clear browser data = data gone. This is fine for a single-operator shop. If you need multi-device sync later, that's a database conversation.

**Backup your data.** Use the CSV export buttons throughout the app regularly. Events, clients, estimates, and assignments all have export.

**The vite.config.js base path matters.** If your repo is named something other than `green-gables-ops`, update the `base` value in `vite.config.js` to match: `base: '/your-repo-name/'`

## Project Structure

```
green-gables-ops/
├── index.html              ← HTML shell
├── package.json            ← Dependencies + scripts
├── vite.config.js          ← Build config
├── .gitignore
├── .github/
│   └── workflows/
│       └── deploy.yml      ← Auto-deploy on push
└── src/
    ├── main.jsx            ← React entry point
    └── App.jsx             ← The entire app (4,248 lines)
```

## Local Development (optional)

If you want to run it on your computer for testing:

```
npm install
npm run dev
```

Opens at `http://localhost:5173`. Hot-reloads on save.
