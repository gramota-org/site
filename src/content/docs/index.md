---
title: Documentation
slug: docs-index
description: Quick links to the guides, concepts, recipes, and the auto-generated API reference.
---

# Documentation

Quick links to the guides, concepts, recipes, and the auto-generated
API reference. The fastest path to a working integration is the
[5-minute verifier](/docs/getting-started).

## Getting started

- [**Install + 5-minute verifier**](/docs/getting-started) — install
  the packages and verify your first presentation.

## Concepts

The standards demystified for web developers.

- [**SD-JWT-VC**](/docs/concepts/sd-jwt-vc) — the credential format
  the EU is settling on. Selective disclosure without trusting the
  holder.
- [**OID4VCI**](/docs/concepts/oid4vci) — issuance protocol. The
  OAuth-shaped flow behind every EUDIW credential.
- [**OID4VP**](/docs/concepts/oid4vp) — verification protocol. How
  the verifier asks for claims and gets a response it can trust.
- [**DCQL**](/docs/concepts/dcql) — credential query language. How
  verifiers ask for specific claims, compactly.
- [**DPoP**](/docs/concepts/dpop) — RFC 9449. How OAuth access tokens
  get sender-constrained to the holder's key.

## Guides

End-to-end walk-throughs that produce working code.

- [**Build a verifier**](/docs/guides/verifier) — a 30-line bank-style
  relying party.
- [**Build an issuer**](/docs/guides/issuer) — a 50-line OID4VCI
  pre-authorized-code issuer the EU wallet talks to.
- [**Batch issuance**](/docs/guides/batch-issuance) — mint a pool of
  N independent unlinkable credentials per offer.

## Recipes

Specific scenarios with concrete code.

- [**Verify an EU PID**](/docs/recipes/verifying-eu-pid) — talk to
  the EU Commission's reference issuer, retrieve a real PID,
  verify it.
- [**One-time-use credentials**](/docs/recipes/one-time-use-credentials) —
  issue a pool, present from the pool, refill the pool.

## API reference

Auto-generated from each `@gramota/*` package's TypeScript declarations.

### High-level

- [**`@gramota/verifier`**](/docs/api/verifier) — relying-party
  verifier with 12 named security checks.
- [**`@gramota/issuer`**](/docs/api/issuer) — single + batch
  SD-JWT-VC issuance.
- [**`@gramota/holder`**](/docs/api/holder) — headless wallet:
  store, receive, present.

### Protocol & transport

- [**`@gramota/oid4vp`**](/docs/api/oid4vp) — OID4VP wire format,
  signed JAR, `x509_san_dns` cert helpers.
- [**`@gramota/oid4vci`**](/docs/api/oid4vci) — OID4VCI client +
  server, Draft 13/15 normalized, DPoP both sides.
- [**`@gramota/dcql`**](/docs/api/dcql) — DCQL matcher, claim path
  evaluator, selection.
- [**`@gramota/presentation-exchange`**](/docs/api/presentation-exchange) —
  DIF Presentation Exchange v2, for legacy OID4VP 1.0 wallets.

### Cryptography & credentials

- [**`@gramota/jose`**](/docs/api/jose) — JWS sign + verify, x5c
  chain validation, pluggable Signer Strategy.
- [**`@gramota/sd-jwt`**](/docs/api/sd-jwt) — SD-JWT-VC parser, hash
  binding, KB-JWT issuance / verification.
- [**`@gramota/credential-format`**](/docs/api/credential-format) —
  pluggable format-handler registry.

### Trust & revocation

- [**`@gramota/trust`**](/docs/api/trust) — `TrustResolver`: Static,
  JwksUrl, SdJwtVcIssuer (`.well-known/jwt-vc-issuer`).
- [**`@gramota/status-list`**](/docs/api/status-list) — IETF Token
  Status List + `StatusResolver` Strategy.
