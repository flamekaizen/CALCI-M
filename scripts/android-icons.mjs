/**
 * Generates Android launcher icons / splash screens and the iOS app icon / splash
 * from the Calci brand mark.
 *
 *   npm i --no-save sharp && node scripts/android-icons.mjs
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_PATH ?? 'sharp');

const GRAD = `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6D66F6"/><stop offset="1" stop-color="#3A31C8"/></linearGradient>`;
const glyph = (scale, tx, ty) => `<g transform="translate(${tx} ${ty}) scale(${scale})" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.3"><path d="M4 15c2.5 0 3.5-9 7-9s3 12 9 12"/><path d="M4 20h16" opacity="0.55"/></g>`;
const full = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><defs>${GRAD}</defs><rect width="1024" height="1024" fill="url(#g)"/>${glyph(22, 248, 220)}</svg>`;
const rounded = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><defs>${GRAD}</defs><rect x="40" y="40" width="944" height="944" rx="210" fill="url(#g)"/>${glyph(23, 236, 205)}</svg>`;
const round = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><defs>${GRAD}</defs><circle cx="512" cy="512" r="480" fill="url(#g)"/>${glyph(19, 284, 262)}</svg>`;
const fg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">${glyph(16, 320, 300)}</svg>`;
const splash = (w, h) => {
  const s = Math.min(w, h) * 0.28;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs>${GRAD}</defs><rect width="${w}" height="${h}" fill="url(#g)"/>${glyph(s / 16, w / 2 - s * 0.75, h / 2 - s * 0.8)}</svg>`;
};

const out = async (svg, w, h, file) => {
  mkdirSync(join(file, '..'), { recursive: true });
  await sharp(Buffer.from(svg), { density: 200 }).resize(w, h).png().toFile(file);
};

const res = 'android/app/src/main/res';
if (existsSync(res)) {
  const dens = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
  for (const [d, k] of Object.entries(dens)) {
    await out(rounded, 48 * k, 48 * k, join(res, `mipmap-${d}`, 'ic_launcher.png'));
    await out(round, 48 * k, 48 * k, join(res, `mipmap-${d}`, 'ic_launcher_round.png'));
    await out(fg, 108 * k, 108 * k, join(res, `mipmap-${d}`, 'ic_launcher_foreground.png'));
    await out(splash(320 * k, 480 * k), 320 * k, 480 * k, join(res, `drawable-port-${d}`, 'splash.png'));
    await out(splash(480 * k, 320 * k), 480 * k, 320 * k, join(res, `drawable-land-${d}`, 'splash.png'));
  }
  await out(splash(480, 800), 480, 800, join(res, 'drawable', 'splash.png'));
  writeFileSync(
    join(res, 'values', 'ic_launcher_background.xml'),
    '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#4F46E5</color>\n</resources>\n',
  );
  console.log('Android icons and splash screens written');
}

const ios = 'ios/App/App/Assets.xcassets';
if (existsSync(ios)) {
  await sharp(Buffer.from(full)).resize(1024, 1024).flatten({ background: '#4F46E5' }).png().toFile(join(ios, 'AppIcon.appiconset', 'AppIcon-512@2x.png'));
  for (const f of ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png']) await out(splash(2732, 2732), 2732, 2732, join(ios, 'Splash.imageset', f));
  console.log('iOS icon and splash written');
}
