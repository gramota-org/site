#!/usr/bin/env node
/**
 * record-demo.mjs — produces the explanatory video for the landing page.
 *
 * Pipeline:
 *   1. Spin up a tiny http server pointing at public/demo-reel/
 *   2. Open the page in headless Chromium with video recording enabled,
 *      1280x720, 30fps. Wait one full 24s loop + 1s buffer.
 *   3. Convert the captured WebM → cropped MP4 with ffmpeg.
 *   4. Synthesize narration. Two backends:
 *        - ElevenLabs REST API (when ELEVENLABS_API_KEY is set)
 *        - macOS `say` (fallback for local dev on a Mac)
 *      One clip per line, layered into a single track at scheduled offsets.
 *   5. Generate a soft synth pad as the music bed using ffmpeg's sine
 *      generator + chorus / reverb filters (no third-party assets).
 *   6. Mix narration + bed + video into public/demo-reel/demo.mp4.
 *
 * Run:
 *   pnpm run video                                # uses macOS `say`
 *   ELEVENLABS_API_KEY=sk-… pnpm run video        # uses ElevenLabs (Rachel)
 *   ELEVENLABS_API_KEY=sk-… ELEVENLABS_VOICE_ID=… # custom voice
 *
 * Output ships with the site — re-run after editing the reel HTML or
 * the NARRATION array below.
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
// Step 4: narration
//
// Two TTS backends:
//   - `elevenlabs` — used when ELEVENLABS_API_KEY is set. Calls the REST
//     API directly (no SDK), one POST per line, mp3 → wav.
//     Voice defaults to Rachel; override with ELEVENLABS_VOICE_ID.
//   - `say`         — fallback for local dev on macOS. Robotic but free.

const TTS_BACKEND = process.env.ELEVENLABS_API_KEY ? "elevenlabs" : "say";
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? "cjVigY5qzO86Huf0OWal"; // Eric — premade, free-tier accessible
const ELEVENLABS_MODEL_ID = process.env.ELEVENLABS_MODEL_ID ?? "eleven_turbo_v2_5";

async function ttsClipToFile(text, mp3Path) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}?output_format=mp3_44100_128`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: ELEVENLABS_MODEL_ID,
      voice_settings: {
        stability: 0.4,
        similarity_boost: 0.75,
        style: 0.15,
        use_speaker_boost: true,
      },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`elevenlabs ${res.status}: ${body.slice(0, 200)}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const { writeFileSync } = await import("node:fs");
  writeFileSync(mp3Path, buf);
}

async function buildNarration() {
  const out = resolve(TMP, "voice.wav");
  console.log(`▸ tts backend: ${TTS_BACKEND}`);

  const inputs = [];
  const filters = [];
  for (let i = 0; i < NARRATION.length; i++) {
    const { at, text } = NARRATION[i];
    const wav = resolve(TMP, `voice-${i}.wav`);

    if (TTS_BACKEND === "elevenlabs") {
      const mp3 = resolve(TMP, `voice-${i}.mp3`);
      await ttsClipToFile(text, mp3);
      spawnSync("ffmpeg", ["-y", "-i", mp3, "-ar", "44100", "-ac", "2", wav], {
        stdio: "ignore",
      });
    } else {
      const aiff = resolve(TMP, `voice-${i}.aiff`);
      spawnSync("say", ["-v", "Samantha", "-r", "180", "-o", aiff, text]);
      spawnSync("ffmpeg", ["-y", "-i", aiff, "-ar", "44100", "-ac", "2", wav], {
        stdio: "ignore",
      });
    }

    inputs.push("-i", wav);
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
  if (TTS_BACKEND === "say" && process.platform !== "darwin") {
    throw new Error(
      "macOS `say` not available on this platform. Set ELEVENLABS_API_KEY to use ElevenLabs instead.",
    );
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
