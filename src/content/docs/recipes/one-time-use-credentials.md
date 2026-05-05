---
title: One-time-use credentials end-to-end
slug: recipes/one-time-use-credentials
description: Issue a pool, present from the pool, refill the pool. The unlinkable-presentation pattern in 50 lines.
section: Recipes
order: 2
---

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

For an SDK-based wallet using `@gramota/holder`:

```ts
import { Holder } from "@gramota/holder";
import { FileCredentialStore } from "@gramota/holder";

const holder = new Holder({
  store: new FileCredentialStore({ path: "./wallet-data.json" }),
});

// One credential per presentation. The wallet picks the next unused
// one from the pool, marks it as used, and presents it.
const presentation = await holder.credentials.present({
  query: dcqlQuery,           // from the verifier's authorization request
  audience: verifierAudience,  // verifier's client_id
  nonce: verifierNonce,        // from the request
  // Picks an unused credential matching the query; updates use count.
  policy: "one-time-use",
});

// Send presentation to the verifier (response_uri / response_mode).
await fetch(verifierResponseUri, {
  method: "POST",
  body: new URLSearchParams({
    vp_token: JSON.stringify(presentation.vpToken),
    state: presentation.state,
  }),
});
```

## Refill the pool

```ts
const remaining = await holder.credentials.poolSize({ vct: "urn:eudi:pid:1" });

if (remaining < 2) {
  // Re-run issuance: holder generates 10 fresh keys, sends 10 proofs,
  // receives 10 credentials back, stores them.
  await holder.credentials.refill({
    issuerUrl: "https://issuer.example.com",
    vct: "urn:eudi:pid:1",
    count: 10,
  });
}
```

In the EU reference wallet, this happens on a background timer (every
~15 minutes, or when the pool drops below `minNumberOfCredentials = 2`).
You can wire the same with a `setInterval` in your wallet app.

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
