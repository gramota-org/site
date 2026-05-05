---
title: DCQL — credential query language
slug: concepts/dcql
description: How a verifier asks for a specific shape of claims, and how a wallet picks the credentials that match.
section: Concepts
order: 4
---

# DCQL — credential query language

DCQL ("Digital Credentials Query Language") is OID4VP 2.0's way of
saying: "here's the shape of credentials I need; reply with whatever
you have that matches." It's compact JSON — a few hundred bytes for
typical queries — and unlike DIF Presentation Exchange (its predecessor),
it doesn't require JSON-Schema knowledge to read.

## A minimal query

The verifier wants a PID issued by the EU dev issuer, and needs the
holder to disclose `given_name`, `family_name`, and `birth_date`:

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

Three things to notice:

- Each entry in `credentials` has an `id` — the wallet uses it as the
  key in `vp_token` when responding.
- `format` says what wire shape (`dc+sd-jwt` for SD-JWT-VC; `mso_mdoc`
  for ISO 18013-5 credentials).
- `claims[].path` is a JSON-Pointer-style array. For SD-JWT-VC, all
  claims live at the top level, so each path is a single-element array.

## Multiple credentials

If the verifier needs both a PID and a residence certificate:

```json
{
  "credentials": [
    {
      "id": "pid",
      "format": "dc+sd-jwt",
      "meta": { "vct_values": ["urn:eudi:pid:1"] },
      "claims": [
        { "path": ["given_name"] },
        { "path": ["family_name"] },
        { "path": ["birth_date"] }
      ]
    },
    {
      "id": "residence",
      "format": "dc+sd-jwt",
      "meta": { "vct_values": ["urn:eudi:residence:1"] },
      "claims": [
        { "path": ["country"] },
        { "path": ["postal_code"] }
      ]
    }
  ]
}
```

The wallet's response keys both:

```json
{
  "vp_token": {
    "pid": "<sd-jwt-vc-1>",
    "residence": "<sd-jwt-vc-2>"
  }
}
```

## Optional: which credential when multiple match

DCQL has a `credential_sets` field for "I need one of these or one of
those". Useful when the verifier accepts multiple credential types:

```json
{
  "credentials": [
    { "id": "passport", "format": "dc+sd-jwt", "meta": { … }, "claims": […] },
    { "id": "id_card", "format": "dc+sd-jwt", "meta": { … }, "claims": […] }
  ],
  "credential_sets": [{
    "options": [["passport"], ["id_card"]],
    "purpose": "Identity verification — passport or ID card."
  }]
}
```

The wallet shows the user the alternatives and lets them choose.

## Claim-value constraints

A `values` array on a path narrows the match — useful for "I need a PID
issued by Bulgaria specifically":

```json
{ "path": ["nationality"], "values": ["BG"] }
```

Wallets won't surface credentials whose `nationality` claim doesn't
already match — and even if the user manually picked one, the verifier
would reject the presentation post-hoc on the same constraint.

## Compared to DIF Presentation Exchange

PE v2 was the prior art. It uses JSON-Schema for filtering, which is
expressive but verbose — a typical PE definition is 5–10× the size
of an equivalent DCQL query. DCQL trades the schema's expressiveness
for compactness, which matters because the query travels through QR
codes (size budgets) and over BLE (smaller is faster).

DCQL is what wallets shipping today (mid-2026) use. PE is still
common in older wallet stacks — `@gramota/presentation-exchange` is
shipped for compat.

## In Gramota

[`@gramota/dcql`](https://www.npmjs.com/package/@gramota/dcql) gives:
- `selectForDcql` — wallet-side selection: given a DCQL query and a set
  of stored credentials, returns the credentials + claim subsets that
  satisfy the query (or a structured failure when nothing matches).
- `DcqlSdJwtVcMatcher` — the SD-JWT-VC matcher implementation. Pluggable
  via the `DcqlMatcher` interface, so adding mDoc support means
  shipping a `DcqlMdocMatcher` and registering it.
- `evaluateDcqlPath` / `validateDcqlPath` / `leafPropertyName` — path
  utilities for building or interpreting `claim.path` arrays.
- `DcqlError` with structured codes — useful when the query is
  malformed and you need to surface why.

Most users won't touch this directly — `Verifier.verify` handles the
DCQL response shape automatically, and `@gramota/holder`'s presentation
flow uses `selectForDcql` under the hood to match stored credentials
against the request.
