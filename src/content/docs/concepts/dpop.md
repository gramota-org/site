---
title: DPoP — sender-constrained tokens
slug: concepts/dpop
description: How RFC 9449 binds an OAuth access token to a key only the rightful client holds.
section: Concepts
order: 5
---

A bearer token is bearer — anyone who has it, can use it. Steal a
wallet's access token from a network log, and you can issue yourself
a credential.

DPoP ("Demonstrating Proof of Possession", RFC 9449) closes that
hole. Every protected request includes a fresh JWT signed by a key
the client has registered, and the server validates that the JWT
matches the access token's recorded thumbprint. Token without key =
useless.

## The shape

The client generates an ECDSA keypair once at startup. On every
protected request:

```
Authorization: DPoP eyJhbGciOiJFUzI1NiIsInR5cCI6ImR...
DPoP:          eyJhbGciOiJFUzI1NiIsInR5cCI6ImRwb3Arand0Iiwi...
```

The first header is the access token. The second is a fresh JWT with:

```
header: { alg: ES256, typ: dpop+jwt, jwk: <client's public key> }
payload: {
  htm: "POST",                        // HTTP method
  htu: "https://issuer.example/credential",  // full URL
  iat: 1716000000,                    // issued at, ±60s window
  jti: "...",                         // unique per request — replay prevention
  ath: "<sha-256 of access token>",   // for protected-resource calls
  nonce: "..."                        // optional, server-supplied
}
```

The server verifies:

- Signature over `htm`/`htu`/`iat`/`jti`/`ath` using the `jwk` in the
  header (so the JWT is self-attested).
- `htm` matches the actual HTTP method.
- `htu` matches the actual URL.
- `iat` is within ±60 seconds.
- `jti` hasn't been seen before (replay store, TTL = max DPoP age).
- `ath` matches the access token (when the call carries one).
- `jwk`'s thumbprint (`jkt`) matches what was recorded with the access
  token at /token-time.

## What this protects

| Attack | DPoP defense |
|---|---|
| Token leaks via network log | Attacker has the token but not the private key. Useless. |
| Token leaks via XSS / malicious browser ext | Same — DPoP key in HSM-like storage (or at minimum non-extractable WebCrypto). |
| Replay of an entire request | `jti` tracking — server rejects duplicates within the TTL window. |
| URL substitution (token reuse against different endpoint) | `htu` binding — DPoP JWT only valid for the URL it was minted for. |
| Method downgrade | `htm` binding — same. |

## What this doesn't protect

DPoP isn't end-to-end encryption. The access token still travels in
cleartext over the wire (TLS handles that). A compromised TLS root
or a misconfigured TLS terminator can still see tokens.

DPoP also doesn't protect against a compromised client — if the
attacker controls the wallet itself, they have the DPoP key.

## In Gramota

Server side (you're an issuer or a resource server) — use
`verifyDpopJwt` from `@gramota/oid4vci`:

```ts
import { verifyDpopJwt } from "@gramota/oid4vci";

const { jkt } = await verifyDpopJwt({
  jwt: req.headers.dpop as string,
  htm: "POST",
  htu: "https://issuer.example/oid4vci/token",
  hasSeenJti: (j) => replayStore.has(j),
  recordJti: (j) => replayStore.add(j),
});

// Bind jkt to the access token you're about to issue. On the next
// /credential call, expectedJkt: <this jkt> + expectedAth: <token hash>
// rejects any request with a different DPoP key.
```

Client side (you're building a wallet) — `Oid4vciClient` handles DPoP
automatically; you supply a `dpopSigner` (any `Signer` implementation,
typically `JwkSigner` over a fresh in-memory key) and the client adds
the headers per request:

```ts
import { Oid4vciClient, JwkSigner } from "@gramota/oid4vci";

const client = new Oid4vciClient({
  issuerUrl: "https://issuer.example",
  dpopSigner: await JwkSigner.generate("ES256"),
});

await client.requestCredential({ /* ... */ });
```

## When to skip DPoP

Only when the issuer doesn't advertise it
(`dpop_signing_alg_values_supported` absent from
`/.well-known/oauth-authorization-server`). That metadata field is
how the wallet discovers DPoP support — without it, the wallet falls
back to bearer.

Production EUDIW issuers all advertise DPoP. If you're building one,
turn it on from day 1. The cost is one keypair per session and one
signature per request — negligible compared to the credential signing
itself.

## Reading the spec

[RFC 9449](https://www.rfc-editor.org/rfc/rfc9449.html). §4 is the
header construction, §10 is the threat model. Worth reading once.
