/**
 * Builds the Calci web app (../CALCI-W) for native shells and copies it into www/.
 *
 *   node scripts/sync-web.mjs            # build CALCI-W and copy
 *   node scripts/sync-web.mjs --no-build # copy an existing ../CALCI-W/dist-native
 *
 * Set CALCI_WEB_DIR to point at the web repo if it is not a sibling folder.
 */
import { execSync } from 'node:child_process';
import { cpSync, existsSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const web = resolve(process.env.CALCI_WEB_DIR ?? '../CALCI-W');
const www = resolve('www');
if (!existsSync(web)) {
  console.error(`Web project not found at ${web}. Clone https://github.com/flamekaizen/CALCI-W next to this repo or set CALCI_WEB_DIR.`);
  process.exit(1);
}
if (!process.argv.includes('--no-build')) {
  if (!existsSync(resolve(web, 'node_modules'))) execSync('npm ci', { cwd: web, stdio: 'inherit' });
  execSync('npm run build:native', { cwd: web, stdio: 'inherit' });
}
const dist = resolve(web, 'dist-native');
if (!existsSync(dist)) {
  console.error('dist-native not found — run without --no-build.');
  process.exit(1);
}
rmSync(www, { recursive: true, force: true });
cpSync(dist, www, { recursive: true });
// Not needed inside the app bundle
rmSync(resolve(www, 'embed-demo.html'), { force: true });
writeFileSync(resolve(www, '.synced'), new Date().toISOString());
console.log(`Copied ${dist} → ${www}`);
