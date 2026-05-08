---
title: "@gramota/sdk, @gramota/core, and Stripe-shaped namespaces across every package"
slug: 2026-05-08-stripe-shape-release
description: A structural release. New top-level facade, new shared base, every client now reads as one product instead of fifteen.
date: 2026-05-08
author: Petromil Pavlov
---

# @gramota/sdk, @gramota/core, and Stripe-shaped namespaces across every package

Today's release is structural. Runtime behaviour is unchanged; the
public surface got tightened so that the fifteen packages now read
as one product instead of fifteen separately-designed ones.

Two new packages, two reshaped clients, one shared base. Versions on
npm right now:

- `@gramota/sdk@0.2.0` — top-level facade (new)
- `@gramota/core@0.2.0` — shared primitives (new)
- `@gramota/verifier@0.4.0` — Stripe-shaped namespaces + the require predicate hook
- `@gramota/qr@0.3.0` — `QrClient` class
- everything else — patch bump for the `GramotaError` retrofit

Migration is opt-in. Every old call site keeps working through 1.0.

## What changed and why

### One client, one shape

Before today, the verifier was a flat surface:

```ts
verifier.verify(token, opts);
verifier.response(rawBody, opts);
verifier.request(opts);
```

The holder + issuer were already namespaced (`holder.credentials.*`,
`issuer.credentials.*`), but the verifier predated that convention.
Inconsistent inside one product. Fixed:

```ts
verifier.presentations.verify(token, opts);   // was verifier.verify
verifier.responses.verify(rawBody, opts);     // was verifier.response
verifier.requests.create(opts);               // was verifier.request
```

Every client now reads `client.<resource>.<verb>` — same shape Stripe,
AWS SDK v3, and the modern OpenAI client all use. The flat methods
stay alive, marked `@deprecated`, removed in 1.0. Migrate at your pace.

### One import for the common case

`@gramota/sdk` is the new top-level facade:

```ts
import { Gramota } from "@gramota/sdk";

const gramota = new Gramota({
  verifier: { audience: "https://my-bank.com", trust },
  qr: { errorCorrection: "H" },
});

await gramota.verifier.presentations.verify(token, { nonce });
const code = gramota.qr.fromAuthorizationRequest(req);
```

What you get over wiring four packages by hand:

1. **One config object.** `audience`, `trust`, `issuerKey` flow to the
   verifier without you wiring them. Future shared options (telemetry,
   retry, request-id headers) plug in here once.
2. **Lazy instantiation.** Properties construct their underlying
   client on first access. If you only use `.verifier`, the issuer
   never loads.
3. **One mental model.** Mirrors `new Stripe(key).customers.create()` —
   if you've used a modern API client, you already know how this works.

The individual packages still work standalone; the facade is additive.

### One error to catch

Every per-package error class (`VerifierError`, `IssuerError`,
`HolderError`, `QrError`, `JoseError`, `SdJwtError`, etc. — thirteen of
them) now extends `GramotaError` from the new `@gramota/core` package:

```ts
import { isGramotaError } from "@gramota/core";

try {
  await verifier.presentations.verify(token, opts);
} catch (err) {
  if (isGramotaError(err)) {
    telemetry.recordError(err.name, err.code);  // type-safe across packages
  }
  throw err;
}
```

Existing `instanceof VerifierError` and `error.code === "..."` checks
still work — the per-package codes (`SecurityCheckName`,
`IssuerErrorCode`, etc.) are unchanged.

`@gramota/core` also hosts the `Fetcher` transport interface, which
used to live in `@gramota/jose` for historical reasons. `@gramota/jose`
re-exports it for back-compat through 1.0.

### One QR client

`@gramota/qr` was originally three loose factory functions on a
namespace. It's now a class that you can configure once and reuse,
matching the rest of the SDK:

```ts
import { QrClient } from "@gramota/qr";

const qr = new QrClient({
  renderer: customRenderer,   // strategy override
  errorCorrection: "H",       // default for every code this client builds
  width: 512,
});

const code = qr.fromUrl("openid4vp://…");
await code.toDataUrl();       // <img src=...>
```

The default `qr` singleton is now an instance of `QrClient` with the
default renderer — `qr.fromUrl(...)` keeps working without change.
This was the lowest-blast-radius reshape since the package was barely
24 hours old.

## Test surface

666 passing tests across 66 test files in the monorepo. Up from 632 —
the new packages and the namespace coverage added 34. Zero regressions.

## What's next

- **`verifier.trustedIssuers.*`** — namespace for trust-list operations
  (currently scattered between `@gramota/trust` and the `Verifier`
  config). Lands when the EU LoTL ingestion code does.
- **`verifier.statusLists.*`** — same for status-list resolution.
- **Idempotency keys + retry policy on `@gramota/sdk`** — Stripe-style.
  This is a 1.0 thing.
- **Removing the deprecated flat methods** — 1.0.

If you've integrated against 0.2 or 0.3, this is your nudge to bump
to the new versions and switch to the namespace shape one method at
a time. The deprecation warnings will tell you where.

— [`@gramota/sdk` on npm](https://www.npmjs.com/package/@gramota/sdk)
· [GitHub](https://github.com/gramota-org/gramota)
· [Demo](https://gramota-org.github.io/demo-store/)
