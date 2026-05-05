---
title: Build an issuer
slug: guides/issuer
description: A 50-line OID4VCI pre-authorized-code issuer that the EU reference wallet talks to.
section: Guides
order: 2
---

# Build an issuer

A relying party verifies; an *issuer* mints credentials in the first
place. This guide walks the OID4VCI pre-authorized-code flow end-to-end,
producing an SD-JWT-VC the EU reference wallet will accept.

## What we'll build

1. A `POST /v1/credential-offers` route that takes the subject claims
   for one user and mints an opaque pre-auth code + a deep link.
2. The OID4VCI endpoints the wallet calls:
   - `GET /.well-known/openid-credential-issuer` — metadata
   - `GET /.well-known/oauth-authorization-server` — OAuth metadata
   - `POST /oid4vci/token` — exchanges pre-auth code for an access token
   - `POST /oid4vci/credential` — produces the SD-JWT-VC

## Install

```bash
pnpm add fastify @gramota/issuer @gramota/oid4vci @gramota/jose
```

## Mint the offer

```ts
import { randomBytes } from "node:crypto";
import Fastify from "fastify";
import formbody from "@fastify/formbody";

const app = Fastify();
await app.register(formbody);

const ISSUER_URL = "https://issuer.example.com";

interface Offer {
  preAuthCode: string;
  subject: Record<string, unknown>;
  vct: string;
  expiresAt: number;
}
const offers = new Map<string, Offer>();

app.post("/v1/credential-offers", async (req) => {
  const { subject, vct } = req.body as { subject: Record<string, unknown>; vct: string };
  const preAuthCode = randomBytes(24).toString("base64url");

  offers.set(preAuthCode, {
    preAuthCode,
    subject,
    vct,
    expiresAt: Date.now() + 30 * 60 * 1000,
  });

  const offerObject = {
    credential_issuer: ISSUER_URL,
    credential_configuration_ids: [`${vct}_sd_jwt_vc`],
    grants: {
      "urn:ietf:params:oauth:grant-type:pre-authorized_code": {
        "pre-authorized_code": preAuthCode,
      },
    },
  };

  const offerUrl = `openid-credential-offer://?credential_offer=${
    encodeURIComponent(JSON.stringify(offerObject))
  }`;

  return { offerUrl, preAuthCode };
});
```

## Publish issuer metadata

```ts
import { Issuer } from "@gramota/issuer";

const issuer = new Issuer({
  issuerId: ISSUER_URL,
  privateKey: ISSUER_PRIVATE_JWK,
  publicKey: ISSUER_PUBLIC_JWK,
  alg: "ES256",
});

app.get("/.well-known/openid-credential-issuer", async () => ({
  credential_issuer: ISSUER_URL,
  authorization_servers: [ISSUER_URL],
  credential_endpoint: `${ISSUER_URL}/oid4vci/credential`,
  // Advertise batch issuance — EU wallet asks for numberOfCredentials = 10
  // when this is present. See the batch-issuance guide.
  batch_credential_issuance: { batch_size: 50 },
  credential_configurations_supported: {
    "urn:eudi:pid:1_sd_jwt_vc": {
      format: "dc+sd-jwt",
      scope: "urn:eudi:pid:1",
      cryptographic_binding_methods_supported: ["jwk"],
      credential_signing_alg_values_supported: ["ES256"],
      proof_types_supported: { jwt: { proof_signing_alg_values_supported: ["ES256"] } },
      vct: "urn:eudi:pid:1",
    },
  },
}));

app.get("/.well-known/oauth-authorization-server", async () => ({
  issuer: ISSUER_URL,
  token_endpoint: `${ISSUER_URL}/oid4vci/token`,
  grant_types_supported: ["urn:ietf:params:oauth:grant-type:pre-authorized_code"],
  token_endpoint_auth_methods_supported: ["none"],
  dpop_signing_alg_values_supported: ["ES256"],
}));

app.get("/.well-known/jwt-vc-issuer", async () => ({
  issuer: ISSUER_URL,
  jwks: { keys: [issuer.publicKey] },
}));
```

## Token exchange

```ts
import { verifyDpopJwt } from "@gramota/oid4vci";

const dpopJtiSeen = new Set<string>();

app.post("/oid4vci/token", async (req, reply) => {
  const body = req.body as Record<string, string>;
  const offer = offers.get(body["pre-authorized_code"] ?? "");

  if (!offer || Date.now() > offer.expiresAt) {
    return reply.code(400).send({
      error: "invalid_grant",
      error_description: "pre-authorized_code is unknown, expired, or already used",
    });
  }
  offers.delete(offer.preAuthCode);

  const dpopHeader = req.headers["dpop"];
  let jkt: string | undefined;
  if (typeof dpopHeader === "string") {
    const { jkt: thumb } = await verifyDpopJwt({
      jwt: dpopHeader,
      htm: "POST",
      htu: `${ISSUER_URL}/oid4vci/token`,
      hasSeenJti: (j) => dpopJtiSeen.has(j),
      recordJti: (j) => dpopJtiSeen.add(j),
    });
    jkt = thumb;
  }

  const accessToken = randomBytes(32).toString("base64url");
  tokenStore.set(accessToken, { offer, jkt, expiresAt: Date.now() + 5 * 60_000 });

  return {
    access_token: accessToken,
    token_type: jkt ? "DPoP" : "Bearer",
    expires_in: 300,
    c_nonce: randomBytes(16).toString("base64url"),
    c_nonce_expires_in: 300,
  };
});
```

## Issue the credential

```ts
import { parseCredentialRequest } from "@gramota/oid4vci";
import { jwtVerify, importJWK, type JWK } from "jose";

app.post("/oid4vci/credential", async (req, reply) => {
  // 1. Resolve token + DPoP.
  const auth = req.headers.authorization?.replace(/^DPoP /i, "") ?? "";
  const t = tokenStore.get(auth);
  if (!t || Date.now() > t.expiresAt) {
    return reply.code(401).send({ error: "invalid_token" });
  }

  // 2. Re-verify DPoP if it was used at /token. Pass `accessToken` so
  // verifyDpopJwt enforces the `ath` claim against the bearer token.
  // The thumbprint check (sender constraint) is up to the caller —
  // compare result.jkt to the value we recorded at /token-time.
  if (t.jkt) {
    const { jkt } = await verifyDpopJwt({
      jwt: req.headers.dpop as string,
      htm: "POST",
      htu: `${ISSUER_URL}/oid4vci/credential`,
      accessToken: auth,
      hasSeenJti: (j) => dpopJtiSeen.has(j),
      recordJti: (j) => dpopJtiSeen.add(j),
    });
    if (jkt !== t.jkt) {
      return reply.code(401).send({ error: "invalid_token" });
    }
  }

  // 3. Parse the request — handles Draft 13 + Draft 15 shapes.
  const parsed = parseCredentialRequest({ body: req.body });

  // 4. Verify each proof JWT — the wallet attests holder keys here.
  const holderKeys: JWK[] = [];
  for (const proofJwt of parsed.proofJwts) {
    const { protectedHeader } = await jwtVerify(
      proofJwt,
      async (h) => importJWK(h.jwk as JWK, "ES256"),
      { audience: ISSUER_URL },
    );
    holderKeys.push(protectedHeader.jwk as JWK);
  }

  // 5. Issue. Single-credential is just a batch of 1.
  const results = await issuer.credentials.issueBatch({
    subject: t.offer.subject,
    selectivelyDisclosable: Object.keys(t.offer.subject),
    vct: t.offer.vct,
    expiresIn: 365 * 24 * 3600,
    credentials: holderKeys.map((holderKey) => ({ holderKey: holderKey as any })),
  });

  return reply.send({
    format: "dc+sd-jwt",
    credentials: results.map(({ token }) => ({ credential: token })),
  });
});
```

## Production checklist

- Replace the `Map`s with Postgres + Redis (DPoP `jti` replay set
  needs TTL = max DPoP age, ~5 min).
- Replace the in-memory `Issuer` config with KMS-backed signing.
  `Issuer` accepts a `signer: Signer` Strategy in production
  (`{ alg, sign(payload), publicKey }`) — wire it to AWS KMS / Vault.
- Wire status-list publication so issued credentials can be revoked.
- Rate-limit `/v1/credential-offers` per organization — credential
  minting is your most expensive operation.
- Log every issuance keyed by `credentialId` from `IssueResult` — this
  is your audit trail.
