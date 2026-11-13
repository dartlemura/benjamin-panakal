// Generates the raster brand assets (Open Graph card + touch icon) with headless Chrome,
// using the same fonts as the site. Run once:  node scripts/make-assets.mjs
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const fonts = pathToFileURL(join(root, 'public/fonts')).href;
const dir = mkdtempSync(join(tmpdir(), 'assets-'));
// Optional developer tool (the generated images are already included in /public).
const candidates = [
  process.env.CHROME,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  'google-chrome',
].filter(Boolean);
const chrome = candidates.find((c) => !c.includes('/') && !c.includes('\\') || existsSync(c)) || candidates[candidates.length - 1];

const face = `
@font-face{font-family:"Instrument Serif";src:url("${fonts}/instrument-serif-latin-400-normal.woff2");font-weight:400}
@font-face{font-family:"Instrument Serif";src:url("${fonts}/instrument-serif-latin-400-italic.woff2");font-weight:400;font-style:italic}
@font-face{font-family:"Inter";src:url("${fonts}/inter-latin-wght-normal.woff2");font-weight:100 900}
`;

function shot(html, out, w, h) {
  const file = join(dir, out.replace(/[\\/]/g, '_') + '.html');
  writeFileSync(file, html);
  execFileSync(chrome, [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=1', `--window-size=${w},${h}`, '--virtual-time-budget=3000',
    `--screenshot=${join(root, 'public', out)}`, pathToFileURL(file).href,
  ], { stdio: 'ignore' });
  console.log('wrote public/' + out);
}

const og = `<!doctype html><meta charset=utf-8><style>${face}
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px;background:#08090a;overflow:hidden}
.c{position:relative;width:1200px;height:630px;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between;
background:radial-gradient(60% 70% at 50% -20%,rgba(255,255,255,.16),transparent 70%),#08090a}
.grid{position:absolute;inset:0;background-image:linear-gradient(to right,rgba(255,255,255,.04) 1px,transparent 1px);background-size:100px 100%;
-webkit-mask-image:radial-gradient(70% 80% at 50% 0%,#000,transparent 80%)}
.top{position:relative;display:flex;align-items:center;gap:14px;font:500 22px Inter;color:#868b93;letter-spacing:.08em;text-transform:uppercase}
.dot{width:10px;height:10px;border-radius:50%;background:#f4f5f6;box-shadow:0 0 0 6px rgba(255,255,255,.08)}
h1{position:relative;font:400 132px/.92 "Instrument Serif";letter-spacing:-.035em;color:#f4f5f6}
h1 i{display:block;color:#868b93;padding-left:90px}
h1 span{display:block}
.bot{position:relative;font:450 26px Inter;color:#b9bdc4;letter-spacing:-.01em}
.line{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent)}
</style><div class=c><div class=line></div><div class=grid></div>
<div class=top><span class=dot></span>Official website</div>
<h1><span>Benjamin</span><i>Anthony</i><span style="padding-left:30px">Panakal</span></h1>
<div class=bot>Visakhapatnam, India</div></div>`;
shot(og, 'og/default.png', 1200, 630);

const icon = readFileSync(join(root, 'public/favicon.svg'), 'utf8');
shot(`<!doctype html><style>html,body{margin:0;width:180px;height:180px;background:#0b0c0e}svg{width:180px;height:180px;display:block}</style>${icon}`, 'apple-touch-icon.png', 180, 180);
