---
title: Verify an EU PID
slug: recipes/verifying-eu-pid
description: Talk to the EU Commission's reference issuer, retrieve a real PID, verify it.
section: Recipes
order: 1
---

# Verify an EU PID

Useful when you want to prove your verifier works against credentials
the EU itself signed — not just synthetic ones from your own issuer.
This recipe issues + verifies a real EU PID via the Commission's
public dev infrastructure.

## What you need

- The EU reference wallet on Android (or iOS), enrolled with a PIN.
- A scanner / camera-equipped device — the issuance flow uses an OOB
  authorization-code grant with a Keycloak login.
- `@gramota/holder` (you don't strictly need a wallet for this, but
  it's the cleanest way to manipulate the credential after issuance).
- `@gramota/verifier`.

The shape:

```
EU dev issuer  ──── credential ────►  your holder  ──── presentation ────►  your verifier
```

## Run the demo

The OSS repo has a CLI demo that drives this end-to-end:

```bash
git clone https://github.com/gramota-org/gramota.git
cd gramota
pnpm install
pnpm demo:eu-pid
```

The demo:

1. Calls `Oid4vciClient.authorize()` against `dev.issuer-backend.eudiw.dev`.
2. Opens your browser to the Keycloak login.
3. Prompts for the OOB authorization code shown in the EU portal.
4. Exchanges the code for an access token, then for a credential.
5. Validates the issuer signature against the EU's published JWKS at
   `https://dev.issuer-backend.eudiw.dev/.well-known/jwt-vc-issuer`.
6. Stores the credential in the holder's local file store.

After running, `pnpm demo:list` shows the parsed claims.

## What the verifier sees

```ts
import { Verifier } from "@gramota/verifier";
import { SdJwtVcIssuerTrustResolver } from "@gramota/trust";

const verifier = new Verifier({
  audience: "https://my-bank.com",
  // Follow each credential's `iss` claim and pull the JWK from
  // <iss>/.well-known/jwt-vc-issuer with cache. This is the only
  // sensible TrustResolver for production — the EU rotates keys on
  // a multi-week cadence, you don't want to hardcode them.
  trust: new SdJwtVcIssuerTrustResolver({ cacheMs: 60 * 60 * 1000 }),
});

const result = await verifier.presentations.verify(presentation, { nonce });
console.log(result.metadata.issuer);  // https://dev.issuer-backend.eudiw.dev
console.log(result.claims);
//   {
//     given_name: "...",
//     family_name: "...",
//     birth_date: "...",
//     nationality: "...",
//     ...
//   }
```

## Status list — the catch

EU dev credentials *may or may not* carry a `status` claim depending
on the deployment configuration. The status list service is a separate
host (`https://issuer.eudiw.dev` — note: no `dev.` prefix), and the
public `/get` endpoint accepts no auth. Configure your `statusResolver`
to follow whatever URI the credential carries — don't hardcode hosts:

```ts
import { StatusListResolver } from "@gramota/status-list";

const verifier = new Verifier({
  // …other config above…
  statusResolver: new StatusListResolver({
    // The status list itself is a signed JWT. `trustedIssuers` is the
    // set of public keys we'll accept on the status-list signature —
    // typically the same trust anchors as the credential issuer.
    trustedIssuers: [issuerJwk],
  }),
});
```

If the credential has no `status` claim, check #12 (status) is skipped —
that's spec-correct.

## Going production

Replace `dev.issuer-backend.eudiw.dev` with whatever production
issuer your jurisdiction publishes. The country list is maintained
in the EU LOTL (List of Trusted Lists), but for SDK testing the
`SdJwtVcIssuerTrustResolver` does the right thing automatically —
follow the credential's `iss` claim to its well-known and trust the
keys it returns *if* the cert chain validates against your trust
anchors.

For first-party credentials (you issued them from your own
infrastructure), use `StaticTrustResolver([yourPublicJwk])` instead —
no DNS resolution needed, no key-rotation race condition.
