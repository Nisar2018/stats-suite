/**
 * Generate favicon / PWA icons from the UI logo (no text).
 * Source: public/images/mystatcalculator.png
 *
 * Usage: node scripts/generate-favicons.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import toIco from 'to-ico';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const src = path.join(root, 'public', 'images', 'mystatcalculator.png');
const outDir = path.join(root, 'public');

/** Navy matching the logo tile — solid for Apple / small sizes */
const NAVY = { r: 10, g: 22, b: 40, alpha: 1 };

async function makeSquarePng(size, outPath, { transparent = false } = {}) {
  const pad = Math.max(Math.round(size * 0.08), 1);
  const inner = size - pad * 2;
  const bg = transparent ? { r: 0, g: 0, b: 0, alpha: 0 } : NAVY;

  const resized = await sharp(src)
    .resize(inner, inner, {
      fit: 'contain',
      background: bg,
    })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: bg,
    },
  })
    .composite([{ input: resized, left: pad, top: pad }])
    .png()
    .toFile(outPath);

  console.log(`Wrote ${path.relative(root, outPath)} (${size}x${size})`);
}

async function main() {
  await fs.access(src);

  await makeSquarePng(48, path.join(outDir, 'favicon-48x48.png'), { transparent: true });
  await makeSquarePng(96, path.join(outDir, 'favicon-96x96.png'), { transparent: true });
  await makeSquarePng(180, path.join(outDir, 'apple-touch-icon.png'), { transparent: false });
  await makeSquarePng(192, path.join(outDir, 'icon-192.png'), { transparent: true });
  await makeSquarePng(512, path.join(outDir, 'icon-512.png'), { transparent: true });

  const icoBuffers = await Promise.all(
    [16, 32, 48].map(async (size) => {
      const pad = Math.max(Math.round(size * 0.08), 1);
      const inner = Math.max(size - pad * 2, 1);
      const resized = await sharp(src)
        .resize(inner, inner, { fit: 'contain', background: NAVY })
        .png()
        .toBuffer();
      return sharp({
        create: { width: size, height: size, channels: 4, background: NAVY },
      })
        .composite([{ input: resized, left: pad, top: pad }])
        .png()
        .toBuffer();
    }),
  );

  const ico = await toIco(icoBuffers);
  const icoPath = path.join(outDir, 'favicon.ico');
  await fs.writeFile(icoPath, ico);
  console.log(`Wrote ${path.relative(root, icoPath)} (16/32/48)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
