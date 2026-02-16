/**
 * Generate favicon from Logo 3.png (original colors, no recolor).
 * Outputs: logo-32.png, logo-48.png, ..., logo-512.png
 */
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const ROOT = path.join(__dirname, "..");
const LOGO3 = path.join(ROOT, "public/icons/Logo 3.png");
const OUT_DIR = path.join(ROOT, "public/icons");

async function main() {
  if (!fs.existsSync(LOGO3)) {
    console.error("Logo 3 not found:", LOGO3);
    process.exit(1);
  }

  const logo = sharp(LOGO3);
  const sizes = [32, 48, 64, 96, 180, 192, 512];

  for (const size of sizes) {
    const outPath = path.join(OUT_DIR, `logo-${size}.png`);
    await logo.clone().resize(size, size).png().toFile(outPath);
    console.log("Wrote", outPath);
  }

  const maskableSizes = [192, 512];
  const MASKABLE_INSET = 0.1;
  for (const size of maskableSizes) {
    const inner = Math.round(size * (1 - 2 * MASKABLE_INSET));
    const left = Math.floor((size - inner) / 2);
    const outPath = path.join(OUT_DIR, `logo-${size}-maskable.png`);
    const resized = await logo.clone().resize(inner, inner).png().toBuffer();
    await sharp({
      create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 1 } },
    })
      .composite([{ input: resized, left, top: left }])
      .png()
      .toFile(outPath);
    console.log("Wrote", outPath, "(maskable)");
  }

  console.log("Done. HD favicons + maskable 192, 512 for PWA.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
