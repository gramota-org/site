# Gramota — Demo Video Script

A 60-second product video that turns the live demo into shareable
marketing footage. Two raw assets feed it:

- **The reel page** at `public/demo-reel/index.html` — a 24-second
  CSS-only loop that crossfades through the storefront → verifying →
  verified flow. Open it in a 1280×720 browser window and screen-record
  with QuickTime / OBS.
- **The live demo** at <https://gramota-org.github.io/demo-store/> — for
  any shot where you want a real cursor + a real network call hitting
  `https://168-119-249-126.sslip.io/demo/*`.

Final cut target: **1080p, 60s, MP4 (H.264, AAC), under 8 MB.**

---

## Shot list

| #  | t (s)   | source                          | shot                                                                                          | narrator                                                                                            |
| -- | ------- | ------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 01 | 0–3     | reel page, stage 1              | Solnce storefront fades up. Hero grad mesh visible. Three product cards.                      | "EU regulated checkout used to mean a six-week SDK integration."                                    |
| 02 | 3–6     | reel page, stage 1 (with cursor) | Cursor drifts to "Sunset Festival VIP Pass". Card edges glow indigo. Click animation.         | "Now it's three lines of TypeScript."                                                               |
| 03 | 6–10    | reel page, stage 2              | Crossfade into verifying screen. QR snaps in on the right. Three pulse-dots animate.          | "The verifier mints a real OID4VP session — DPoP-bound, JAR-signed, x509_san_dns under the hood."   |
| 04 | 10–14   | reel page, stage 2              | Camera holds on the simulator dashed-border panel. "Approve all checks" pulses indigo.        | "No EU wallet on your phone? The in-browser simulator drives the same backend pipeline."            |
| 05 | 14–17   | reel page, stage 2 → 3 cut       | Click the "Approve all" button. Hard cut into stage 3.                                        | "Same code path. Same audit record."                                                                |
| 06 | 17–22   | reel page, stage 3              | Big green check strokes in. "Verified — order complete" appears. Claim list slides up.        | "Twelve security checks, every one logged. The merchant gets the claims they asked for, nothing more." |
| 07 | 22–28   | live demo (browser tab)          | Quick cut to the actual demo URL in a real browser. Show the network panel firing `/demo/*`.   | "This isn't a mockup. The demo runs against our production API."                                    |
| 08 | 28–36   | code editor (VS Code)            | Snippet of `verifier.verify(token, { require: ({ claims }) => Number(claims.age) >= 18 })`. | "Predicate-based business rules. Plain TypeScript. Same shape as Stripe."                           |
| 09 | 36–44   | terminal                         | `pnpm add @gramota/verifier` → `pnpm add @gramota/qr` — both finishing in under two seconds.   | "MIT licensed. ESM-only. Node 20+. Bun and Deno work too."                                          |
| 10 | 44–52   | landing page (gramota.dev/site)  | Pan over the "How it works" triptych — same screens we just animated.                         | "If you're shipping age-gated commerce, payments, telco, or fintech — this is the integration."    |
| 11 | 52–58   | live demo storefront, full       | Final wide shot of the storefront. Mouse-over a card. Tagline overlays.                       | "Gramota. Identity verification powered by your EU wallet."                                          |
| 12 | 58–60   | end card                         | Black background. Gradient G logo. URL: **gramota.dev**.                                      | (silence — let the URL breathe)                                                                     |

---

## Recording the reel

```bash
# 1. Build & serve the site
cd ~/Work/gramota-site
pnpm dev              # Analog devserver on :4205

# 2. Open the reel in Chrome with a clean 1280x720 window
open -na "Google Chrome" --args \
  --new-window \
  --window-size=1280,720 \
  --window-position=0,0 \
  --kiosk \
  http://localhost:4205/demo-reel/index.html

# 3. Screen-record (QuickTime: File → New Screen Recording → Selection)
#    Capture the inner 1280x720, no chrome.
#    Record 30 seconds — the loop is 24s; trim to one full cycle in post.
```

Tip: in Chrome DevTools → Rendering → "Emulate CSS prefers-reduced-motion: no-preference" — the CSS animations are gated only by global timing, not user prefs, but it's worth confirming.

## Recording the live-demo cut (shot 07)

```bash
# Open Chrome, network tab visible, throttling off
open -a "Google Chrome" "https://gramota-org.github.io/demo-store/?api=https://168-119-249-126.sslip.io"

# Click the Sunset Festival card → simulator → "Approve all checks"
# The QR mint and the simulator POST will both appear in DevTools
# Capture 6 seconds, trim the cleanest 3.
```

## Editing notes

- **Crossfades, not cuts**, between shots 01–06 — the reel already does
  this in CSS, so just trust the recording.
- **Hard cut** for shot 07 (live browser) — break the rhythm to signal
  "this is real product, not a mockup".
- **Tracks**:
  - Music bed: a soft synth pad at -20 LUFS. Suggested: Epidemic
    Sound's "Reflections of You — Indigo Edition" or anything with no
    perceptible beat (drums fight the narration).
  - VO: dry, conversational, no compressor. Read with a half-smile.
  - SFX: a single soft "tick" on shot 02's click, a deeper "thunk" on
    shot 05's verify — that's it.
- **Captions**: burned-in, white text with a 1px black stroke, Inter
  600 at 32px. Match the SDK's typography.
- **Color grade**: leave the reel untouched (the grad mesh already
  reads warm). Pull shot 07 (live demo) up +5 in shadows so it
  matches the reel's white background.

## Quality checks before publishing

- [ ] Demo URL still resolves (`curl -I https://168-119-249-126.sslip.io/healthz`)
- [ ] No personal email or org token visible in any DevTools panel
- [ ] Narration script proofread by a native English speaker
- [ ] CC-BY music attribution in description (if applicable)
- [ ] Alt-text caption file (.vtt) committed alongside the .mp4
- [ ] First frame is visually arresting — the storefront, not a logo

## Distribution targets

| platform           | aspect | length | notes                                              |
| ------------------ | ------ | ------ | -------------------------------------------------- |
| Landing hero       | 16:9   | 60s    | Looping, muted by default, captions on             |
| Twitter / X post   | 16:9   | 60s    | Cap at 4 MB, drop shots 08–09 if needed            |
| YouTube short      | 9:16   | 45s    | Recompose: vertical crops of the same source        |
| LinkedIn post      | 1:1    | 60s    | Square crop; emphasize shot 03 + 06                |
| GitHub README .gif | 16:9   | 12s    | Just shots 01–06 of the reel; aim for under 1.5 MB |
