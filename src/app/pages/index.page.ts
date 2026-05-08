import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

/**
 * Landing page (route: `/`).
 *
 * Reads as: pitch → 5-line code sample → why-now (EU Digital Identity Wallet
 * mandate) → standards table → CTA. The goal is to get a curious dev from
 * the homepage to a working install in under 60 seconds.
 */
@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero">
      <div class="container">
        <p class="eyebrow">@gramota — TypeScript SDK</p>
        <h1>
          Verify and issue
          <span class="grad">EU Digital Identity Wallet</span>
          credentials in 20 lines.
        </h1>
        <p class="lede">
          Every wire-format check, every spec corner. End-to-end against the
          EU reference wallet. Built for web developers who don't want to
          read 80 pages of EU ARF documentation just to verify a holder.
        </p>

        <div class="cta">
          <a routerLink="/docs/getting-started" class="btn primary">Get started</a>
          <a
            href="https://gramota-org.github.io/demo-store/"
            class="btn ghost"
            target="_blank"
            rel="noreferrer"
            >Try the live demo →</a
          >
          <a
            href="https://github.com/gramota-org/gramota"
            class="btn ghost"
            target="_blank"
            rel="noreferrer"
            >GitHub</a
          >
        </div>

        <pre class="code"><code>{{ sample }}</code></pre>
      </div>
    </section>

    <!-- Live demo callout — full-bleed band with a screenshot-worthy
         CTA. Sits between the hero and the "Why now" so the first
         scroll lands on something interactive. -->
    <section class="demo-callout">
      <div class="container">
        <p class="eyebrow eyebrow-on-dark">Live demo · no install</p>
        <h2>Click through a real EUDIW verification flow.</h2>
        <p class="lede">
          Solnce — a fictional storefront powered by Gramota — runs every
          checkout through a real OID4VP age, residency, or identity check
          against the SaaS deployed in Falkenstein. Scan with an EU
          wallet, or use the in-browser simulator.
        </p>
        <a
          href="https://gramota-org.github.io/demo-store/"
          class="btn primary"
          target="_blank"
          rel="noreferrer"
          >Open the demo storefront →</a
        >
      </div>
    </section>

    <!-- How it works — 3 figures mirroring the demo app's three screens.
         The figures are SVG mockups of the live demo, not stylised
         infographics: a screenshot of the demo and the figure should
         read as the same UI. -->
    <section class="how">
      <div class="container how-container">
        <h2>How it works</h2>
        <p class="how-lede">
          Watch a real checkout in 24 seconds. Or try it yourself with the
          <a href="https://gramota-org.github.io/demo-store/" target="_blank" rel="noreferrer">live demo</a>.
        </p>

        <div class="how-video" #videoWrap>
          <video
            #demoVideo
            src="demo-reel/demo.mp4"
            poster="demo-reel/poster.jpg"
            autoplay
            loop
            muted
            playsinline
            preload="metadata"
            aria-label="24-second demo: a customer buys an age-restricted product, proves their age with their phone, order completes."
            (click)="toggleMute(demoVideo)"
          ></video>
          <button
            class="audio-toggle"
            type="button"
            [class.muted]="demoVideo.muted"
            [attr.aria-label]="demoVideo.muted ? 'Unmute video' : 'Mute video'"
            (click)="toggleMute(demoVideo)"
          >
            <svg
              *ngIf="demoVideo.muted"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              aria-hidden="true"
            >
              <path d="M3 9v6h4l5 4V5L7 9H3zm13.59 3l2.7-2.7-1.41-1.41L15.18 10.6 12.48 7.9 11.07 9.31l2.7 2.69-2.7 2.7 1.41 1.41 2.7-2.7 2.7 2.7 1.41-1.41-2.7-2.7z" fill="currentColor"/>
            </svg>
            <svg
              *ngIf="!demoVideo.muted"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              aria-hidden="true"
            >
              <path d="M3 9v6h4l5 4V5L7 9H3zm10.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05a4.5 4.5 0 0 0 2.5-4.02zM14 3.23v2.06a7 7 0 0 1 0 13.41v2.06a9 9 0 0 0 0-17.53z" fill="currentColor"/>
            </svg>
            <span>{{ demoVideo.muted ? 'Unmute' : 'Mute' }}</span>
          </button>
        </div>

        <ol class="how-steps">
          <li>
            <span class="step">1</span>
            <strong>Customer picks an item</strong>
            <span>Each product shows what's needed to buy it — for example "18+" or "EU resident".</span>
          </li>
          <li>
            <span class="step">2</span>
            <strong>They prove it on their phone</strong>
            <span>One tap in their EU digital ID wallet. No password, no document upload, no waiting.</span>
          </li>
          <li>
            <span class="step">3</span>
            <strong>Checkout completes</strong>
            <span>Only the bits you asked about are shared. Their full ID stays on their phone.</span>
          </li>
        </ol>
      </div>
    </section>

    <section class="why">
      <div class="container">
        <h2>Why now</h2>
        <p>
          The EU Digital Identity Wallet is mandatory by 2027. Every regulated
          digital business — banks, telcos, fintech, age-gated commerce —
          needs to integrate. The existing identity SDKs are heavy,
          Kotlin-first, and built for identity specialists.
        </p>
        <p><strong>Gramota is TypeScript-native, opinionated, and builds in 1.5s.</strong></p>
      </div>
    </section>

    <section class="standards">
      <div class="container">
        <h2>Standards covered</h2>
        <table>
          <tbody>
            <tr><td>eIDAS 2 / EUDIW</td><td>EU Reg. 2024/1183</td></tr>
            <tr><td>OID4VCI</td><td>Pre-auth + auth-code, Draft 13 + 15 normalized</td></tr>
            <tr><td>OID4VP</td><td>Final 1.0 with DCQL responses</td></tr>
            <tr><td>SD-JWT-VC</td><td>Selective-disclosure verifiable credentials</td></tr>
            <tr><td>DPoP (RFC 9449)</td><td>Sender-constrained tokens, both sides</td></tr>
            <tr><td>JAR (RFC 9101)</td><td>Signed authorization requests, x509_san_dns</td></tr>
            <tr><td>IETF Token Status List</td><td>Credential revocation/suspension</td></tr>
            <tr><td>x5c chain validation</td><td>RFC 7515 §4.1.6</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="cta-block">
      <div class="container">
        <h2>Ship a verifier this afternoon.</h2>
        <a routerLink="/docs/getting-started" class="btn primary">Read the docs</a>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }

    .container {
      max-width: var(--container);
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .hero {
      padding: 6rem 0 4rem;
      text-align: center;
    }
    .eyebrow {
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-size: 0.75rem;
      color: rgb(var(--muted));
      font-weight: 600;
      margin: 0 0 1.5rem;
    }
    .hero h1 {
      font-size: clamp(2.25rem, 5vw, 3.75rem);
      line-height: 1.05;
      letter-spacing: -0.02em;
      font-weight: 800;
      margin: 0 0 1.25rem;
    }
    .grad {
      background: linear-gradient(135deg, #4f46e5, #ec4899);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .lede {
      font-size: 1.125rem;
      max-width: 40rem;
      margin: 0 auto 2rem;
      color: rgb(var(--muted));
    }
    .cta {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 3rem;
    }
    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.95rem;
      text-decoration: none;
      transition: transform 80ms, box-shadow 80ms;
    }
    .btn:hover { transform: translateY(-1px); }
    .btn.primary {
      background: rgb(var(--accent));
      color: white;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    .btn.primary:hover { box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25); }
    .btn.ghost {
      background: transparent;
      color: rgb(var(--fg));
      border: 1px solid rgb(var(--border));
    }
    .btn.ghost:hover { border-color: rgb(var(--accent)); }

    .code {
      background: rgb(var(--code-bg));
      color: rgb(var(--code-fg));
      padding: 1.25rem 1.5rem;
      border-radius: 0.75rem;
      font-family: 'JetBrains Mono', 'SF Mono', Consolas, monospace;
      font-size: 0.875rem;
      line-height: 1.6;
      text-align: left;
      max-width: 36rem;
      margin: 0 auto;
      overflow-x: auto;
      white-space: pre;
      box-shadow: 0 10px 40px -12px rgba(0, 0, 0, 0.15);
    }

    .why, .standards, .cta-block {
      padding: 4rem 0;
      border-top: 1px solid rgb(var(--border));
    }
    .why p, .standards p {
      max-width: 40rem;
      margin: 0 auto 1rem;
      color: rgb(var(--muted));
    }
    h2 {
      font-size: 1.875rem;
      letter-spacing: -0.01em;
      font-weight: 700;
      margin: 0 0 1.5rem;
      text-align: center;
    }

    table {
      width: 100%;
      max-width: 40rem;
      margin: 0 auto;
      border-collapse: collapse;
      font-size: 0.95rem;
    }
    table td {
      padding: 0.75rem 0;
      border-bottom: 1px solid rgb(var(--border));
    }
    table td:first-child {
      font-weight: 600;
      width: 16rem;
    }
    table td:last-child { color: rgb(var(--muted)); }

    .cta-block { text-align: center; }

    /* Demo-callout band — gradient background between hero and "Why now"
       so the first scroll past the hero lands on something interactive. */
    .demo-callout {
      padding: 4rem 0;
      text-align: center;
      background: linear-gradient(135deg, #4f46e5, #ec4899);
      color: white;
      border-top: 0;
      border-bottom: 0;
    }
    .demo-callout .container { max-width: 44rem; }
    .demo-callout .eyebrow-on-dark {
      color: rgba(255, 255, 255, 0.8);
    }
    .demo-callout h2 {
      color: white;
      font-size: 2rem;
      letter-spacing: -0.01em;
      margin: 0 0 1rem;
    }
    .demo-callout .lede {
      color: rgba(255, 255, 255, 0.9);
      max-width: 36rem;
      margin: 0 auto 2rem;
      font-size: 1.0625rem;
    }
    .demo-callout .btn.primary {
      background: white;
      color: rgb(var(--accent));
    }
    .demo-callout .btn.primary:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
    }

    /* "How it works" — three-column triptych mirroring the demo app.
       Wider container than the rest so the figures can breathe. */
    .how {
      padding: 5rem 0;
      border-top: 1px solid rgb(var(--border));
    }
    .how-container { max-width: var(--container-wide); }
    .how h2 {
      font-size: 1.875rem;
      letter-spacing: -0.01em;
      font-weight: 700;
      margin: 0 0 0.75rem;
      text-align: center;
    }
    .how-lede {
      text-align: center;
      max-width: 32rem;
      margin: 0 auto 3.5rem;
      color: rgb(var(--muted));
    }
    .how-lede a {
      color: rgb(var(--accent));
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    .how-video {
      position: relative;
      max-width: var(--container);
      margin: 0 auto 4rem;
      border: 1px solid rgb(var(--border));
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 24px 48px -16px rgba(15, 23, 42, 0.18);
      background: white;
    }
    .how-video video {
      display: block;
      width: 100%;
      height: auto;
      aspect-ratio: 16 / 9;
      cursor: pointer;
    }
    .audio-toggle {
      position: absolute;
      top: 1rem;
      right: 1rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.875rem 0.5rem 0.75rem;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      background: rgba(15, 23, 42, 0.78);
      color: white;
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      backdrop-filter: blur(8px);
      transition: background 120ms, transform 120ms;
      z-index: 2;
    }
    .audio-toggle:hover { background: rgba(15, 23, 42, 0.92); }
    .audio-toggle.muted {
      background: linear-gradient(135deg, #4f46e5, #ec4899);
      border-color: transparent;
      animation: audio-toggle-pulse 2.4s ease-in-out infinite;
    }
    .audio-toggle.muted:hover {
      filter: brightness(1.05);
    }
    @keyframes audio-toggle-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.55); }
      50% { box-shadow: 0 0 0 10px rgba(236, 72, 153, 0); }
    }
    .audio-toggle svg { display: block; }

    .how-steps {
      list-style: none;
      padding: 0;
      margin: 0 auto;
      max-width: var(--container);
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
    .how-steps li {
      display: grid;
      grid-template-columns: auto 1fr;
      grid-template-rows: auto auto;
      column-gap: 0.875rem;
      row-gap: 0.25rem;
      align-items: start;
    }
    .how-steps .step {
      grid-row: 1 / span 2;
      align-self: start;
      width: 1.75rem;
      height: 1.75rem;
      line-height: 1.75rem;
      text-align: center;
      border-radius: 999px;
      background: linear-gradient(135deg, #4f46e5, #ec4899);
      color: white;
      font-weight: 800;
      font-size: 0.875rem;
      flex-shrink: 0;
    }
    .how-steps strong {
      font-weight: 700;
      font-size: 1rem;
      letter-spacing: -0.01em;
    }
    .how-steps li > span:last-child {
      color: rgb(var(--muted));
      font-size: 0.9rem;
      line-height: 1.5;
    }

    @media (max-width: 48rem) {
      .how-steps {
        grid-template-columns: 1fr;
        gap: 1.25rem;
      }
    }
  `,
})
export default class Home {
  readonly sample = `import { Verifier } from "@gramota/verifier";
import { StaticTrustResolver } from "@gramota/trust";

const verifier = new Verifier({
  audience: "https://my-bank.com",
  trust: new StaticTrustResolver([issuerJwk]),
});
const result = await verifier.presentations.verify(token, { nonce });
if (result.ok) console.log(result.claims);`;

  toggleMute(video: HTMLVideoElement) {
    video.muted = !video.muted;
    if (!video.muted) {
      // chrome may have paused the video when autoplay started muted —
      // make sure it keeps playing once the user opts into audio.
      void video.play().catch(() => undefined);
    }
  }
}
