/**
 * Generate favicon from Logo 3.png.
 * Dark mode: original (light on dark). Light mode: inverted (dark on light).
 */
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const ROOT = path.join(__dirname, "..");
const LOGO3 = path.join(ROOT, "public/icons/Logo 3.png");
const OUT_DIR = path.join(ROOT, "public/icons");
const BACKGROUND_THRESHOLD = 40;

async function invertToLight(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = channels === 4 ? data[i + 3] : 255;
    const brightness = (r + g + b) / 3;
    if (a > 10 && brightness > BACKGROUND_THRESHOLD) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
    } else {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    }
  }
  return sharp(data, { raw: { width, height, channels } }).png();
}

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
    console.log("Wrote", outPath, "(dark)");
  }

  for (const size of sizes) {
    const buf = await logo.clone().resize(size, size).png().toBuffer();
    const light = await invertToLight(buf);
    const outPath = path.join(OUT_DIR, `logo-${size}-light.png`);
    await light.toFile(outPath);
    console.log("Wrote", outPath, "(light)");
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
    console.log("Wrote", outPath, "(maskable dark)");
  }

  for (const size of maskableSizes) {
    const inner = Math.round(size * (1 - 2 * MASKABLE_INSET));
    const left = Math.floor((size - inner) / 2);
    const resized = await logo.clone().resize(inner, inner).png().toBuffer();
    const lightBuf = await invertToLight(resized);
    const lightPng = await lightBuf.png().toBuffer();
    await sharp({
      create: { width: size, height: size, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
    })
      .composite([{ input: lightPng, left, top: left }])
      .png()
      .toFile(path.join(OUT_DIR, `logo-${size}-maskable-light.png`));
    console.log("Wrote", path.join(OUT_DIR, `logo-${size}-maskable-light.png`), "(maskable light)");
  }

  console.log("Done. Dark + light favicons and maskable.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
