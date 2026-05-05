---
title: Verified end-to-end against the EU reference wallet
slug: 2026-05-end-to-end-eu-wallet
description: Issuance + verification both round-trip cleanly with the official EUDIW Android wallet, with batch issuance landing in 0.3.
date: 2026-05-05
author: Petromil Pavlov
---

We just shipped `@gramota/issuer@0.3.0` with batch issuance, and the
EU reference wallet on Android emulator now mints a fresh pool of 10
unlinkable credentials per offer. Both halves of the protocol —
issuance via OID4VCI and verification via OID4VP — round-trip cleanly
against the official EUDIW Android reference wallet.

## What "end-to-end" means here

Three checkpoints. All green:

1. **Issuance.** `POST /v1/credential-offers` mints an opaque
   pre-auth code. The wallet scans the QR / opens the deep link,
   fetches `/.well-known/openid-credential-issuer`, sees the
   `batch_credential_issuance: { batch_size: 50 }` field, and asks
   for `numberOfCredentials = 10`. The wallet generates 10 distinct
   ES256 keypairs, signs 10 proof JWTs, and POSTs them in one
   `proofs.jwt[]` request. The issuer (`@gramota/issuer.issueBatch`)
   returns 10 SD-JWT-VC tokens, each bound to a different holder key
   with fresh disclosure salts.

2. **Storage.** The wallet's pool fills up. Each credential has its
   own `cnf.jwk` (different from every other credential in the pool),
   different disclosure salts, the same claims. Two presentations of
   the same data, from the same wallet, are unlinkable on the wire.

3. **Verification.** `POST /v1/verifications` mints an OID4VP
   authorization request, signs it with the verifier's X.509 cert
   (`client_id_prefix=x509_san_dns:`), serves the JAR at `/request.jwt`.
   The wallet fetches it, verifies the chain, shows "DATA SHARING
   REQUEST" to the user, presents one credential from the pool. The
   verifier's 12 named security checks all pass. Status: `verified`,
   claims unpacked.

## What ships in 0.3

```
const results = await issuer.credentials.issueBatch({
  subject: { given_name: "Greta", family_name: "Smith", birth_date: "1990-04-15" },
  selectivelyDisclosable: ["given_name", "family_name", "birth_date"],
  vct: "urn:eudi:pid:1",
  expiresIn: 365 * 24 * 3600,
  credentials: holderKeys.map((holderKey) => ({ holderKey })),
});
// results[i].token is bound to holderKeys[i] with fresh salts.
```

Shared options at the top level (subject, vct, expiry,
selectivelyDisclosable). Per-credential bindings in `credentials[]`
(holderKey, optional credentialId, optional status). Sequential
issuance for deterministic error reporting. `issuedAt` pinned once
for the batch so all credentials report the same `iat`.

10 new tests cover happy-path (per-credential `cnf` binding, distinct
`credentialId`s, distinct salts, per-cred overrides, shared expiry),
namespace parity, and validation failures. Full suite: 589 mock + 31
live, all green.

## What surprised us

Two things during the integration:

1. **The wallet silently falls back to single issuance** when the
   issuer's `/.well-known/openid-credential-issuer` doesn't include
   `batch_credential_issuance`. There's no error in the wallet log
   — it just sets `batchCredentialIssuance=NotSupported` and asks
   for 1 credential. We caught it on the second emulator round
   because we'd left `numberOfCredentials = 10` in the wallet config
   but the wallet kept issuing 1. Symptom-cause distance was high.

2. **Hands-on demos blow through 5-minute offer TTLs.** PIN entry
   plus the wallet's "review what you're consenting to" screen
   regularly took 60–90 seconds, but if anything else interrupted
   (notifications, a phone call, anything) the offer was expired
   when the wallet finally hit `/token`. Bumped the TTL to 30
   minutes for hands-on; production with real users probably wants
   15.

## What's actually in the box

- `@gramota/verifier@0.2.0` — relying-party verifier (12 checks).
- `@gramota/issuer@0.3.0` — batch issuance.
- `@gramota/oid4vci@0.2.0` — Draft 13 + 15 normalization, DPoP both sides.
- `@gramota/oid4vp@0.2.0` — request + response, signed JAR, `x509_san_dns`.
- `@gramota/sd-jwt`, `@gramota/jose`, `@gramota/trust`,
  `@gramota/dcql`, `@gramota/status-list`, `@gramota/credential-format`,
  `@gramota/holder`, `@gramota/presentation-exchange` — the building
  blocks underneath.

All on npm under [`@gramota`](https://www.npmjs.com/org/gramota), all
with [signed provenance attestations](https://docs.npmjs.com/generating-provenance-statements)
linking each tarball to a GitHub commit.

## What's next

- Public docs site (this thing).
- Postgres + Redis durability for the SaaS so it scales past
  `pnpm dev`.
- Status-list publication route.
- mDoc (ISO 18013-5) format support — currently SD-JWT-VC only.
- Signup + Stripe so the SaaS becomes a product, not a demo.

If you're building anything that touches the EU Digital Identity Wallet
in TypeScript, please [try Gramota](/docs/getting-started) and tell
us where it breaks. The whole point of going OSS-first was to take
the punches before paying customers arrive.

Source: [`gramota-org/gramota`](https://github.com/gramota-org/gramota).
