#!/usr/bin/env node
/**
 * record-demo.mjs — produces the explanatory video for the landing page.
 *
 * Pipeline:
 *   1. Spin up a tiny http server pointing at public/demo-reel/
 *   2. Open the page in headless Chromium with video recording enabled,
 *      1280x720, 30fps. Wait one full 24s loop + 1s buffer.
 *   3. Convert the captured WebM → cropped MP4 with ffmpeg.
 *   4. Synthesize narration via macOS `say` (split into one wav per line),
 *      concatenate into a single AAC track aligned to the loop timing.
 *   5. Generate a soft synth pad as the music bed using ffmpeg's sine
 *      generator + chorus / reverb filters (no third-party assets).
 *   6. Mix narration + bed + video into dist/demo-reel.mp4.
 *
 * Run:
 *   pnpm run video        # builds dist/demo-reel.mp4
 *
 * Output is gitignored — re-run after editing public/demo-reel/index.html.
 */
import { chromium } from "playwright";
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, rmSync, existsSync, renameSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const REEL_DIR = resolve(ROOT, "public/demo-reel");
const TMP = resolve(ROOT, ".tmp/video");
const OUT_DIR = resolve(ROOT, "public/demo-reel");
const OUT_FILE = resolve(OUT_DIR, "demo.mp4");

const LOOP_SECONDS = 24;
const FPS = 30;
const WIDTH = 1280;
const HEIGHT = 720;

// Narrator track. Each line is `{ at, text }` where `at` is seconds into the loop.
// Keep total speech under LOOP_SECONDS — anything that doesn't fit gets clipped.
const NARRATION = [
  { at: 0.5, text: "EU regulated checkout used to mean a six-week S D K integration." },
  { at: 7.0, text: "The verifier mints a real OID4VP session — DPoP-bound, JAR-signed, x509 SAN DNS under the hood." },
  { at: 13.0, text: "No EU wallet on hand? The simulator drives the same pipeline." },
  { at: 17.5, text: "Twelve security checks. Audit-ready record. Claims minimised." },
  { at: 22.0, text: "Gramota. Identity verification powered by your EU wallet." },
];

// ─────────────────────────────────────────────────────────────────────
// Helpers

const sh = (cmd, args, opts = {}) =>
  new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(cmd, args, { stdio: "inherit", ...opts });
    child.on("close", (code) =>
      code === 0
        ? resolvePromise(undefined)
        : rejectPromise(new Error(`${cmd} exited ${code}`)),
    );
    child.on("error", rejectPromise);
  });

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};

function startServer(dir) {
  const server = http.createServer(async (req, res) => {
    try {
      let p = decodeURIComponent(new URL(req.url, "http://l").pathname);
      if (p === "/") p = "/index.html";
      const file = resolve(dir, p.replace(/^\//, ""));
      if (!file.startsWith(dir)) {
        res.writeHead(403).end();
        return;
      }
      const s = await stat(file);
      if (!s.isFile()) {
        res.writeHead(404).end();
        return;
      }
      res.writeHead(200, {
        "Content-Type": mime[extname(file)] ?? "application/octet-stream",
      });
      createReadStream(file).pipe(res);
    } catch {
      res.writeHead(404).end();
    }
  });
  return new Promise((r) => server.listen(0, "127.0.0.1", () => r({ server, port: server.address().port })));
}

// ─────────────────────────────────────────────────────────────────────
// Step 1+2: record the loop

async function recordLoop() {
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });
  mkdirSync(OUT_DIR, { recursive: true });

  const { server, port } = await startServer(REEL_DIR);
  console.log(`▸ serving demo-reel on :${port}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    recordVideo: {
      dir: TMP,
      size: { width: WIDTH, height: HEIGHT },
    },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  await page.goto(`http://127.0.0.1:${port}/`);

  // wait for fonts to load before starting the recording window
  await page.evaluate(() => document.fonts.ready);

  // pin the animation start so the loop is deterministic
  await page.evaluate(() => {
    document.documentElement.style.setProperty("animation-play-state", "running");
  });

  // capture one full loop + small buffer for fade-in/out cushion
  const captureMs = (LOOP_SECONDS + 1) * 1000;
  console.log(`▸ recording ${captureMs}ms`);
  await page.waitForTimeout(captureMs);

  await page.close();
  const video = page.video();
  await context.close();
  await browser.close();
  server.close();

  if (!video) throw new Error("no video produced");
  const webmPath = await video.path();
  console.log(`▸ raw webm: ${webmPath}`);
  return webmPath;
}

// ─────────────────────────────────────────────────────────────────────
// Step 3: webm → mp4

async function convertWebmToMp4(webmPath) {
  const out = resolve(TMP, "video.mp4");
  await sh("ffmpeg", [
    "-y",
    "-i", webmPath,
    "-r", String(FPS),
    "-t", String(LOOP_SECONDS),
    "-vf", `scale=${WIDTH}:${HEIGHT}`,
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-crf", "20",
    "-preset", "slow",
    out,
  ]);
  return out;
}

// ─────────────────────────────────────────────────────────────────────
// Step 4: narration via macOS `say`

async function buildNarration() {
  const out = resolve(TMP, "voice.wav");
  // Generate one wav per line, then layer them into a single mix
  // anchored at the prescribed `at` timestamps.
  const inputs = [];
  const filters = [];
  for (let i = 0; i < NARRATION.length; i++) {
    const { at, text } = NARRATION[i];
    const aiff = resolve(TMP, `voice-${i}.aiff`);
    const wav = resolve(TMP, `voice-${i}.wav`);
    spawnSync("say", ["-v", "Samantha", "-r", "180", "-o", aiff, text]);
    spawnSync("ffmpeg", ["-y", "-i", aiff, "-ar", "44100", "-ac", "2", wav], {
      stdio: "ignore",
    });
    inputs.push("-i", wav);
    // delay each clip by its `at` offset (in ms), pad to LOOP_SECONDS
    filters.push(`[${i}:a]adelay=${Math.round(at * 1000)}|${Math.round(at * 1000)},volume=1.0[v${i}]`);
  }
  filters.push(NARRATION.map((_, i) => `[v${i}]`).join("") + `amix=inputs=${NARRATION.length}:duration=longest:dropout_transition=0,apad,atrim=0:${LOOP_SECONDS}[a]`);
  const filterComplex = filters.join(";");

  await sh("ffmpeg", [
    "-y",
    ...inputs,
    "-filter_complex", filterComplex,
    "-map", "[a]",
    "-ac", "2",
    "-ar", "44100",
    out,
  ]);
  return out;
}

// ─────────────────────────────────────────────────────────────────────
// Step 5: synth pad music bed (no third-party samples)
// Two soft sine partials in C major + a wide chorus to make it sit
// politely under the narration.

async function buildMusicBed() {
  const out = resolve(TMP, "bed.wav");
  // 130.81Hz = C3, 261.63Hz = C4, 392.00Hz = G4. Sustained pad.
  const filterComplex = [
    "sine=frequency=130.81:sample_rate=44100:duration=" + LOOP_SECONDS + "[a1]",
    "sine=frequency=261.63:sample_rate=44100:duration=" + LOOP_SECONDS + "[a2]",
    "sine=frequency=392.00:sample_rate=44100:duration=" + LOOP_SECONDS + "[a3]",
    "[a1][a2][a3]amix=inputs=3:duration=longest,chorus=0.5:0.7:50|60|70:0.3|0.4|0.5:0.25|0.3|0.4:2|2.3|2.8,volume=0.06,afade=t=in:st=0:d=2,afade=t=out:st=" + (LOOP_SECONDS - 2) + ":d=2[a]",
  ].join(";");
  await sh("ffmpeg", [
    "-y",
    "-filter_complex", filterComplex,
    "-map", "[a]",
    "-t", String(LOOP_SECONDS),
    "-ac", "2",
    "-ar", "44100",
    out,
  ]);
  return out;
}

// ─────────────────────────────────────────────────────────────────────
// Step 6: final mux

async function mux(videoPath, voicePath, bedPath) {
  // duck the bed under the narration for clarity
  const filterComplex = [
    "[1:a]volume=1.0[voice]",
    "[2:a]volume=0.7[bed]",
    "[voice][bed]amix=inputs=2:duration=longest:dropout_transition=0[aout]",
  ].join(";");

  await sh("ffmpeg", [
    "-y",
    "-i", videoPath,
    "-i", voicePath,
    "-i", bedPath,
    "-filter_complex", filterComplex,
    "-map", "0:v",
    "-map", "[aout]",
    "-c:v", "copy",
    "-c:a", "aac",
    "-b:a", "160k",
    "-shortest",
    OUT_FILE,
  ]);
  return OUT_FILE;
}

// ─────────────────────────────────────────────────────────────────────
// main

async function main() {
  if (!spawnSync("ffmpeg", ["-version"]).pid) {
    throw new Error("ffmpeg not on PATH; brew install ffmpeg");
  }
  if (!spawnSync("say", ["-?"]).pid && process.platform !== "darwin") {
    throw new Error("`say` is macOS-only; run on a Mac or sub in another TTS");
  }

  console.log("▸ recording loop with Playwright…");
  const webmPath = await recordLoop();

  console.log("▸ converting to mp4…");
  const videoPath = await convertWebmToMp4(webmPath);

  console.log("▸ synthesizing narration…");
  const voicePath = await buildNarration();

  console.log("▸ generating music bed…");
  const bedPath = await buildMusicBed();

  console.log("▸ muxing final mp4…");
  const final = await mux(videoPath, voicePath, bedPath);

  const size = (await stat(final)).size;
  console.log(`✓ wrote ${final} (${(size / 1024 / 1024).toFixed(2)} MB)`);

  // poster: extract a still from t=4s (mid-storefront, after fonts settle)
  const poster = resolve(OUT_DIR, "poster.jpg");
  await sh("ffmpeg", [
    "-y",
    "-ss", "4",
    "-i", final,
    "-frames:v", "1",
    "-q:v", "3",
    poster,
  ]);
  console.log(`✓ wrote ${poster}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
