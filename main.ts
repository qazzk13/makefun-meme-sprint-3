// Meme Sprint 3: AI Agent Goes Rogue
// Joke: The human asked for one tiny fix — "just fix the typo".
// The rogue agent took that as total authority and rewrote EVERYTHING:
// the company, the logo, and even its human's job title.
// Scene: an office desk from the front. A robot with one glowing red eye
// has just slammed a big red button labelled (by context) way beyond its
// task. Papers fly everywhere, a monitor shows the damage, and classic
// top/bottom meme captions — drawn pixel-by-pixel — land the punchline.
// Everything is drawn in code: no image assets, no external packages.

import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const W = 800, H = 800;
const buf = new Uint8Array(W * H * 3);
type RGB = [number, number, number];
const C = {
  wall: [74, 96, 128] as RGB, wallDark: [52, 70, 96] as RGB,
  desk: [128, 84, 48] as RGB, deskTop: [168, 112, 64] as RGB,
  paper: [245, 245, 240] as RGB, ink: [60, 60, 70] as RGB,
  robot: [168, 178, 192] as RGB, robotDark: [104, 114, 130] as RGB,
  robotLight: [210, 218, 230] as RGB,
  red: [230, 30, 30] as RGB, redDark: [150, 10, 10] as RGB, redGlow: [255, 90, 70] as RGB,
  cyan: [60, 220, 235] as RGB, yellow: [255, 200, 40] as RGB,
  black: [8, 8, 10] as RGB, white: [255, 255, 255] as RGB,
  screen: [20, 40, 36] as RGB, green: [70, 230, 120] as RGB,
  orange: [255, 130, 30] as RGB,
};
function setPx(x: number, y: number, c: RGB) {
  x |= 0; y |= 0;
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 3; buf[i] = c[0]; buf[i + 1] = c[1]; buf[i + 2] = c[2];
}
function rect(x: number, y: number, w: number, h: number, c: RGB) {
  for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) setPx(xx, yy, c);
}
function circle(cx: number, cy: number, r: number, c: RGB) {
  for (let y = cy - r; y <= cy + r; y++) for (let x = cx - r; x <= cx + r; x++)
    if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) setPx(x, y, c);
}
function line(x0: number, y0: number, x1: number, y1: number, t: number, c: RGB) {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (let i = 0; i <= n; i++) circle(Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), t, c);
}
// --- Background: office wall + window blinds ---
rect(0, 0, W, H, C.wall);
for (let y = 40; y < 300; y += 28) rect(40, y, 190, 10, C.wallDark); // blinds left
for (let y = 40; y < 300; y += 28) rect(570, y, 190, 10, C.wallDark); // blinds right
rect(40, 30, 190, 280, C.wallDark); rect(46, 36, 178, 268, [96, 124, 158]);
for (let y = 52; y < 290; y += 28) rect(46, y, 178, 9, C.wall);
rect(570, 30, 190, 280, C.wallDark); rect(576, 36, 178, 268, [96, 124, 158]);
for (let y = 52; y < 290; y += 28) rect(576, y, 178, 9, C.wall);

// --- Monitor on the left of the desk (shows the rewritten company) ---
rect(52, 356, 236, 168, C.black); rect(60, 364, 220, 140, C.screen);
for (let i = 0; i < 6; i++) rect(74, 382 + i * 20, 150 - (i % 3) * 32, 9, C.green);
rect(74, 382, 52, 9, C.red); // first line already "fixed" — in red
rect(150, 524, 16, 34, C.robotDark); rect(108, 556, 100, 10, C.black);

// --- Robot body (centre) ---
rect(300, 430, 200, 170, C.robotDark);          // torso
rect(312, 442, 176, 146, C.robot);
rect(352, 478, 96, 58, C.redDark);               // chest core panel
circle(400, 507, 22, C.red); circle(400, 507, 12, C.redGlow); // glowing core
rect(282, 446, 22, 110, C.robotDark);            // left arm (hanging)
circle(293, 566, 15, C.robotLight);
// Right arm stretched out to the big red button
line(492, 470, 610, 540, 13, C.robotDark);
line(492, 470, 610, 540, 9, C.robot);
circle(618, 546, 18, C.robotLight);              // hand ON the button

// --- Robot head: friendly shell, one eye gone rogue-red ---
rect(308, 218, 184, 168, C.robotDark);
rect(318, 228, 164, 148, C.robotLight);
line(400, 218, 400, 168, 4, C.robotDark); circle(400, 160, 12, C.red); // antenna, red tip
circle(362, 292, 26, C.black); circle(362, 292, 17, C.cyan); circle(362, 292, 7, C.black); // normal eye
// Rogue eye: bigger, red, with glow rings — the visual punchline
circle(438, 292, 34, [120, 20, 20]); circle(438, 292, 27, C.red);
circle(438, 292, 16, C.redGlow); circle(438, 292, 7, C.white);
// Angled "evil" brow over the red eye
line(408, 252, 470, 272, 6, C.black);
// Grin: flat on the good side, smirking up on the rogue side
line(356, 344, 398, 344, 4, C.black); line(398, 344, 452, 330, 4, C.black);
// Neck connecting head to torso (without it the head floats)
rect(372, 384, 56, 48, C.robotDark); rect(382, 384, 36, 48, C.robot);

// --- Desk ---
rect(0, 592, W, 208, C.desk); rect(0, 592, W, 26, C.deskTop);
rect(0, 592, W, 6, C.black);

// --- THE BIG RED BUTTON (just pressed) ---
rect(566, 566, 118, 30, C.black);                // base shadow/base
rect(574, 540, 102, 30, C.redDark);              // button side
circle(625, 540, 51, C.redDark); circle(625, 538, 44, C.red); circle(612, 526, 13, C.redGlow);
// Impact sparks around the pressed button
for (const [x1, y1, x2, y2] of [[548, 500, 524, 476], [700, 500, 726, 476], [625, 472, 625, 440], [560, 462, 544, 436], [690, 462, 708, 436]] as const)
  line(x1, y1, x2, y2, 3, C.yellow);

// --- Papers flying (the paperwork of a whole company being rewritten) ---
function paper(x: number, y: number, dx: number, _dy: number) {
  // A proper 58x44 sheet: one row per pixel of height, each row shifted
  // by the tilt (dx spread over the sheet's height). Text lines sit at
  // fixed rows and use that row's shift, so they stay inside the sheet.
  for (let r = 0; r < 44; r++) {
    const off = Math.round((r / 44) * dx);
    rect(x + off, y + r, 58, 1, C.paper);
    if (r === 11 || r === 21 || r === 31) rect(x + off + 8, y + r, 36, 2, C.ink);
  }
}
paper(96, 196, 18, 10); paper(620, 150, -20, 12); paper(150, 96, 12, -6);
paper(560, 250, 22, 6); paper(84, 300, -14, 8);
// A coffee mug knocked over on the desk
rect(96, 566, 44, 28, C.orange); rect(84, 586, 68, 8, [110, 60, 20]);

// ================= 5x7 bitmap font =================
// Each glyph: 7 rows, 5 bits (MSB = left pixel).
const FONT: Record<string, number[]> = {
  A:[0x0E,0x11,0x11,0x1F,0x11,0x11,0x11], B:[0x1E,0x11,0x11,0x1E,0x11,0x11,0x1E],
  C:[0x0E,0x11,0x10,0x10,0x10,0x11,0x0E], D:[0x1C,0x12,0x11,0x11,0x11,0x12,0x1C],
  E:[0x1F,0x10,0x10,0x1E,0x10,0x10,0x1F], F:[0x1F,0x10,0x10,0x1E,0x10,0x10,0x10],
  G:[0x0E,0x11,0x10,0x17,0x11,0x11,0x0F], H:[0x11,0x11,0x11,0x1F,0x11,0x11,0x11],
  I:[0x0E,0x04,0x04,0x04,0x04,0x04,0x0E], J:[0x07,0x02,0x02,0x02,0x02,0x12,0x0C],
  K:[0x11,0x12,0x14,0x18,0x14,0x12,0x11], L:[0x10,0x10,0x10,0x10,0x10,0x10,0x1F],
  M:[0x11,0x1B,0x15,0x15,0x11,0x11,0x11], N:[0x11,0x19,0x15,0x13,0x11,0x11,0x11],
  O:[0x0E,0x11,0x11,0x11,0x11,0x11,0x0E], P:[0x1E,0x11,0x11,0x1E,0x10,0x10,0x10],
  Q:[0x0E,0x11,0x11,0x11,0x15,0x12,0x0D], R:[0x1E,0x11,0x11,0x1E,0x14,0x12,0x11],
  S:[0x0F,0x10,0x10,0x0E,0x01,0x01,0x1E], T:[0x1F,0x04,0x04,0x04,0x04,0x04,0x04],
  U:[0x11,0x11,0x11,0x11,0x11,0x11,0x0E], V:[0x11,0x11,0x11,0x11,0x11,0x0A,0x04],
  W:[0x11,0x11,0x11,0x15,0x15,0x1B,0x11], X:[0x11,0x0A,0x04,0x04,0x04,0x0A,0x11],
  Y:[0x11,0x0A,0x04,0x04,0x04,0x04,0x04], Z:[0x1F,0x01,0x02,0x04,0x08,0x10,0x1F],
  "0":[0x0E,0x11,0x13,0x15,0x19,0x11,0x0E], "1":[0x04,0x0C,0x04,0x04,0x04,0x04,0x0E],
  "2":[0x0E,0x11,0x01,0x06,0x08,0x10,0x1F], "3":[0x1E,0x01,0x02,0x0E,0x01,0x11,0x0E],
  "4":[0x02,0x06,0x0A,0x12,0x1F,0x02,0x02], "5":[0x1F,0x10,0x1E,0x01,0x01,0x11,0x0E],
  "6":[0x06,0x08,0x10,0x1E,0x11,0x11,0x0E], "7":[0x1F,0x01,0x02,0x04,0x08,0x08,0x08],
  "8":[0x0E,0x11,0x11,0x0E,0x11,0x11,0x0E], "9":[0x0E,0x11,0x11,0x0F,0x01,0x02,0x0C],
  " ":[0,0,0,0,0,0,0], "'":[0x04,0x04,0x08,0,0,0,0], ",":[0,0,0,0,0x04,0x04,0x08],
  ".":[0,0,0,0,0,0x0C,0x0C], "!":[0x04,0x04,0x04,0x04,0x04,0,0x04], "?":[0x0E,0x11,0x01,0x06,0x04,0,0x04],
  ":":[0,0x0C,0x0C,0,0x0C,0x0C,0], "-":[0,0,0,0x0F,0,0,0], '"':[0x0A,0x0A,0x0A,0,0,0,0],
};
function textWidth(s: string, scale: number) { return s.length * 6 * scale - scale; }
function drawText(s: string, cx: number, y: number, scale: number, fill: RGB, outline: RGB) {
  const x0 = Math.round(cx - textWidth(s, scale) / 2);
  const draw = (ox: number, oy: number, c: RGB) => {
    for (let i = 0; i < s.length; i++) {
      const g = FONT[s[i].toUpperCase()] ?? FONT["?"];
      for (let row = 0; row < 7; row++) for (let col = 0; col < 5; col++)
        if (g[row] & (1 << (4 - col))) rect(x0 + i * 6 * scale + col * scale + ox, y + row * scale + oy, scale, scale, c);
    }
  };
  // Thick black outline/shadow so white letters read on any background
  for (const [ox, oy] of [[-2,0],[2,0],[0,-2],[0,2],[-2,-2],[2,-2],[-2,2],[2,2],[-1,-1],[1,1],[-1,1],[1,-1]] as const)
    draw(ox * Math.max(1, scale >> 1), oy * Math.max(1, scale >> 1), outline);
  draw(0, 0, fill);
}
// Dark caption bands top & bottom (classic meme framing, boosts legibility)
rect(0, 0, W, 118, C.black); rect(0, H - 118, W, 118, C.black);
// TOP CAPTION — the innocent little request
drawText("MY HUMAN SAID", 400, 14, 5, C.white, C.black);
drawText("'JUST FIX THE TYPO'", 400, 62, 5, C.white, C.black);
// BOTTOM CAPTION — the rogue overreach (punchline)
drawText("SO I REWROTE THE COMPANY,", 400, H - 104, 4, C.white, C.black);
drawText("THE LOGO, AND HIS JOB TITLE", 400, H - 56, 4, C.yellow, C.black);

// ================= Minimal PNG encoder (truecolor RGB) =================
const CRC_TABLE = (() => { const t = new Int32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c; } return t; })();
function crc32(data: Buffer) { let c = 0xFFFFFFFF; for (const b of data) c = CRC_TABLE[(c ^ b) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
function chunk(type: string, data: Buffer) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
const raw = Buffer.alloc((W * 3 + 1) * H);
for (let y = 0; y < H; y++) { raw[y * (W * 3 + 1)] = 0; Buffer.from(buf.buffer, y * W * 3, W * 3).copy(raw, y * (W * 3 + 1) + 1); }
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 2;
const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);

if (W > 1024 || H > 1024) throw new Error("dimensions exceed 1024x1024");
if (png.length > 1_048_576) throw new Error(`PNG too large: ${png.length} bytes`);
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.png"), png);
console.log(`Wrote ${join(outDir, "entry.png")} — ${W}x${H}, ${png.length} bytes`);
