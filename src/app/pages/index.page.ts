import { Component } from '@angular/core';
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
  imports: [RouterLink],
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
          One end-to-end flow, three screens. Mirrors what you see in the
          <a href="https://gramota-org.github.io/demo-store/" target="_blank" rel="noreferrer">live demo</a>.
        </p>
        <div class="how-grid">
          <figure>
            <div class="how-frame">
              <img src="figures/01-storefront.svg" alt="Storefront with three product cards — rakia, festival ticket, CBD oil — each badged with the verification checks they require."/>
            </div>
            <figcaption>
              <span class="step">1</span>
              <h3>Browse the storefront</h3>
              <p>
                Each product carries badges for the EU-law checks that gate
                its purchase: <strong>18+</strong>, <strong>EU resident</strong>,
                <strong>ID required</strong>. Click any item to start checkout.
              </p>
            </figcaption>
          </figure>
          <figure>
            <div class="how-frame">
              <img src="figures/02-verifying.svg" alt="Verification screen with a QR code, a list of pulsing active checks, and a four-button simulator for screen-recording without a real wallet."/>
            </div>
            <figcaption>
              <span class="step">2</span>
              <h3>Scan with your wallet</h3>
              <p>
                The verifier mints a real OID4VP session. Either scan the QR
                with the EU Digital Identity Wallet, or use the in-browser
                simulator — same flow, no install needed.
              </p>
            </figcaption>
          </figure>
          <figure>
            <div class="how-frame">
              <img src="figures/03-verified.svg" alt="Result screen showing each check with a green check mark — age_over_18, residency_eu, identity_verified — and the disclosed claims footer."/>
            </div>
            <figcaption>
              <span class="step">3</span>
              <h3>Verified — order complete</h3>
              <p>
                Every check passes the verifier's 12-step pipeline. Result is
                an audit-ready record: which check passed, what was disclosed,
                what stayed private.
              </p>
            </figcaption>
          </figure>
        </div>
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
      max-width: 56rem;
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
    .how-container { max-width: 76rem; }
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
    .how-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2.5rem;
    }
    .how-grid figure {
      margin: 0;
      display: flex;
      flex-direction: column;
    }
    .how-frame {
      border: 1px solid rgb(var(--border));
      border-radius: 0.75rem;
      overflow: hidden;
      background: white;
      aspect-ratio: 3 / 2;
      box-shadow: 0 8px 24px -10px rgba(0, 0, 0, 0.1);
    }
    .how-frame img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .how-grid figcaption {
      padding: 1.25rem 0 0;
    }
    .how-grid .step {
      display: inline-block;
      width: 1.75rem;
      height: 1.75rem;
      line-height: 1.75rem;
      text-align: center;
      border-radius: 999px;
      background: linear-gradient(135deg, #4f46e5, #ec4899);
      color: white;
      font-weight: 800;
      font-size: 0.875rem;
      margin-bottom: 0.75rem;
    }
    .how-grid h3 {
      font-size: 1.125rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
      letter-spacing: -0.01em;
    }
    .how-grid figcaption p {
      margin: 0;
      color: rgb(var(--muted));
      font-size: 0.95rem;
      line-height: 1.55;
    }

    @media (max-width: 64rem) {
      .how-grid {
        grid-template-columns: 1fr;
        gap: 3rem;
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
const result = await verifier.verify(token, { nonce });
if (result.ok) console.log(result.claims);`;
}
