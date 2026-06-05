/**
 * Generates binary brand assets from inline SVG using sharp:
 *   - public/og-default.png      (1200×630 social share image)
 *   - public/apple-touch-icon.png (180×180)
 *   - public/favicon.ico is intentionally skipped; favicon.svg is the primary.
 *
 * Run with: node scripts/gen-assets.mjs
 * (Re-run if you tweak the brand mark; output is committed so CI needn't run it.)
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");

const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g" cx="100%" cy="0%" r="80%">
      <stop offset="0%" stop-color="#F3EDFB"/>
      <stop offset="70%" stop-color="#FAFAFB" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#FAFAFB"/>
  <rect width="1200" height="630" fill="url(#g)"/>
  <g font-family="Inter, Helvetica, Arial, sans-serif">
    <text x="80" y="120" font-size="34" font-weight="800" letter-spacing="-1">
      <tspan fill="#1F2430">Tech</tspan><tspan fill="#8c5fc1">sober</tspan>
    </text>
    <circle cx="316" cy="112" r="7" fill="#8c5fc1"/>
    <text x="80" y="320" font-size="92" font-weight="800" letter-spacing="-3" fill="#1F2430">Tech and AI,</text>
    <text x="80" y="430" font-size="92" font-weight="800" letter-spacing="-3" fill="#8c5fc1">minus the hype.</text>
    <text x="80" y="520" font-size="30" font-weight="500" fill="#6B7280">Honest reviews · AI tools · workflows with the costs left in</text>
    <text x="80" y="585" font-size="26" font-weight="600" fill="#3A3F4B">thetechsober.com</text>
  </g>
</svg>`;

const touch = `
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#8c5fc1"/>
  <path d="M18 22h28" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
  <path d="M32 22v22" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
  <circle cx="46" cy="44" r="4.5" fill="#F3EDFB"/>
</svg>`;

await sharp(Buffer.from(og)).png().toFile(join(pub, "og-default.png"));
await sharp(Buffer.from(touch))
  .resize(180, 180)
  .png()
  .toFile(join(pub, "apple-touch-icon.png"));

console.log("✓ Generated og-default.png + apple-touch-icon.png");
