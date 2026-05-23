# BancoXYZ

A banking web application built with React 19, React Router v7, TanStack Query, Zustand, and Tailwind CSS v4. Bundled with Rsbuild.

## Prerequisites

- **Node.js** v18 or higher (v22 recommended)
- **npm** v9 or higher

## Installation

Install dependencies:

```bash
npm install
```

## Environment variables

Copy the example file and fill in the values:

```bash
cp .env.example .env
```

| Variable | Purpose |
|---|---|
| `VITE_API_URL_AUTH` | Auth API base URL |
| `VITE_API_URL_BALANCE` | Balance API base URL |
| `VITE_API_URL_TRANSFER` | Transfer create API base URL |
| `VITE_API_URL_TRANSFER_LIST` | Transfer list API base URL |
| `VITE_E2E_USER_MAIL` | E2E test user email |
| `VITE_E2E_USER_PASSWORD` | E2E test user password |

`VITE_E2E_USER_MAIL` and `VITE_E2E_USER_PASSWORD` are only required to run the e2e suite.

## Running the app

Start the dev server (opens a browser tab automatically):

```bash
npm run dev
```

The app is available at [http://localhost:3000](http://localhost:3000).

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Linting and formatting

BancoXYZ uses [Biome](https://biomejs.dev) for linting and formatting.

Check and auto-fix lint issues:

```bash
npm run check
```

Format files:

```bash
npm run format
```

## Unit and integration tests

Run the Jest suite:

```bash
npm test
```

Run with coverage report:

```bash
npm run test:coverage
```

## E2E tests

End-to-end tests use [Playwright](https://playwright.dev) and run against the real AWS backend. Most tests mock downstream API responses to stay deterministic; the auth tests exercise the real login endpoint.

### 1. Install browser binaries

This is a one-time step. Playwright needs its own Chromium build — the system browser is not used:

```bash
npx playwright install chromium
```

If you also want to use the Playwright UI (`test:e2e:ui`), install its dependencies:

```bash
npx playwright install-deps chromium
```

### 2. Set environment variables

Make sure `.env` has all six variables listed in the [Environment variables](#environment-variables) section above, including `VITE_E2E_USER_MAIL` and `VITE_E2E_USER_PASSWORD`.

### 3. Run the tests

```bash
# Run all tests headlessly (CI-style)
npm run test:e2e

# Open the Playwright interactive UI (trace viewer, time-travel debugging)
npm run test:e2e:ui

```

The dev server starts automatically before the tests run and shuts down after. If you already have it running (`npm run dev`), Playwright will reuse it.

### Auth session caching

On the first run, Playwright creates an authenticated browser session and caches it at `e2e/.auth/user.json` (gitignored). Subsequent runs reuse this file — if a test starts failing with unexpected redirects to `/login`, delete the file and rerun:

```bash
rm e2e/.auth/user.json
npm run test:e2e
```

### Test structure

| Directory | Project | Description |
|---|---|---|
| `e2e/auth/` | unauthenticated | Login form, route protection |
| `e2e/auth/logout.spec.ts` | authenticated | Logout flow |
| `e2e/dashboard/` | authenticated | Balance display and error state |
| `e2e/transactions/` | authenticated | Transfer list and create flow |
| `e2e/navigation/` | authenticated | Sidebar links and active state |
