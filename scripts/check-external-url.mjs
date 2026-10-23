import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { isAllowedExternalUrl } = require('../desktop/externalUrl.js');

const cases = [
  ['https://www.google.com/maps', true],
  ['https://example.com/path?q=1', true],
  ['tel:211', true],
  ['tel:+19705551212', true],
  ['mailto:help@example.org', true],
  ['http://example.com', false],
  ['file:///etc/passwd', false],
  ['smb://server/share', false],
  ['javascript:alert(1)', false],
  ['maps:0,0?q=Fort+Collins', false],
  ['', false],
  ['not a url', false],
];

let failed = false;
for (const [url, expected] of cases) {
  const actual = isAllowedExternalUrl(url);
  if (actual !== expected) {
    failed = true;
    console.error(`expected ${expected} for ${JSON.stringify(url)}, got ${actual}`);
  }
}

if (failed) process.exit(1);
console.log(`OK: ${cases.length} external URL cases`);
