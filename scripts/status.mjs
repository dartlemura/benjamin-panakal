// Shows which sections are live. Usage: npm run status
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('../src/data/content.ts', import.meta.url), 'utf8');
const keys = ['biography','about','background','education','achievements','projects','articles','gallery'];
for (const k of keys) {
  const m = src.match(new RegExp(`^\\s{2}${k}:\\s*\\[([\\s\\S]*?)\\]\\s*as\\s`, 'm'));
  const live = m && m[1].trim().length > 0;
  console.log(`${live ? 'LIVE   ' : 'hidden '} /${k}/`);
}
console.log('LIVE    /  and /contact/ (always)');
