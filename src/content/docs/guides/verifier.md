---
title: Build a verifier
slug: guides/verifier
description: A 30-line bank-style relying party that verifies an EUDIW presentation end-to-end.
section: Guides
order: 1
---

# Build a verifier

This is the longer-form version of the [getting started](/docs/getting-started)
example — same shape, but with the full 12-check pipeline explained
and the surrounding HTTP plumbing wired up.

## What we'll build

A relying party endpoint that:

1. Mints an OID4VP authorization request signed with an X.509 cert
   (so wallets recognize us as `x509_san_dns:<our-host>`).
2. Hands that request out as a deep link / QR.
3. Receives the wallet's `vp_token` at a callback.
4. Runs the 12 named security checks via `Verifier.verify`.
5. Stores the parsed claims for the session.

## Install

```bash
pnpm add fastify @gramota/verifier @gramota/oid4vp @gramota/trust
```

## The minimal verifier

```ts
import { Verifier } from "@gramota/verifier";
import { StaticTrustResolver } from "@gramota/trust";
import { signAuthorizationRequest, generateSigningCert } from "@gramota/oid4vp";

// Boot once at startup. Production mints/loads keys from KMS;
// for a demo this is fine.
const cert = await generateSigningCert({
  sanDns: "my-bank.com",
  commonName: "Acme Bank verifier",
});

const verifier = new Verifier({
  audience: "https://my-bank.com",
  trust: new StaticTrustResolver([eudiPidIssuerJwk]),
  // Production EU wallets send aud as `x509_san_dns:my-bank.com`,
  // not as the URL form. Accept both.
  additionalAudiences: ["x509_san_dns:my-bank.com"],
});
```

## Mint an authorization request

```ts
import { randomBytes } from "node:crypto";

async function mintRequest(): Promise<{ jwt: string; nonce: string; state: string }> {
  const nonce = randomBytes(16).toString("base64url");
  const state = randomBytes(16).toString("base64url");

  const jwt = await signAuthorizationRequest({
    request: {
      client_id: "x509_san_dns:my-bank.com",
      response_type: "vp_token",
      response_mode: "direct_post",
      response_uri: "https://my-bank.com/v1/verifications/callback",
      nonce,
      state,
      dcql_query: {
        credentials: [{
          id: "pid",
          format: "dc+sd-jwt",
          meta: { vct_values: ["urn:eudi:pid:1"] },
          claims: [
            { path: ["given_name"] },
            { path: ["family_name"] },
            { path: ["birth_date"] },
          ],
        }],
      },
    },
    cert,
  });
  return { jwt, nonce, state };
}
```

Persist `(state, nonce)` in your session store — the response handler
will need both to verify the wallet's reply hasn't been replayed and
matches the request we minted.

## Receive the response

```ts
import Fastify from "fastify";
import formbody from "@fastify/formbody";

const app = Fastify();
await app.register(formbody);

// In-memory for this demo; production uses Redis / Postgres.
const sessions = new Map<string, { nonce: string }>();

// The "start verification" endpoint. Returns a deep link the user
// scans / clicks.
app.post("/v1/verifications", async (req, reply) => {
  const { jwt, nonce, state } = await mintRequest();
  sessions.set(state, { nonce });

  const requestUri = `https://my-bank.com/request/${state}`;
  // Wallet fetches this — it returns the JAR.
  app.get(`/request/${state}`, async () => jwt);

  return {
    deepLink: `openid4vp://?client_id=x509_san_dns:my-bank.com&request_uri=${encodeURIComponent(requestUri)}`,
  };
});

// The wallet POSTs here with the presentation.
app.post(
  "/v1/verifications/callback",
  async (req, reply) => {
    const body = req.body as { vp_token: Record<string, string>; state: string };
    const session = sessions.get(body.state);
    if (!session) return reply.code(400).send({ error: "unknown_state" });

    // DCQL response: vp_token is keyed by the query id we set ("pid").
    const presentation = body.vp_token["pid"];
    if (!presentation) return reply.code(400).send({ error: "missing_pid" });

    const result = await verifier.verify(presentation, {
      nonce: session.nonce,
    });

    if (!result.ok) {
      return reply.code(400).send({
        error: "verification_failed",
        check: result.failedCheck,
        reason: result.reason,
      });
    }

    return { ok: true, claims: result.claims };
  },
);
```

That's the shape. ~70 lines including the session store. Production
adds: persistent storage, rate limiting, structured logging,
metrics, the trust-list-rotation cron, status-list checks against the
issuer's published list. None of those change the verification core.

## What the 12 checks cover

When `verifier.verify` returns `result.ok = true`, all of these passed:

| # | Check | Failure mode |
|---|---|---|
| 1 | parse | malformed SD-JWT-VC |
| 2 | trust | issuer's JWK not in our `TrustResolver` |
| 3 | issuer signature | tampered credential |
| 4 | hash binding | disclosure doesn't match the `_sd` digest |
| 5 | KB-JWT presence | no holder-binding proof |
| 6 | KB-JWT cnf match | KB-JWT signed by a different key than `cnf.jwk` |
| 7 | KB-JWT signature | replayed presentation, key mismatch |
| 8 | KB-JWT audience | replay against a different verifier |
| 9 | KB-JWT nonce | replay of an old presentation |
| 10 | KB-JWT issued-at | KB-JWT in the future, or expired |
| 11 | KB-JWT transcript | `sd_hash` doesn't match the disclosures sent |
| 12 | status | revoked / suspended via Token Status List |

Every failure tells you which check failed (`result.failedCheck`) plus
a free-form reason — useful for distinguishing "user's wallet replayed
an old presentation" from "issuer is no longer in our trust list".

## Production checklist

- Replace `StaticTrustResolver` with `SdJwtVcIssuerTrustResolver` to
  follow each credential's `iss` claim and pull keys from
  `<iss>/.well-known/jwt-vc-issuer` (with caching).
- Replace `generateSigningCert` with a CA-issued certificate for your
  domain. The self-signed cert is fine for dev but EU regulated
  wallets will reject it in production.
- Wire a `StatusResolver` so revoked credentials fail check #12.
- Persist sessions to Redis (you need TTL + horizontal scaling).
- Log `result.failedCheck` separately from successes — this is your
  fraud-attempt signal.
