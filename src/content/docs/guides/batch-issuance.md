---
title: Batch issuance — one-time-use credentials
slug: guides/batch-issuance
description: Mint a pool of N independent unlinkable credentials per offer, so each presentation reveals a fresh token.
section: Guides
order: 3
---

# Batch issuance — one-time-use credentials

A long-lived credential is a tracking primitive. Every time the same
SD-JWT-VC is presented, verifiers can correlate visits — even
selective-disclosure hash digests are stable per-credential.

The fix: issue *N* independent credentials per offer. Each is bound to
a different holder key, has different disclosure salts, and the holder
uses each one exactly once. After N visits, you ask the issuer for
another batch.

The EU reference wallet does this by default with `numberOfCredentials = 10`.

## What changes vs single-credential issuance

The wire format already supported this in OID4VCI Draft 14/15: the
wallet sends `proofs.jwt: [proof1, proof2, …, proofN]` instead of a
singular `proof: { jwt }`, and the issuer responds with
`credentials: [{credential: …}, …]` instead of singular `credential`.

What you need on the issuer side:

1. Advertise `batch_credential_issuance` in metadata, otherwise wallets
   parse `batchCredentialIssuance=NotSupported` and silently fall back
   to one credential per offer.
2. Verify *every* proof JWT (each has its own `jwk` header).
3. Call `Issuer.issueBatch()` with one entry per holder key.

## On the issuer

Advertise it in `/.well-known/openid-credential-issuer`:

```ts
batch_credential_issuance: { batch_size: 50 },
```

Then in `/oid4vci/credential`:

```ts
import { Issuer } from "@gramota/issuer";
import { parseCredentialRequest } from "@gramota/oid4vci";

const parsed = parseCredentialRequest({ body: req.body });

// Verify each proof — each has its own holder key in the JWT header.
const holderKeys: JsonWebKey[] = [];
for (const proofJwt of parsed.proofJwts) {
  const { protectedHeader } = await jwtVerify(
    proofJwt,
    async (h) => importJWK(h.jwk as JWK, "ES256"),
    { audience: ISSUER_URL },
  );
  holderKeys.push(protectedHeader.jwk as JsonWebKey);
}

// Issue all N credentials in one call.
const results = await issuer.credentials.issueBatch({
  subject: { given_name: "Greta", family_name: "Smith", birth_date: "1990-04-15" },
  selectivelyDisclosable: ["given_name", "family_name", "birth_date"],
  vct: "urn:eudi:pid:1",
  expiresIn: 365 * 24 * 3600,
  credentials: holderKeys.map((holderKey) => ({ holderKey })),
});

reply.send({
  format: "dc+sd-jwt",
  credentials: results.map(({ token }) => ({ credential: token })),
});
```

`results[i]` is bound to `holderKeys[i]`. Each result has fresh
disclosure salts, a distinct `credentialId`, and shares the same
`iat` (pinned once for the batch) so audit logs read cleanly.

## Per-credential overrides

Three things can vary across the batch:

- **`holderKey`** — required, distinct per entry.
- **`credentialId`** — optional override of the random UUID, useful
  when you want database-correlated IDs.
- **`status`** — optional, lets each credential carry a different
  status-list index so they can be revoked independently.

```ts
issuer.credentials.issueBatch({
  // ... shared fields
  credentials: holderKeys.map((holderKey, i) => ({
    holderKey,
    status: {
      status_list: {
        idx: nextStatusIdx + i,
        uri: `${ISSUER_URL}/status/${listId}`,
      },
    },
  })),
});
```

## Why pin issuedAt

`Issuer.issueBatch` snapshots `Math.floor(Date.now()/1000)` once at
the start of the batch and uses it for every credential's `iat`.
Without this, two credentials issued in the same logical batch could
differ by a millisecond — fine for the spec, awkward when you're
debugging an audit log and you can't tell whether two credentials
came from the same offer or two consecutive ones.

You can override with `issuedAt` if you have a transaction timestamp
you want to use instead.

## Sequential, not parallel

`issueBatch` issues credentials sequentially, not via `Promise.all`.
For a 10-credential batch on ES256 this is ~50ms total — the cost
isn't enough to justify the loss of error determinism. If entry 5
fails validation, the call rejects with a clean stack mentioning
entry 5, rather than racing with the other 9.

## Holder-side considerations

The wallet picks one credential from the pool per presentation and
discards it after use. When the pool runs low, the wallet hits the
issuer for a fresh batch — the EU wallet does this automatically when
the pool drops below `minNumberOfCredentials`.

For implementing the wallet side, see [`@gramota/holder`'s
`credentials.import`](https://www.npmjs.com/package/@gramota/holder)
which accepts an array of credentials per import call.

## Verified end-to-end

This loop has been confirmed against the EU reference wallet on
Android emulator: 10 unique SD-JWT-VC tokens issued from one offer,
each bound to a distinct holder key, the wallet's pool fills up
correctly, presentations rotate through.
