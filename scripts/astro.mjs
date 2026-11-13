// Cross-platform launcher: sets environment variables WITHOUT shell syntax
// (so it behaves the same on Windows cmd/PowerShell, macOS and Linux).
//   node scripts/astro.mjs preview   -> builds every page template with labelled sample content
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const mode = process.argv[2];
const env = { ...process.env };
if (mode === 'preview') env.PREVIEW_DESIGN = '1';
else { console.error('Usage: node scripts/astro.mjs preview'); process.exit(1); }

const require = createRequire(import.meta.url);
const astroBin = join(dirname(require.resolve('astro/package.json')), 'bin', 'astro.mjs');
let r = spawnSync(process.execPath, [astroBin, 'build'], { stdio: 'inherit', env });
if (r.status === 0) r = spawnSync(process.execPath, [join(dirname(fileURLToPath(import.meta.url)), 'check.mjs')], { stdio: 'inherit', env });
process.exit(r.status ?? 1);
