/**
 * Generate favicon from Logo 3.png with Logo 6's color.
 * Outputs: logo-32.png, logo-48.png, logo-512.png
 */
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const ROOT = path.join(__dirname, "..");
const LOGO3 = path.join(ROOT, "public/icons/Logo 3.png");
const LOGO6 = path.join(ROOT, "public/icons/Logo 6.png");
const OUT_DIR = path.join(ROOT, "public/icons");

// Logo 6 green: bright lime (#22c55e) - theme primary
const TARGET_HEX = "#22c55e";
const TARGET_RGB = { r: 34, g: 197, b: 94 };

// Pixels darker than this are considered background (keep black)
const BACKGROUND_THRESHOLD = 40;

async function extractColorFromLogo6() {
  const { data } = await sharp(LOGO6)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const info = await sharp(LOGO6).metadata();
  const { width, channels } = info;
  const h = (data.length / width / channels) | 0;
  // Sample center-ish (avoid edges) - logo foreground
  let r = 0, g = 0, b = 0, n = 0;
  const step = Math.max(1, Math.min(width, h) / 8);
  for (let y = step; y < h - step; y += step) {
    for (let x = step; x < width - step; x += step) {
      const i = (y * width + x) * channels;
      const pr = data[i];
      const pg = data[i + 1];
      const pb = data[i + 2];
      const brightness = (pr + pg + pb) / 3;
      if (brightness > 80 && brightness < 250) {
        r += pr;
        g += pg;
        b += pb;
        n++;
      }
    }
  }
  if (n > 0) {
    return {
      r: Math.round(r / n),
      g: Math.round(g / n),
      b: Math.round(b / n),
    };
  }
  return TARGET_RGB;
}

async function recolorLogo3(targetRgb) {
  const img = await sharp(LOGO3).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { data, info } = img;
  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = channels === 4 ? data[i + 3] : 255;
    const brightness = (r + g + b) / 3;
    if (a > 10 && brightness > BACKGROUND_THRESHOLD) {
      data[i] = targetRgb.r;
      data[i + 1] = targetRgb.g;
      data[i + 2] = targetRgb.b;
    }
  }

  return sharp(data, {
    raw: { width, height, channels },
  });
}

async function main() {
  if (!fs.existsSync(LOGO3)) {
    console.error("Logo 3 not found:", LOGO3);
    process.exit(1);
  }
  let targetRgb = TARGET_RGB;
  if (fs.existsSync(LOGO6)) {
    try {
      targetRgb = await extractColorFromLogo6();
      console.log("Extracted Logo 6 color: rgb(%d, %d, %d)", targetRgb.r, targetRgb.g, targetRgb.b);
    } catch (e) {
      console.warn("Could not extract from Logo 6, using default:", e.message);
    }
  }

  const recolored = await recolorLogo3(targetRgb);
  const sizes = [32, 48, 64, 96, 180, 192, 512];

  for (const size of sizes) {
    const outPath = path.join(OUT_DIR, `logo-${size}.png`);
    await recolored
      .clone()
      .resize(size, size)
      .png()
      .toFile(outPath);
    console.log("Wrote", outPath);
  }

  console.log("Done. HD favicons: 32, 48, 64, 96, 180, 192, 512");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
