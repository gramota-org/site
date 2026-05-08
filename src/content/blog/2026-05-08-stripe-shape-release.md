---
title: "@gramota/sdk, @gramota/core, and one shape for every package"
slug: 2026-05-08-stripe-shape-release
description: A structural release. New top-level facade, new shared base, every client reads as one product instead of fifteen. Old shapes removed in the same cycle — no deprecations.
date: 2026-05-08
author: Petromil Pavlov
---

# @gramota/sdk, @gramota/core, and one shape for every package

Today's release is structural. Runtime behaviour is unchanged; the
public surface got tightened so that the fifteen packages now read
as one product instead of fifteen separately-designed ones.

Two new packages, two reshaped clients, one shared base, **and the
old shapes removed in the same cycle**. There's exactly one way to
call each thing. Versions on npm right now:

- `@gramota/sdk@0.2.0` — top-level facade (new)
- `@gramota/core@0.2.1` — shared primitives (new)
- `@gramota/verifier@0.5.0` — Stripe-shaped namespaces, flat methods removed
- `@gramota/qr@0.4.0` — `QrClient` class, loose factories removed
- `@gramota/jose@0.3.0` — `Fetcher` re-export removed (import from `@gramota/core`)
- everything else — patch bump for the `GramotaError` retrofit

## What changed and why

### One client, one shape

Before today, the verifier was a flat surface:

```ts
verifier.verify(token, opts);       // gone
verifier.response(rawBody, opts);   // gone
verifier.request(opts);             // gone
```

The holder + issuer were already namespaced (`holder.credentials.*`,
`issuer.credentials.*`), but the verifier predated that convention.
Inconsistent inside one product. Fixed:

```ts
verifier.presentations.verify(token, opts);
verifier.responses.verify(rawBody, opts);
verifier.requests.create(opts);
```

Every client now reads `client.<resource>.<verb>` — same shape Stripe,
AWS SDK v3, and the modern OpenAI client all use. The flat methods
have been removed; this is the only public shape now.

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
default renderer — `qr.fromUrl(...)` works the same. The loose factory
re-exports (`fromUrl`, `fromAuthorizationRequest`, `fromCredentialOffer`)
that used to be available as named imports have been removed; pick
either `qr.*` or `new QrClient({...}).*`.

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

## Migration

If you upgraded to 0.4.0/0.3.0 yesterday and saw deprecation
warnings, fix the call sites the warnings pointed at — that's the
only change. Runtime behaviour is identical; the type-checker tells
you exactly what to change.

If you're upgrading from earlier (0.2 → today), the changes you'll
hit are concentrated in three places:

- `verifier.verify(...)` → `verifier.presentations.verify(...)` (and
  `.response` / `.request` similarly).
- `import { Fetcher } from "@gramota/jose"` → `from "@gramota/core"`.
- `import { fromUrl } from "@gramota/qr"` → use `qr.fromUrl(...)` or
  `new QrClient({...}).fromUrl(...)`.

Per-package error classes still extend their own subclasses
(`VerifierError`, `IssuerError`, etc.) — those are unchanged. The
new bit is `instanceof GramotaError` works as a single catch.

— [`@gramota/sdk` on npm](https://www.npmjs.com/package/@gramota/sdk)
· [GitHub](https://github.com/gramota-org/gramota)
· [Demo](https://gramota-org.github.io/demo-store/)
