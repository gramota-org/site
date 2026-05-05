---
title: SD-JWT-VC explained
slug: concepts/sd-jwt-vc
description: The credential format the EU is settling on, demystified for web devs.
section: Concepts
order: 1
---

If you've worked with JWTs, you already understand 80% of SD-JWT-VC.
This page covers the other 20% — the part that makes selective
disclosure work without trusting the holder.

## The problem

A bank wants to verify your age — specifically, are you over 18?
The state issued you a credential containing your full birth date.
Two bad outcomes:

1. **You hand over your birth date.** The bank now knows more than
   it asked for. Privacy regulators frown.
2. **You hand over a "yes I'm 18+" claim signed by you.** The bank
   can't trust you — you could lie.

SD-JWT-VC threads the needle: the issuer (state) signs claims in a
form where you can selectively reveal *any subset* without invalidating
the issuer's signature.

## The shape

An SD-JWT-VC is three parts joined by `~`:

```
<issuer-jwt>~<disclosure-1>~<disclosure-2>~<key-binding-jwt>
```

- The **issuer JWT** is a normal JWS — header + payload + signature.
  Payload includes `iss`, `iat`, `exp`, `vct` (credential type),
  `cnf.jwk` (the holder's public key — see "key binding" below), and
  for each selectively-disclosable claim, a SHA-256 *hash* under the
  `_sd` array.
- Each **disclosure** is a base64url-encoded JSON triple
  `[salt, claim_name, claim_value]`. Hashing this triple gives the
  digest the issuer JWT pre-committed to.
- The **key-binding JWT** (KB-JWT) is signed by the holder using the
  key in `cnf.jwk`. It contains the verifier's nonce and audience,
  plus a `sd_hash` that hashes the entire presentation transcript
  (the issuer JWT + disclosures the holder chose to include).

## The trick

The issuer signs the *digests*, not the values. So the holder can
drop disclosures from the presentation — the verifier still gets a
valid signature, just with fewer matched claims.

```
issuer signs: {
  _sd: ["abc...", "def...", "ghi..."],  // hashes of (salt, name, value)
  vct: "urn:eudi:pid:1",
  iss: "https://state.example",
  cnf: { jwk: <holder-pubkey> },
  ...
}
```

Holder sends `<issuer-jwt>~<disclosure-with-age-over-18>~<kb-jwt>`,
omits the disclosures for `birth_date`, `family_name`, `address`,
etc. Verifier:

1. Verifies the issuer signature on the JWT.
2. Hashes each disclosure, finds it in `_sd`.
3. Verifies the KB-JWT signature using `cnf.jwk`.
4. Checks the KB-JWT's `aud`, `nonce`, and `sd_hash`.

What the verifier *sees*: just `age_over_18: true`. What it *doesn't*
see: everything else the issuer also vouched for. Issuer doesn't have
to be online. Holder can't lie. Verifier learns the minimum.

## Key binding

Without the KB-JWT, an attacker who steals an SD-JWT-VC could replay
it. With it, the attacker would need both the SD-JWT *and* the
holder's private key (which lives in the wallet's secure enclave).

The audience binding (`aud` in the KB-JWT) means a presentation made
to bank A can't be replayed against bank B — even if the attacker
gets both.

## Why the EU picked this

Mobile driver's licenses (mDL, ISO 18013-5) had been the front-runner.
mDL has selective disclosure too, but uses CBOR + ECDSA-on-COSE — a
stack the average web developer doesn't have lying around.
SD-JWT-VC is JOSE — every web crypto library already supports it.

Both formats are required by the EU; SD-JWT-VC is what most
non-government verifiers will see in practice, because mDL has tighter
rules around device-attested wallets.

## In Gramota

The format is `@gramota/sd-jwt`'s domain — `parseSdJwt`,
`verifyHashBinding`, `issueSdJwt`. The high-level packages
(`@gramota/verifier`, `@gramota/issuer`) wrap these with the surface
most people want; drop down to `@gramota/sd-jwt` only if you need
non-standard flows.

For the wire-format crawl, see the [IETF draft](https://datatracker.ietf.org/doc/draft-ietf-oauth-sd-jwt-vc/).
For working code, see [Getting started](/docs/getting-started).
