# Desktop (Electron)

Wraps the Expo web export in a native window for Windows and Mac. Electron 45 is the current supported major.

## Build locally

Node.js 22.12 or newer.

```bash
npm ci
node scripts/install-allowed.mjs   # Electron binary; ignore-scripts is on
npm run desktop:export             # expo export --platform web -> dist-web
npm run desktop:pack               # electron-builder (host OS)
```

`install-allowed.mjs` is required because `.npmrc` sets `ignore-scripts=true`. It runs Electron's own `install.js` only.

CI builds the Windows installer and the Mac DMG after the source checks pass, and attaches both when a GitHub Release is published.
