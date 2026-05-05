---
title: OID4VCI explained
slug: concepts/oid4vci
description: How a wallet receives a credential from an issuer — the OAuth-shaped protocol behind every EUDIW issuance flow.
section: Concepts
order: 2
---

OID4VCI ("OpenID for Verifiable Credential Issuance") is the protocol
that gets a credential into a wallet. Don't let the name scare you —
it's mostly OAuth 2.0 with three or four extra bytes of vocabulary.

## The two flows

OID4VCI defines two ways to start an issuance:

1. **Pre-authorized code.** The issuer mints a one-time code out-of-band
   (usually printed on a QR), the wallet scans it, no browser login.
   This is what governments use for "you went to the office, you proved
   who you are, here's a code to take home and put in your wallet."
2. **Authorization code.** The wallet opens a browser, the user logs
   into the issuer the normal OAuth way, the issuer hands back a code,
   the wallet redeems it. Used when the issuer wants the user to log
   in (banks, employers, online identity providers).

Both flows end at the same place: the wallet has an `access_token` and
calls the issuer's `/credential` endpoint to receive a signed
credential.

## The wire shape

```
                        wallet                      issuer
                        ──────                      ──────
1. discover             GET /.well-known/openid-credential-issuer  →
                                                                   ←  metadata
2. discover authz       GET /.well-known/oauth-authorization-server →
                                                                   ←  token_endpoint, …

3a. (pre-auth)          POST /token                                →
                          grant_type=…pre-authorized_code
                          pre-authorized_code=<from QR>
                                                                   ←  access_token, c_nonce

3b. (authz code)        browser → /authorize                       →
                                                                   ←  code (via redirect)
                        POST /token  (code + PKCE verifier)        →
                                                                   ←  access_token, c_nonce

4. credential           POST /credential                           →
                          Authorization: DPoP <access_token>
                          DPoP: <jwt over htm/htu/jti/iat/ath>
                          body: { credential_configuration_id,
                                  proofs.jwt: [<proof JWT>, …] }
                                                                   ←  { credentials: [{ credential }, …] }
```

The proof JWT in step 4 is the wallet attesting "this is the public
key I want bound into the credential." The issuer takes the `jwk` from
the JWT header and sticks it in `cnf.jwk` of the issued SD-JWT-VC, so
the credential is bound to a key only that wallet holds.

## DPoP (RFC 9449)

The `Authorization: DPoP <token>` header isn't OAuth's normal `Bearer`.
DPoP "demonstrating proof of possession" makes the access token sender-
constrained: every request includes a fresh JWT signed by a key the
client publishes at the `/token` step, and the server checks the
JWT's `htm` (HTTP method), `htu` (URL), `iat`, `jti` (replay-prevention
nonce), and — for protected-resource calls — `ath` (SHA-256 hash of
the access token).

If an attacker steals the access token, they can't use it without the
matching private key. Production EUDIW wallets all use DPoP.

## Batch issuance (Draft 14/15)

Newer drafts let the wallet ask for N credentials in one round-trip.
The body sends `proofs.jwt: [proof1, proof2, …, proofN]` — one proof
JWT per credential, each signed by a different holder key. The issuer
returns `credentials: [{credential: …}, …]`.

The use case: one-time-use credentials. Each presentation reveals a
fresh credential bound to a fresh key, so verifiers can't correlate
two visits to the same store across time. The EU reference wallet
asks for `numberOfCredentials = 10` by default.

For server-side support, see [`@gramota/issuer`'s `issueBatch()` in
the batch-issuance guide](/docs/guides/batch-issuance).

## In Gramota

Client side (wallet) — `@gramota/oid4vci` provides:
- `Oid4vciClient` — high-level orchestrator (`authorize`, `redeem`, `requestCredential`).
- `requestToken` / `requestCredential` — low-level building blocks if you want full control.
- DPoP signer, PKCE verifier, PAR (Pushed Authorization Requests) helpers.

Server side (issuer) — same package:
- `parseCredentialRequest` — accepts both Draft 13 and Draft 14/15 shapes,
  returns a normalized form your route handler consumes.
- `verifyDpopJwt` — validates the wallet's DPoP proof on `/token` and
  `/credential`. Returns the `jkt` thumbprint for binding to your issued
  access token.
- `buildSubdomainIssuerUrl` — for multi-tenant issuers using subdomains.

For the credential-minting half of the issuer, see
[`@gramota/issuer`](/docs/guides/issuer).

## Reading the spec

If you have to go to the source: [OID4VCI Draft 15](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html).
The endpoint shapes in §6–7 and the metadata shapes in §11 are the
parts that matter for implementers. The rest is mostly OAuth.
