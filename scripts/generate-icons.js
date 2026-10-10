import fs from 'fs';
import zlib from 'zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  return table;
}

const crcTable = createCRC32Table();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function writeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function generatePNG(width, height, isMaskable = false) {
  // Signature
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8-bit depth
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace
  const ihdr = writeChunk('IHDR', ihdrData);

  // Scanlines with filter byte 0
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.42;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Gradient background (Deep navy to royal blue)
      const gradRatio = y / height;
      let r = Math.round(29 * (1 - gradRatio) + 15 * gradRatio);
      let g = Math.round(78 * (1 - gradRatio) + 23 * gradRatio);
      let b = Math.round(216 * (1 - gradRatio) + 42 * gradRatio);
      let a = 255;

      // Rounded squircle or circle
      if (!isMaskable) {
        const cornerDist = Math.max(Math.abs(dx), Math.abs(dy));
        const cornerRadius = width * 0.22;
        // smooth corners
        if (Math.abs(dx) > width / 2 - cornerRadius && Math.abs(dy) > height / 2 - cornerRadius) {
          const cornerCx = (dx > 0 ? 1 : -1) * (width / 2 - cornerRadius);
          const cornerCy = (dy > 0 ? 1 : -1) * (height / 2 - cornerRadius);
          const cDist = Math.sqrt((dx - cornerCx) ** 2 + (dy - cornerCy) ** 2);
          if (cDist > cornerRadius) {
            a = 0;
          }
        }
      }

      if (a > 0) {
        // Draw lifebuoy ring
        const ringOuter = radius * 0.72;
        const ringInner = radius * 0.44;
        const ringMid = radius * 0.58;

        if (dist >= ringInner && dist <= ringOuter) {
          // White lifebuoy
          r = 255;
          g = 255;
          b = 255;

          // Red quadrant marks
          const angle = Math.atan2(dy, dx);
          const normAngle = (angle + 2 * Math.PI) % (Math.PI / 2);
          if (normAngle < 0.22 || normAngle > (Math.PI / 2 - 0.22)) {
            r = 239;
            g = 68;
            b = 68;
          }
        } else if (dist < ringInner) {
          // Inner cross / plus symbol in sky blue
          const crossThickness = radius * 0.16;
          const crossArm = radius * 0.32;
          const inH = Math.abs(dx) <= crossArm && Math.abs(dy) <= crossThickness;
          const inV = Math.abs(dy) <= crossArm && Math.abs(dx) <= crossThickness;

          if (inH || inV) {
            r = 56;
            g = 189;
            b = 248; // #38bdf8
          } else {
            r = 15;
            g = 23;
            b = 42;
          }
        } else if (dy > radius * 0.55 && dist < radius * 1.1) {
          // Water wave highlight
          r = 56;
          g = 189;
          b = 248;
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const idat = writeChunk('IDAT', deflated);
  const iend = writeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

// Generate all required PWA icons
fs.writeFileSync('public/pwa-192x192.png', generatePNG(192, 192, false));
fs.writeFileSync('public/pwa-512x512.png', generatePNG(512, 512, false));
fs.writeFileSync('public/pwa-maskable-512x512.png', generatePNG(512, 512, true));
fs.writeFileSync('public/apple-touch-icon.png', generatePNG(180, 180, false));

console.log('Successfully generated all PWA PNG icons in public/');
