import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const env = {
  ...process.env,
  EXPO_PUBLIC_BUILD_DATE: process.env.EXPO_PUBLIC_BUILD_DATE || new Date().toISOString().slice(0, 10),
};
const cli = join(root, 'node_modules', 'expo', 'bin', 'cli');
const exported = spawnSync(process.execPath, [cli, 'export', '--platform', 'web', '--output-dir', 'dist-web'], {
  cwd: root,
  env,
  stdio: 'inherit',
});
if (exported.status !== 0) process.exit(exported.status ?? 1);

const indexPath = join(root, 'dist-web', 'index.html');
const csp = [
  "default-src 'self'",
  "base-uri 'none'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
].join('; ');

let html = readFileSync(indexPath, 'utf8');
if (!html.includes('Content-Security-Policy')) {
  const meta = `<meta http-equiv="Content-Security-Policy" content="${csp}">`;
  if (/<head[^>]*>/i.test(html)) {
    html = html.replace(/<head[^>]*>/i, (head) => `${head}\n    ${meta}`);
  } else {
    html = `${meta}\n${html}`;
  }
  writeFileSync(indexPath, html);
}
writeFileSync(join(root, 'dist-web', '.nojekyll'), '');
console.log(`Web export stamped ${env.EXPO_PUBLIC_BUILD_DATE}`);
