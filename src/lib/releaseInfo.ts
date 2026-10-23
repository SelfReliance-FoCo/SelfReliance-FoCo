import appJson from '../../app.json';

/** Marketing version from app.json. Shown so a web update is visible. */
export const APP_VERSION = appJson.expo.version;

/**
 * Day the bundled directory files last changed (resources, open-now, trash).
 * Update this when listings are edited.
 */
export const DATA_AS_OF = '2026-09-24';

/** Set by the web export. Local `expo start` has no stamp. */
export const BUILD_DATE = process.env.EXPO_PUBLIC_BUILD_DATE || 'local';
