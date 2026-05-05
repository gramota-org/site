---
title: One-time-use credentials end-to-end
slug: recipes/one-time-use-credentials
description: Issue a pool, present from the pool, refill the pool. The unlinkable-presentation pattern in 50 lines.
section: Recipes
order: 2
---

# One-time-use credentials end-to-end

The privacy-preserving pattern: each presentation reveals a credential
the verifier has never seen before, so two visits to the same store
can't be correlated.

## The shape

```
issuer  ──[10 credentials]──►  wallet  ──[1 credential]──►  verifier
                                  │
                                  │  ──[1 credential]──►   another verifier
                                  │
                                  ▼
                            pool drops to 1
                                  │
                                  ▼
                              ───[10 more]───
```

Each credential in the pool is bound to a different holder key, has
fresh disclosure salts, and is used exactly once. After 10 presentations,
the wallet asks for another batch.

## The issuer side

Already covered in [batch issuance guide](/docs/guides/batch-issuance).
Two prerequisites:

1. Advertise `batch_credential_issuance` in metadata.
2. Use `Issuer.issueBatch()` instead of `Issuer.issue()`.

## The wallet side

`@gramota/holder` ships the building blocks but **not** a built-in
"one-time-use" policy — the SDK is intentionally lower-level than that.
Its `CredentialsApi` exposes:

- `receive(token, options)` — validate and store an issued SD-JWT-VC.
- `list(query?)` — read out the credentials matching a query.
- `get(id)` — read one by id.
- `present({ credentialId, disclose, audience, nonce })` — render
  one credential as an SD-JWT-VC presentation (issuer JWT +
  selected disclosures + KB-JWT).

The one-time-use policy is *layered on top*: persistent state outside
the SDK that tracks which credential ids you've already presented.

## A minimal one-time-use wrapper

```ts
import { Holder, InMemoryCredentialStore } from "@gramota/holder";

const holder = new Holder({
  store: new InMemoryCredentialStore(),
  // Holder needs a signer for proof JWTs (during issuance) and
  // KB-JWTs (during presentation). Either { privateKey, publicKey,
  // alg } shorthand or { signer: <Signer Strategy> } in production.
  publicKey: holderPublicJwk,
  privateKey: holderPrivateJwk,
  alg: "ES256",
});

// Simple "have I used this id yet" map — production uses durable storage.
const usedIds = new Set<string>();

async function presentOnce(opts: {
  vct: string;
  audience: string;
  nonce: string;
  disclose: readonly string[];
}): Promise<string> {
  // CredentialQuery filters on issuer/withClaim. To filter by vct,
  // pull all and check parsed.payload.vct in app code.
  const all = await holder.credentials.list();
  const candidates = all.filter(
    (c) => c.parsed.payload["vct"] === opts.vct,
  );
  const fresh = candidates.find((c) => !usedIds.has(c.id));
  if (!fresh) throw new Error("pool empty — refill from issuer");

  const presentation = await holder.credentials.present({
    credentialId: fresh.id,
    disclose: opts.disclose,
    audience: opts.audience,
    nonce: opts.nonce,
  });

  usedIds.add(fresh.id);
  return presentation;
}
```

## Refilling the pool

When the pool is low, call your issuer for another batch. With
`@gramota/holder`, the `offers.accept(url, options)` flow handles
the OID4VCI round-trip:

```ts
async function refill(offerUrl: string): Promise<number> {
  // The issuer's offer URL covers ONE credential by default. To get
  // a pool, the issuer either (a) responds to a single offer with
  // batched credentials when the wallet asks (numberOfCredentials
  // hint via the wallet's batch_credential_issuance support), or
  // (b) hands you N pre-auth codes — call accept() N times.
  await holder.offers.accept(offerUrl, {
    trustedIssuers: [issuerJwk],
  });

  const total = (await holder.credentials.list()).length;
  return total;
}
```

The currently-published `Holder.offers.accept` consumes one offer →
one credential (or more, if the issuer's response carries
`credentials: [...]` per Draft 15). For "always have ≥ 2 in the pool",
wrap this with a check:

```ts
const all = await holder.credentials.list();
const remaining = all
  .filter((c) => c.parsed.payload["vct"] === "urn:eudi:pid:1")
  .filter((c) => !usedIds.has(c.id))
  .length;

if (remaining < 2) {
  await refill(yourIssuerOfferUrl);
}
```

## Verifier side: nothing changes

The verifier doesn't know or care that this credential is one-time-use.
It runs the same 12 checks as for any other SD-JWT-VC. The only
visible difference: `cnf.jwk` is fresh per presentation, so the
verifier can't link two presentations from the same wallet.

## When you don't want this

For credentials that *should* be linkable across visits — login
sessions, "remember me" tokens, loyalty cards — issue a single
long-lived credential instead. Batch issuance is opt-in per
credential type.

The right mental model: **batch = identity**, **single = session**.
A PID (proof of identity) wants batch. A "you've checked in here
before" badge wants single, because the linkability is the point.

## Cost

Issuance is your most expensive operation (signing N credentials, each
with N round-trips to your KMS for the signing call). Plan for ~10×
the issuance load if you go batch-by-default.

The verifier side is free — same compute as single-credential
verification, no extra round-trips.
