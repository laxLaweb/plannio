/**
 * Compress client/public/og-image.png for faster social/OG loads.
 * Requires Node 20+. Skips gracefully if sharp is unavailable.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagePath = path.join(__dirname, "..", "client", "public", "og-image.png");

if (!fs.existsSync(imagePath)) {
  console.log("optimize-og: og-image.png not found, skipping.");
  process.exit(0);
}

try {
  const sharp = (await import("sharp")).default;
  const before = fs.statSync(imagePath).size;
  const buffer = await sharp(imagePath)
    .resize(1200, 630, { fit: "cover" })
    .png({ compressionLevel: 9, adaptiveFiltering: true, palette: true })
    .toBuffer();

  fs.writeFileSync(imagePath, buffer);
  console.log(`optimize-og: ${(before / 1024).toFixed(0)} KB → ${(buffer.length / 1024).toFixed(0)} KB`);
} catch (error) {
  console.warn(`optimize-og: skipped (${error.message})`);
}
