---
title: OID4VP explained
slug: concepts/oid4vp
description: How a verifier asks a wallet for claims and gets back a presentation it can trust.
section: Concepts
order: 3
---

OID4VP ("OpenID for Verifiable Presentations") is the verification half
of the loop. A wallet shows a credential to a verifier, the verifier
checks it. Like OID4VCI, it sits on top of OAuth and reuses its
vocabulary — `client_id`, `nonce`, `state`, `response_type`.

## The flow

```
                   verifier                                wallet
                   ────────                                ──────
1. mint request    constructs authz_req                    
                   { response_type=vp_token,
                     client_id=x509_san_dns:my-bank.com,
                     nonce=<random>, state=<random>,
                     dcql_query=<the query> }

2. signed JAR      wraps authz_req in a JWT (RFC 9101),
                   signs with the verifier's X.509 cert,
                   exposes at /request.jwt

3. deep link       openid4vp://?request_uri=…&client_id=…  →   scan QR / link

4. fetch + verify  ←──── GET /request.jwt
                   wallet verifies signature against x5c,
                   user reviews "DATA SHARING REQUEST"

5. present         POST /response                          ←
                     vp_token={...} (DCQL: keyed by query id,
                                     legacy PE: array)
                     state=<echoed>

6. verifier checks
   - signature on the SD-JWT-VC
   - holder binding (KB-JWT cnf vs jwk)
   - audience match (verifier's client_id)
   - nonce match (replay protection)
   - hash binding for selectively-disclosed claims
   - status (Token Status List)
```

## The query: DCQL vs Presentation Exchange

A verifier doesn't just ask "any credential" — it specifies what claims
it needs. Two query languages exist:

- **DCQL** (Digital Credentials Query Language). Compact JSON, native
  to OID4VP 2.0. The EU reference wallet uses this.
- **DIF Presentation Exchange v2.** JSON-Schema-based, predates DCQL.
  Still common in the wild.

A DCQL query for "I need a PID with given_name + family_name + birth_date":

```json
{
  "credentials": [{
    "id": "pid",
    "format": "dc+sd-jwt",
    "meta": { "vct_values": ["urn:eudi:pid:1"] },
    "claims": [
      { "path": ["given_name"] },
      { "path": ["family_name"] },
      { "path": ["birth_date"] }
    ]
  }]
}
```

The wallet matches credentials in its store against this query, lets
the user pick which one to present, and replies with `vp_token` keyed
by query id:

```json
{
  "vp_token": { "pid": "<sd-jwt-vc>~<disclosure>~<disclosure>~<kb-jwt>" }
}
```

## Signed JAR + x509_san_dns

The verifier wraps its authorization request in a JWT signed with an
X.509 certificate (RFC 9101). The cert's `subjectAltName.dNSName` extension
identifies the verifier — `client_id_prefix=x509_san_dns:my-bank.com`
means "trust me iff my cert has `my-bank.com` as a SAN".

This is what lets a verifier onboard without registering with every
wallet upfront. As long as the cert chain validates and the SAN
matches the `client_id`, the wallet will engage.

For SDK code, [`@gramota/oid4vp`](https://www.npmjs.com/package/@gramota/oid4vp)
provides:
- `signAuthorizationRequest({ request, cert })` — builds the JAR.
  Returns `Promise<string>` (the compact-serialised JWS).
- `generateSigningCert({ sanDns, … })` — mints a self-signed cert for
  dev (production uses a real CA-issued cert).
- `signingCertToJwks(cert)` — for publishing the verifier's keys at
  `/.well-known/jwks.json`.

## Audience subtlety

The KB-JWT's `aud` claim binds the presentation to a specific verifier.
Two formats exist in the wild:

- URL form — `aud: "https://my-bank.com"` (older convention).
- `x509_san_dns:` form — `aud: "x509_san_dns:my-bank.com"` (used by
  the EU reference wallet for `x509_san_dns` client_id_prefix).

Configure your verifier to accept both via
`additionalAudiences` in the [`Verifier`](/docs/guides/verifier)
config. Production wallets in the wild send the latter.

## Reading the spec

[OID4VP Final 1.0](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html).
§5 is the request, §6 is the response, §A.3.1.1 is the `x509_san_dns`
prefix. DCQL is in its own [draft](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#name-digital-credentials-query-l).
