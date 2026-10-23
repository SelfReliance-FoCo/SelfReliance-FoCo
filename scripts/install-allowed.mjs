import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function run(script, cwd) {
  if (!existsSync(script)) {
    console.error(`Missing allowed install script: ${script}`);
    process.exit(1);
  }
  const result = spawnSync(process.execPath, [script], { cwd, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

// Electron 45 downloads its binary from install.js instead of a postinstall hook.
run(join(root, 'node_modules', 'electron', 'install.js'), root);

if (process.platform === 'win32') {
  const winstaller = join(root, 'node_modules', 'electron-winstaller');
  run(join(winstaller, 'script', 'select-7z-arch.js'), winstaller);
}

console.log('Allowed install scripts finished.');
