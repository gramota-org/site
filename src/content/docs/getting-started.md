---
title: Getting started
slug: getting-started
description: Install Gramota and ship a verifier in 5 minutes.
section: Getting started
order: 1
---

# Getting started

The fastest path from "I just heard about EUDIW" to a working verifier
that returns parsed claims is about five minutes. Here it is.

## Install

```bash
pnpm add @gramota/verifier @gramota/trust
# or: npm install @gramota/verifier @gramota/trust
# or: yarn add @gramota/verifier @gramota/trust
```

You need Node.js 20+. The packages are pure ESM and ship signed
[provenance attestations](https://docs.npmjs.com/generating-provenance-statements).

## Verify a presentation

```ts
import { Verifier } from "@gramota/verifier";
import { StaticTrustResolver } from "@gramota/trust";

const verifier = new Verifier({
  audience: "https://my-bank.com",
  trust: new StaticTrustResolver([issuerJwk]),
});

const result = await verifier.presentations.verify(presentationToken, {
  nonce: "n-12345",
});

if (result.ok) {
  console.log(result.claims);   // { given_name: "Greta", ... }
  console.log(result.metadata); // { issuer, audience, issuedAt, ... }
} else {
  console.log(result.failedCheck); // e.g. "kb-jwt.audience"
  console.log(result.reason);
}
```

That's it. Twelve named security checks run in order — parse, trust,
issuer signature, hash binding, KB-JWT presence/cnf/sig/aud/nonce/time/transcript,
status. If anything fails, `result.failedCheck` tells you which one.

> The `Verifier` exposes Stripe-shaped resource namespaces:
> `verifier.presentations.verify`, `verifier.responses.verify`,
> `verifier.requests.create`. The flat methods (`verifier.verify`,
> `.response`, `.request`) still work in 0.x and are marked
> `@deprecated`; they'll be removed in 1.0.

## Or use the top-level facade

If you want one import + one config object instead of wiring each
package separately:

```bash
pnpm add @gramota/sdk @gramota/trust
```

```ts
import { Gramota } from "@gramota/sdk";
import { StaticTrustResolver } from "@gramota/trust";

const gramota = new Gramota({
  verifier: {
    audience: "https://my-bank.com",
    trust: new StaticTrustResolver([issuerJwk]),
  },
});

await gramota.verifier.presentations.verify(token, { nonce });
const code = gramota.qr.fromAuthorizationRequest(req);  // QR for the wallet
```

The facade is additive — pick whichever style fits.

## What's in the box

The high-level packages:

- **`@gramota/sdk`** — top-level Stripe-shaped facade. One import, one config.
- **`@gramota/verifier`** — relying-party verifier (banks, telcos, age-gated commerce).
- **`@gramota/issuer`** — issuer for SD-JWT-VC, including [batch issuance](/docs/guides/batch-issuance) for one-time-use credential pools.
- **`@gramota/holder`** — headless wallet (when you need one programmatically).
- **`@gramota/qr`** — QR-code rendering for the deep links you hand to wallets.

And the building blocks underneath, in case you need finer control:

- **`@gramota/oid4vp`** — request + response wire format, signed JAR, x509_san_dns cert helpers.
- **`@gramota/oid4vci`** — pre-auth + auth-code, PAR, DPoP both sides.
- **`@gramota/sd-jwt`** — SD-JWT-VC parser, hash binding, KB-JWT.
- **`@gramota/jose`** — JWS sign + verify, x5c chain validation, pluggable Signer Strategy.
- **`@gramota/trust`** — `TrustResolver`: Static, JwksUrl, SdJwtVcIssuer, custom.
- **`@gramota/status-list`** — IETF Token Status List + StatusResolver Strategy.
- **`@gramota/core`** — foundation: `Fetcher` transport interface, `GramotaError` base class. Re-exported by every other package.

## Where to next

- [SD-JWT-VC explained](/docs/concepts/sd-jwt-vc) — the credential format the
  EU is settling on, demystified for web devs.
- The [GitHub repo](https://github.com/gramota-org/gramota) — clone it,
  run `pnpm demo:self-loop`, watch a credential flow through Issuer →
  Holder → Verifier in 1.5 seconds.
- The [`@gramota/verifier` package README](https://www.npmjs.com/package/@gramota/verifier)
  — full API surface, error codes, configuration knobs.
