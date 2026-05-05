---
title: A field guide to OID4VCI Draft mismatches
slug: 2026-05-oid4vci-draft-mismatches
description: Real wallets in the wild straddle OID4VCI drafts 13, 14, and 15. The wire-format differences are small but ugly. Here's where they bite, and how to make your issuer accept all of them.
date: 2026-05-06
author: Petromil Pavlov
---

# A field guide to OID4VCI Draft mismatches

If you write an issuer that strictly follows OID4VCI Draft 15, half
of the wallets in the wild won't talk to you. If you strictly follow
Draft 13, the EU reference wallet won't. The protocol moved fast and
shipped breaking changes mid-stride; production wallets are scattered
across the resulting versions.

This is a field guide to the differences that actually matter when an
issuer wants to interop with everything.

## The drafts in question

| Draft | Released | What changed |
|---|---|---|
| **13** | 2024 | Single proof, `format`+`vct` body shape. The "old way." |
| **14** | mid-2025 | `credential_configuration_id` for credential selection; `proofs.jwt[]` array (batch); `dc+sd-jwt` format for SD-JWT-VC. |
| **15** | late 2025 | Cleanup of 14; `batch_credential_issuance` metadata. The current direction. |
| **Final 1.0** | TBD | Coming soon — will likely freeze 15. |

The EU reference wallet
([eudi-lib-jvm-openid4vci-kt 0.9+](https://github.com/eu-digital-identity-wallet/eudi-lib-jvm-openid4vci-kt))
sends Draft 14/15 shape. Older wallets and synthetic-holder test
scripts still use Draft 13.

## Difference 1 — the credential-request body

**Draft 13:** flat shape, format-keyed.

```json
{
  "format": "vc+sd-jwt",
  "vct": "urn:eudi:pid:1",
  "proof": { "proof_type": "jwt", "jwt": "<one proof>" }
}
```

**Draft 14/15:** configuration-keyed, optional batch.

```json
{
  "credential_configuration_id": "urn:eudi:pid:1_sd_jwt_vc",
  "proofs": { "jwt": ["<proof1>", "<proof2>", "..."] }
}
```

If your issuer accepts only one shape, the other shape's wallets get
"invalid request" without understanding why.

The fix in `@gramota/oid4vci`:

```ts
import { parseCredentialRequest } from "@gramota/oid4vci";

const parsed = parseCredentialRequest({ body: req.body });
// parsed.proofJwts is always a string[] (length ≥ 1).
// parsed.format and parsed.vct are filled in regardless of which
// shape the wallet sent — Draft 14/15 looks them up from the
// configuration_id when issuerMetadata is provided.
```

One normalized shape. Consume `proofJwts[]` and you're done.

## Difference 2 — the format string

**Draft 13:** `"format": "vc+sd-jwt"`
**Draft 15:** `"format": "dc+sd-jwt"`

Yes, one letter changed. `vc` (verifiable credential) became
`dc` (digital credential) because the spec authors decided the broader
"dc+" prefix scoped better. Wallets that target Draft 15 metadata
ignore credentials advertised as `vc+sd-jwt`. Wallets that target
Draft 13 ignore `dc+sd-jwt`.

There's no graceful fallback at the wallet level — they just don't
engage with the offer. Your error budget is "wallet didn't try."

For broadest compatibility, advertise both formats in your
`credential_configurations_supported`:

```ts
{
  "credential_configurations_supported": {
    "urn:eudi:pid:1_sd_jwt_vc": {
      "format": "dc+sd-jwt",  // current
      // ... rest of config
    },
    "urn:eudi:pid:1_vc_sd_jwt": {  // back-compat alias
      "format": "vc+sd-jwt",
      // ... same config otherwise
    },
  }
}
```

We've found Draft 15 wallets fail closed when the only offered format
is `vc+sd-jwt`. So leading with `dc+sd-jwt` and offering `vc+sd-jwt`
as an alias works in practice.

## Difference 3 — the credential response

**Draft 13:** singular.

```json
{ "format": "vc+sd-jwt", "credential": "<sd-jwt-vc>" }
```

**Draft 15 §7.3:** plural.

```json
{
  "credentials": [
    { "credential": "<sd-jwt-vc-1>" },
    { "credential": "<sd-jwt-vc-2>" }
  ]
}
```

Issue: a Draft 13 wallet that gets a Draft 15 response sees no
top-level `credential` and silently fails ("Cannot happen" in the EU
wallet's logs is the canonical symptom).

Workaround: emit BOTH shapes in your response.

```ts
return reply.send({
  format: "dc+sd-jwt",
  credential: tokens[0],   // Draft 13 fallback
  credentials: tokens.map((credential) => ({ credential })),  // Draft 15
});
```

`@gramota/issuer` doesn't enforce the response shape — that's the
caller's job — but the SaaS we run consistently emits both, and that's
worked across every wallet we've tested.

## Difference 4 — batch issuance metadata

**Draft 13:** no concept of batch.
**Draft 14:** `proofs.jwt[]` exists in the wire format.
**Draft 15 §11.2.3:** `batch_credential_issuance` published in
`/.well-known/openid-credential-issuer`.

```json
{
  "batch_credential_issuance": { "batch_size": 50 }
}
```

If you don't advertise this, even Draft 15 wallets fall back to
single-credential mode silently. The EU wallet's metadata parser
sets `batchCredentialIssuance=NotSupported` when the field is absent
and the user gets one credential per offer instead of the
`numberOfCredentials = 10` they'd configured.

This was the most expensive bug in our integration: spent two emulator
runs wondering why the wallet was issuing one credential when we knew
the route was wired for batch. Symptom-cause distance was infinite.
The fix was a four-line metadata change.

## Difference 5 — DPoP support discovery

OAuth 2.0 metadata has `dpop_signing_alg_values_supported`, an array
listing the algorithms the AS accepts in DPoP proofs. Wallets gate
their use of DPoP on this:

```json
{
  "issuer": "https://issuer.example",
  "token_endpoint": "https://issuer.example/oid4vci/token",
  "dpop_signing_alg_values_supported": ["ES256"]
}
```

Drop this field, the wallet falls back to bearer tokens. That's
spec-correct but if you're production-targeting the EU stack, you
want DPoP on — production EUDIW wallets all use it. The wallet still
works without DPoP, but bearer tokens are weaker (a leak = a clone).

## Putting it together

The minimum-viable issuer that talks to every wallet we've tested:

```ts
// /.well-known/openid-credential-issuer
{
  credential_issuer: ISSUER_URL,
  authorization_servers: [ISSUER_URL],
  credential_endpoint: `${ISSUER_URL}/oid4vci/credential`,
  batch_credential_issuance: { batch_size: 50 },          // Draft 15
  credential_configurations_supported: {
    "urn:eudi:pid:1_sd_jwt_vc": {
      format: "dc+sd-jwt",                                 // Draft 15
      vct: "urn:eudi:pid:1",
      cryptographic_binding_methods_supported: ["jwk"],
      credential_signing_alg_values_supported: ["ES256"],
      proof_types_supported: { jwt: { proof_signing_alg_values_supported: ["ES256"] } },
    }
  }
}

// /.well-known/oauth-authorization-server
{
  issuer: ISSUER_URL,
  token_endpoint: `${ISSUER_URL}/oid4vci/token`,
  grant_types_supported: ["urn:ietf:params:oauth:grant-type:pre-authorized_code"],
  token_endpoint_auth_methods_supported: ["none"],
  dpop_signing_alg_values_supported: ["ES256"],            // wallet gate
}

// POST /oid4vci/credential — accept Draft 13/14/15, return both shapes
import { parseCredentialRequest } from "@gramota/oid4vci";
const parsed = parseCredentialRequest({ body: req.body });
// ... verify proofs, issue ...
return reply.send({
  format: "dc+sd-jwt",
  credential: tokens[0],
  credentials: tokens.map((credential) => ({ credential })),
});
```

Five fields, two endpoints, one normalisation function. That's the
minimum to interop across the OID4VCI version landscape we have today.

## What we'd like to see next

Cleanups the spec authors could make our lives easier with:

1. **Drop `vc+sd-jwt` entirely.** Two formats for the same credential
   is one too many. Either pick one and require migration, or
   document an explicit aliasing rule.
2. **Make `batch_credential_issuance` opt-out instead of opt-in.**
   Most production issuers want batch; making it default-on with a
   "single only" override would surface fewer silent fallbacks.
3. **Spec a discovery dance for DPoP nonces.** Currently the only way
   to learn an AS demands a nonce is to try without one and read the
   `DPoP-Nonce` header on the 401 response. Putting that in metadata
   would save a round-trip.

Until then, the workaround pattern is "advertise everything, accept
everything, emit both shapes." `@gramota/oid4vci` handles the
parser side; the metadata + response shaping you put in your route
handler. Five fields, two endpoints, one normaliser.

If you want the working server-side end-to-end, see the
[issuer guide](/docs/guides/issuer). For the wallet side, the
underlying primitives live in `@gramota/oid4vci` and the high-level
flow runner is `Oid4vciClient`.
