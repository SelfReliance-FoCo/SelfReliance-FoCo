# Self-Reliance FoCo

Free directory of food, shelter, crisis help, jobs, and other services in Larimer County. It runs on the web, on Android, and as a Windows and Mac desktop app. There are no accounts and no tracking. Listings stay on the device.

Copyright © 2026 Justin Pulford. See [LICENSE](LICENSE).

## Data updates

Listings live in `src/data/resources.json`. Open-now places are in `src/data/openNowPlaces.ts`. Trash zones are in `src/data/trashZones.json`.

When those files change, set `DATA_AS_OF` in `src/lib/releaseInfo.ts` to the review date (`YYYY-MM-DD`). The app shows that date, the version from `app.json`, and the web build date in the header.

Then run:

```bash
npm run check:all
```

That validates listings, typechecks, and runs every `check:*` script, including contrast.

## Development

Node.js 22.12 or newer.

```bash
npm ci
npm start
```

`npm ci` does not run dependency install scripts (see `.npmrc`). The web app does not need them. Desktop builds do:

```bash
npm ci
node scripts/install-allowed.mjs
npm run desktop:export
npm run desktop:pack
```

`install-allowed.mjs` downloads the Electron binary and, on Windows, copies electron-winstaller's 7-Zip tool. Those are the only install scripts this repo runs.

The web export adds a Content-Security-Policy meta tag and stamps `EXPO_PUBLIC_BUILD_DATE`. GitHub Actions publishes that export and builds the desktop installers only after `npm run check:all` passes.
