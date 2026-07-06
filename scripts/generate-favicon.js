// One-off/regenerable script that renders the Plannio brand mark (the same
// gradient rounded square + checkmark used in the Logo component) into a
// multi-resolution favicon.ico, with zero external dependencies — only
// Node's built-in zlib is used for PNG compression.
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const PUBLIC_DIR = path.join(__dirname, "..", "client", "public");
const OUT_ICO = path.join(PUBLIC_DIR, "favicon.ico");
const OUT_PNG_32 = path.join(PUBLIC_DIR, "favicon-32.png");
const OUT_PNG_192 = path.join(PUBLIC_DIR, "favicon-192.png");
const OUT_APPLE = path.join(PUBLIC_DIR, "apple-touch-icon.png");
const PREVIEW_PNG = path.join(__dirname, "favicon-preview.png");

// Matches --gradient-primary in client/src/styles.css:
// linear-gradient(135deg, oklch(0.6 0.21 277), oklch(0.62 0.19 300))
const COLOR_A = [0x66, 0x69, 0xfa]; // indigo
const COLOR_B = [0x9a, 0x64, 0xe5]; // violet
const WHITE = [255, 255, 255];

const SIZES = [16, 32, 48, 64, 128, 192, 256];
const SUPERSAMPLE = 4;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

// Signed distance from point p to segment ab.
function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  let t = lenSq === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = clamp01(t);
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}

function roundedRectCoverage(x, y, size, radius) {
  // 1 inside, 0 outside, with a soft edge for anti-aliasing.
  const nx = x < radius ? radius : x > size - radius ? size - radius : x;
  const ny = y < radius ? radius : y > size - radius ? size - radius : y;
  if (x >= radius && x <= size - radius) return y >= 0 && y <= size ? 1 : 0;
  if (y >= radius && y <= size - radius) return x >= 0 && x <= size ? 1 : 0;
  const d = Math.hypot(x - nx, y - ny);
  return d <= radius ? 1 : 0;
}

// Renders one supersampled RGBA frame and box-filters it down to `size`.
function renderIcon(size) {
  const hi = size * SUPERSAMPLE;
  const radius = hi * 0.22;
  const strokeHalf = hi * 0.075;

  // Simple checkmark polyline, proportioned like the CalendarCheck glyph.
  const p1 = [hi * 0.27, hi * 0.53];
  const p2 = [hi * 0.44, hi * 0.7];
  const p3 = [hi * 0.76, hi * 0.32];

  const hiBuf = Buffer.alloc(hi * hi * 4);

  for (let y = 0; y < hi; y += 1) {
    for (let x = 0; x < hi; x += 1) {
      const idx = (y * hi + x) * 4;
      const inSquare = roundedRectCoverage(x + 0.5, y + 0.5, hi, radius);

      if (!inSquare) {
        hiBuf[idx + 3] = 0;
        continue;
      }

      const t = clamp01((x + y) / (2 * (hi - 1)));
      let r = lerp(COLOR_A[0], COLOR_B[0], t);
      let g = lerp(COLOR_A[1], COLOR_B[1], t);
      let b = lerp(COLOR_A[2], COLOR_B[2], t);

      const d1 = distToSegment(x, y, p1[0], p1[1], p2[0], p2[1]);
      const d2 = distToSegment(x, y, p2[0], p2[1], p3[0], p3[1]);
      const d = Math.min(d1, d2);
      if (d <= strokeHalf) {
        const mix = clamp01(1 - (d / strokeHalf) * 0.3);
        r = lerp(r, WHITE[0], mix);
        g = lerp(g, WHITE[1], mix);
        b = lerp(b, WHITE[2], mix);
      }

      hiBuf[idx] = Math.round(r);
      hiBuf[idx + 1] = Math.round(g);
      hiBuf[idx + 2] = Math.round(b);
      hiBuf[idx + 3] = 255;
    }
  }

  // Box downsample hi -> size.
  const out = Buffer.alloc(size * size * 4);
  const cell = SUPERSAMPLE;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let sy = 0; sy < cell; sy += 1) {
        for (let sx = 0; sx < cell; sx += 1) {
          const si = ((y * cell + sy) * hi + (x * cell + sx)) * 4;
          const alpha = hiBuf[si + 3];
          r += hiBuf[si] * alpha;
          g += hiBuf[si + 1] * alpha;
          b += hiBuf[si + 2] * alpha;
          a += alpha;
        }
      }
      const n = cell * cell;
      const oi = (y * size + x) * 4;
      out[oi] = a > 0 ? Math.round(r / a) : 0;
      out[oi + 1] = a > 0 ? Math.round(g / a) : 0;
      out[oi + 2] = a > 0 ? Math.round(b / a) : 0;
      out[oi + 3] = Math.round(a / n);
    }
  }

  return out;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodePNG(size, rgba) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = chunk("IHDR", ihdrData);

  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y += 1) {
    const rowStart = y * (size * 4 + 1);
    raw[rowStart] = 0; // filter: none
    rgba.copy(raw, rowStart + 1, y * size * 4, (y + 1) * size * 4);
  }
  const idatData = zlib.deflateSync(raw, { level: 9 });
  const idat = chunk("IDAT", idatData);

  const iend = chunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function packICO(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const entries = [];
  const bodies = [];
  let offset = 6 + count * 16;

  for (const { size, png } of images) {
    const entry = Buffer.alloc(16);
    entry[0] = size >= 256 ? 0 : size;
    entry[1] = size >= 256 ? 0 : size;
    entry[2] = 0;
    entry[3] = 0;
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32BE(0, 8); // placeholder, overwritten below (LE actually)
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    bodies.push(png);
    offset += png.length;
  }

  return Buffer.concat([header, ...entries, ...bodies]);
}

const images = SIZES.map((size) => ({ size, png: encodePNG(size, renderIcon(size)) }));
const bySize = (size) => images.find((img) => img.size === size).png;

// ICO only needs the classic sizes; PNGs cover modern browsers and touch icons.
const icoImages = images.filter((img) => [16, 32, 48, 64, 128, 256].includes(img.size));

fs.mkdirSync(PUBLIC_DIR, { recursive: true });
fs.writeFileSync(OUT_ICO, packICO(icoImages));
fs.writeFileSync(OUT_PNG_32, bySize(32));
fs.writeFileSync(OUT_PNG_192, bySize(192));
fs.writeFileSync(OUT_APPLE, bySize(192));
fs.writeFileSync(PREVIEW_PNG, bySize(256));

console.log(`Wrote ${OUT_ICO} (${icoImages.map((i) => i.size).join(", ")}px)`);
console.log(`Wrote ${OUT_PNG_32}, ${OUT_PNG_192}, ${OUT_APPLE}`);
console.log(`Wrote preview ${PREVIEW_PNG}`);
