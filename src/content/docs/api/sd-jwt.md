---
title: "@gramota/sd-jwt"
slug: api/sd-jwt
description: "SD-JWT-VC parser, hash binding, KB-JWT issuance / verification."
section: API reference
order: 10
---

# @gramota/sd-jwt

> SD-JWT-VC parser, hash binding, KB-JWT issuance / verification.

Install: `pnpm add @gramota/sd-jwt`

Source: [github.com/gramota-org/gramota/tree/main/packages/sd-jwt](https://github.com/gramota-org/gramota/tree/main/packages/sd-jwt)

## Classes

### SdJwtError

Defined in: @gramota/sd-jwt/dist/types.d.ts:25

Single error class for every failure mode in `@gramota/sd-jwt`.

Discriminator is the `code` field — handlers branch on the prefix
(`sd_jwt.parse.*` / `sd_jwt.kb.*` / ...) rather than `instanceof` on
a per-operation class. Replaces the older per-operation classes
(`SdJwtParseError`, `SdJwtVerificationError`, `SdJwtIssuanceError`,
`SdJwtKeyBindingError`).

#### Extends

- `GramotaError`

#### Constructors

##### Constructor

```ts
new SdJwtError(
   code: SdJwtErrorCode, 
   message: string, 
   options?: {
  cause?: unknown;
}): SdJwtError;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:27

###### Parameters

###### code

[`SdJwtErrorCode`](#sdjwterrorcode)

###### message

`string`

###### options?

###### cause?

`unknown`

###### Returns

[`SdJwtError`](#sdjwterror)

###### Overrides

```ts
GramotaError.constructor
```

#### Properties

##### cause?

```ts
readonly optional cause?: unknown;
```

Defined in: .pnpm/@gramota+core@0.2.1/node\_modules/@gramota/core/dist/error.d.ts:44

Optional original error that caused this one. Always set when the
Gramota package is wrapping a thrown exception from a dependency
(Web Crypto, JOSE, fetch). Survives `JSON.stringify(err)` only via
the `cause` property — Node 16.9+ logs it natively.

###### Inherited from

```ts
GramotaError.cause
```

##### code

```ts
readonly code: SdJwtErrorCode;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:26

Stable string that identifies the failure mode. Subclasses narrow
the type; at runtime it's always a string. Use for branching, logs,
and metrics labels — never serialize [GramotaError.message](#message)
for that purpose, message strings drift across versions.

###### Overrides

```ts
GramotaError.code
```

##### name

```ts
name: string;
```

Defined in: .pnpm/typescript@5.9.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

```ts
GramotaError.name
```

##### message

```ts
message: string;
```

Defined in: .pnpm/typescript@5.9.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

```ts
GramotaError.message
```

##### stack?

```ts
optional stack?: string;
```

Defined in: .pnpm/typescript@5.9.3/node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

```ts
GramotaError.stack
```

## Interfaces

### IssueSdJwtOptions

Defined in: @gramota/sd-jwt/dist/issue.d.ts:2

#### Properties

##### payload

```ts
payload: Record<string, unknown>;
```

Defined in: @gramota/sd-jwt/dist/issue.d.ts:4

Non-selectively-disclosable claims placed directly in the JWT payload.

##### sdClaims?

```ts
optional sdClaims?: Record<string, unknown>;
```

Defined in: @gramota/sd-jwt/dist/issue.d.ts:6

Claims to make selectively disclosable as object properties.

##### alg

```ts
alg: string;
```

Defined in: @gramota/sd-jwt/dist/issue.d.ts:10

JWT signing algorithm (placed in header `alg`). The signature itself is
produced by `signer` — this library does not perform cryptographic signing
(that is `@gramota/jose`'s job).

##### typ?

```ts
optional typ?: string;
```

Defined in: @gramota/sd-jwt/dist/issue.d.ts:12

Optional `typ` header claim (e.g. "vc+sd-jwt", "dc+sd-jwt").

##### signer

```ts
signer: (signedPayload: string) => string | Promise<string>;
```

Defined in: @gramota/sd-jwt/dist/issue.d.ts:15

Async (or sync) signer. Receives `header.payload` (the bytes to sign) and
returns the base64url-encoded signature. Use `stubSignature` for tests.

###### Parameters

###### signedPayload

`string`

###### Returns

`string` \| `Promise`\<`string`\>

##### hashAlg?

```ts
optional hashAlg?: HashAlg;
```

Defined in: @gramota/sd-jwt/dist/issue.d.ts:17

Hash algorithm (default "sha-256"). Sets `_sd_alg` when sdClaims present.

##### saltGenerator?

```ts
optional saltGenerator?: () => string;
```

Defined in: @gramota/sd-jwt/dist/issue.d.ts:20

Salt generator returning a base64url string. Pluggable for deterministic
testing. Default: 128-bit random salt.

###### Returns

`string`

##### extraHeader?

```ts
optional extraHeader?: Record<string, unknown>;
```

Defined in: @gramota/sd-jwt/dist/issue.d.ts:22

Additional header parameters (kid, x5c, etc.).

***

### IssuanceResult

Defined in: @gramota/sd-jwt/dist/issue.d.ts:25

#### Properties

##### token

```ts
token: string;
```

Defined in: @gramota/sd-jwt/dist/issue.d.ts:26

##### disclosures

```ts
disclosures: SdJwtDisclosure[];
```

Defined in: @gramota/sd-jwt/dist/issue.d.ts:27

***

### VerifyKbJwtOptions

Defined in: @gramota/sd-jwt/dist/key-binding.d.ts:35

#### Properties

##### expectedAudience

```ts
expectedAudience: string | readonly string[];
```

Defined in: @gramota/sd-jwt/dist/key-binding.d.ts:45

Required. The verifier's identifier; the KB-JWT's `aud` must equal
this (string form) or be present in this list (array form).

In OID4VP+x509_san_dns, two `aud` shapes appear in the wild:
  - the verifier's audience URL (e.g. `https://verifier.example`),
    which is what the SD-JWT-VC spec implies; and
  - the OID4VP `client_id` value (e.g. `x509_san_dns:verifier.example`),
    which the EU reference wallet sends.
Pass an array with both to accept either.

##### expectedNonce

```ts
expectedNonce: string;
```

Defined in: @gramota/sd-jwt/dist/key-binding.d.ts:47

Required. The challenge the verifier issued; the KB-JWT's `nonce` must equal this.

##### maxAgeSeconds?

```ts
optional maxAgeSeconds?: number;
```

Defined in: @gramota/sd-jwt/dist/key-binding.d.ts:49

Maximum acceptable age of the KB-JWT in seconds. Default 60.

##### maxClockSkewSeconds?

```ts
optional maxClockSkewSeconds?: number;
```

Defined in: @gramota/sd-jwt/dist/key-binding.d.ts:51

Maximum acceptable clock skew in seconds (iat in the future). Default 30.

##### algorithms?

```ts
optional algorithms?: readonly SupportedAlg[];
```

Defined in: @gramota/sd-jwt/dist/key-binding.d.ts:53

Algorithm allowlist for the KB-JWT signature. Default: all asymmetric.

##### now?

```ts
optional now?: () => number;
```

Defined in: @gramota/sd-jwt/dist/key-binding.d.ts:55

Override "now" for tests. Returns Unix seconds.

###### Returns

`number`

***

### SdJwtHeader

Defined in: @gramota/sd-jwt/dist/types.d.ts:31

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### alg

```ts
alg: string;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:32

##### typ?

```ts
optional typ?: string;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:33

##### kid?

```ts
optional kid?: string;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:34

##### x5c?

```ts
optional x5c?: string[];
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:35

***

### SdJwtPayload

Defined in: @gramota/sd-jwt/dist/types.d.ts:38

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### iss?

```ts
optional iss?: string;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:39

##### sub?

```ts
optional sub?: string;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:40

##### iat?

```ts
optional iat?: number;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:41

##### exp?

```ts
optional exp?: number;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:42

##### nbf?

```ts
optional nbf?: number;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:43

##### cnf?

```ts
optional cnf?: {
  jwk?: unknown;
  kid?: string;
};
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:44

###### jwk?

```ts
optional jwk?: unknown;
```

###### kid?

```ts
optional kid?: string;
```

##### vct?

```ts
optional vct?: string;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:48

##### status?

```ts
optional status?: unknown;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:49

##### \_sd?

```ts
optional _sd?: string[];
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:50

##### \_sd\_alg?

```ts
optional _sd_alg?: string;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:51

***

### SdJwtDisclosure

Defined in: @gramota/sd-jwt/dist/types.d.ts:54

#### Properties

##### raw

```ts
raw: string;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:55

##### salt

```ts
salt: string;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:56

##### name

```ts
name: string;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:57

##### value

```ts
value: unknown;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:58

***

### ParsedSdJwt

Defined in: @gramota/sd-jwt/dist/types.d.ts:60

#### Properties

##### header

```ts
header: SdJwtHeader;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:61

##### payload

```ts
payload: SdJwtPayload;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:62

##### signature

```ts
signature: string;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:63

##### signedPayload

```ts
signedPayload: string;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:64

##### disclosures

```ts
disclosures: SdJwtDisclosure[];
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:65

##### keyBindingJwt?

```ts
optional keyBindingJwt?: string;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:66

##### presentationPrefix

```ts
presentationPrefix: string;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:70

The exact bytes the KB-JWT's `sd_hash` is computed over: the issuer JWS
plus every presented disclosure plus separator tildes, ending with `~`.
Per IETF SD-JWT §4.3: `sd_hash = base64url(SHA-256(presentationPrefix))`.

***

### VerifiedKeyBinding

Defined in: @gramota/sd-jwt/dist/types.d.ts:73

Verified Key Binding JWT contents per IETF SD-JWT §4.3.

#### Properties

##### header

```ts
header: {
  typ: "kb+jwt";
  alg: string;
};
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:74

###### typ

```ts
typ: "kb+jwt";
```

###### alg

```ts
alg: string;
```

##### payload

```ts
payload: {
  iat: number;
  aud: string;
  nonce: string;
  sd_hash: string;
};
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:78

###### iat

```ts
iat: number;
```

###### aud

```ts
aud: string;
```

###### nonce

```ts
nonce: string;
```

###### sd\_hash

```ts
sd_hash: string;
```

##### holderKey

```ts
holderKey: Record<string, unknown>;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:85

The holder JWK extracted from the parent SD-JWT's `cnf.jwk` claim.

***

### VerifiedSdJwt

Defined in: @gramota/sd-jwt/dist/types.d.ts:87

#### Properties

##### parsed

```ts
parsed: ParsedSdJwt;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:88

##### claims

```ts
claims: Record<string, unknown>;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:92

The JWT payload with `_sd` arrays expanded into their disclosed claims and
`_sd_alg` stripped. Withheld digests and decoys disappear silently — that
is the privacy property of selective disclosure.

##### matchedDisclosures

```ts
matchedDisclosures: SdJwtDisclosure[];
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:94

Disclosures whose digest matched some `_sd` entry in the payload.

##### unmatchedDisclosures

```ts
unmatchedDisclosures: SdJwtDisclosure[];
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:98

Disclosures presented by the holder that did NOT match any digest. A
non-empty array here is a verification failure: the holder is presenting
material the issuer never signed.

##### hashAlgorithm

```ts
hashAlgorithm: string;
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:100

The hash algorithm used (from `_sd_alg`, defaults to "sha-256").

## Type Aliases

### HashAlg

```ts
type HashAlg = "sha-256" | "sha-384" | "sha-512";
```

Defined in: @gramota/sd-jwt/dist/issue.d.ts:24

***

### BuildKbJwtOptions

```ts
type BuildKbJwtOptions = {
  aud: string;
  nonce: string;
  iat?: number;
  hashAlg?: HashAlg;
} & KbJwtSignerInput;
```

Defined in: @gramota/sd-jwt/dist/key-binding.d.ts:16

#### Type Declaration

##### aud

```ts
aud: string;
```

Verifier identifier — bound into KB-JWT to prevent cross-verifier replay.

##### nonce

```ts
nonce: string;
```

Verifier challenge — bound into KB-JWT to prevent within-verifier replay.

##### iat?

```ts
optional iat?: number;
```

Issued-at (Unix seconds). Default: now.

##### hashAlg?

```ts
optional hashAlg?: HashAlg;
```

Hash algorithm for sd_hash. Default `sha-256`. Must equal the parent
SD-JWT's `_sd_alg` to be verifiable.

***

### SdJwtErrorCode

```ts
type SdJwtErrorCode = 
  | "sd_jwt.parse.invalid_input"
  | "sd_jwt.parse.missing_separator"
  | "sd_jwt.parse.malformed_jwt"
  | "sd_jwt.parse.malformed_header"
  | "sd_jwt.parse.malformed_payload"
  | "sd_jwt.parse.malformed_disclosure"
  | "sd_jwt.verify.unsupported_hash_alg"
  | "sd_jwt.kb.invalid_input"
  | "sd_jwt.kb.absent"
  | "sd_jwt.kb.cnf_missing"
  | "sd_jwt.kb.cnf_jwk_missing"
  | "sd_jwt.kb.malformed"
  | "sd_jwt.kb.malformed_header"
  | "sd_jwt.kb.typ_mismatch"
  | "sd_jwt.kb.signature_invalid"
  | "sd_jwt.kb.required_claim_missing"
  | "sd_jwt.kb.invalid_claim_type"
  | "sd_jwt.kb.audience_mismatch"
  | "sd_jwt.kb.nonce_mismatch"
  | "sd_jwt.kb.iat_too_future"
  | "sd_jwt.kb.iat_too_old"
  | "sd_jwt.kb.transcript_mismatch"
  | "sd_jwt.kb.sd_hash_compute_failed"
  | "sd_jwt.issue.signer_required"
  | "sd_jwt.issue.alg_required"
  | "sd_jwt.issue.signer_returned_empty"
  | "sd_jwt.issue.unsupported_hash_alg"
  | "sd_jwt.issue.salt_generator_exhausted";
```

Defined in: @gramota/sd-jwt/dist/types.d.ts:15

Stable identifiers for every failure mode in `@gramota/sd-jwt`.

Codes are namespaced by the operation that raised them:
  - `sd_jwt.parse.*` — `parseSdJwt` (structural decoding)
  - `sd_jwt.verify.*` — `verifyHashBinding` (disclosure ↔ digest match)
  - `sd_jwt.kb.*` — `verifyKeyBinding` / `buildKeyBindingJwt` (KB-JWT)
  - `sd_jwt.issue.*` — `issueSdJwt` (signing path)

Use the code (not the message) for stable log filtering, dashboards,
and per-error programmatic handling. Messages are human-readable and
may change.

## Variables

### stubSignature

```ts
const stubSignature: () => string;
```

Defined in: @gramota/sd-jwt/dist/issue.d.ts:30

Constant placeholder for tests where the signature is not verified.

#### Returns

`string`

## Functions

### issueSdJwt()

```ts
function issueSdJwt(opts: IssueSdJwtOptions): Promise<IssuanceResult>;
```

Defined in: @gramota/sd-jwt/dist/issue.d.ts:47

Build a compact-serialized SD-JWT-VC.

The encoder:
 - Serialises each (salt, name, value) as a JSON array, base64url-encodes it,
   and SHA-256 hashes the encoded form to produce a digest.
 - Places the digests in `_sd` (only at top level for now), and `_sd_alg` in
   the JWT payload.
 - Concatenates JWT + disclosures + trailing `~`.

Limitations of this version:
 - Object-property selective disclosure only (no nested SD, no array-element
   disclosures). Those are tracked for follow-up packages.
 - No cryptographic signing — signer is pluggable but `@gramota/jose` will
   provide the real ES256/EdDSA/RS256 implementations.

#### Parameters

##### opts

[`IssueSdJwtOptions`](#issuesdjwtoptions)

#### Returns

`Promise`\<[`IssuanceResult`](#issuanceresult)\>

***

### deterministicSalts()

```ts
function deterministicSalts(salts: readonly string[]): () => string;
```

Defined in: @gramota/sd-jwt/dist/issue.d.ts:50

Build a deterministic salt generator from an array of pre-chosen salts.
 Useful for tests that need byte-stable output.

#### Parameters

##### salts

readonly `string`[]

#### Returns

() => `string`

***

### buildKeyBindingJwt()

```ts
function buildKeyBindingJwt(presentationPrefix: string, options: BuildKbJwtOptions): Promise<string>;
```

Defined in: @gramota/sd-jwt/dist/key-binding.d.ts:34

Build and sign a Key Binding JWT for a given presentation prefix.

The presentation prefix is `<issuer-jws>~<d1>~...~<dN>~` — every byte the
KB-JWT must commit to. Pass `parsed.presentationPrefix` from the parser, or
reconstruct it from the SD-JWT you're presenting.

#### Parameters

##### presentationPrefix

`string`

##### options

[`BuildKbJwtOptions`](#buildkbjwtoptions)

#### Returns

`Promise`\<`string`\>

***

### verifyKeyBinding()

```ts
function verifyKeyBinding(parsed: ParsedSdJwt, options: VerifyKbJwtOptions): Promise<VerifiedKeyBinding>;
```

Defined in: @gramota/sd-jwt/dist/key-binding.d.ts:71

Verify a Key Binding JWT against IETF SD-JWT §4.3.

Hard rules enforced:
  1. KB-JWT must be present.
  2. Parent SD-JWT must contain a `cnf.jwk` claim.
  3. KB-JWT header `typ` MUST be `kb+jwt`.
  4. KB-JWT signature MUST verify against `cnf.jwk` using an allowlisted alg.
  5. KB-JWT payload MUST contain `iat`, `aud`, `nonce`, `sd_hash`.
  6. `aud` MUST equal `expectedAudience`.
  7. `nonce` MUST equal `expectedNonce`.
  8. `iat` MUST be within (-maxAge, +clockSkew) of now.
  9. `sd_hash` MUST equal the verifier's own computation over `presentationPrefix`.

#### Parameters

##### parsed

[`ParsedSdJwt`](#parsedsdjwt)

##### options

[`VerifyKbJwtOptions`](#verifykbjwtoptions)

#### Returns

`Promise`\<[`VerifiedKeyBinding`](#verifiedkeybinding)\>

***

### parseSdJwt()

```ts
function parseSdJwt(token: string): ParsedSdJwt;
```

Defined in: @gramota/sd-jwt/dist/parse.d.ts:2

#### Parameters

##### token

`string`

#### Returns

[`ParsedSdJwt`](#parsedsdjwt)

***

### computeSdHash()

```ts
function computeSdHash(presentationPrefix: string, hashAlg?: HashAlg): string;
```

Defined in: @gramota/sd-jwt/dist/sd-hash.d.ts:13

Compute `sd_hash` per IETF SD-JWT §4.3.

Input: the presentation prefix — issuer JWS + all presented disclosures +
separator tildes, ending with `~`. NEVER include the KB-JWT.

Output: base64url-encoded hash of the input bytes.

This binds the KB-JWT to the exact disclosures presented; tampering with
any disclosure or reordering them invalidates the hash.

#### Parameters

##### presentationPrefix

`string`

##### hashAlg?

[`HashAlg`](#hashalg-1)

#### Returns

`string`

***

### verifyHashBinding()

```ts
function verifyHashBinding(parsed: ParsedSdJwt): VerifiedSdJwt;
```

Defined in: @gramota/sd-jwt/dist/verify-hash-binding.d.ts:13

Verify the hash binding between disclosures and the issuer's `_sd` digests,
and reconstruct the disclosed claims.

This is the SD-JWT security primitive: it proves that every disclosed claim
was authorised by the issuer at signing time, and that no extra claims have
been smuggled in by the holder.

Note: this verifies the *hash binding* only. Issuer-signature verification
(`@gramota/jose`) and key-binding-JWT verification are separate layers above.

#### Parameters

##### parsed

[`ParsedSdJwt`](#parsedsdjwt)

#### Returns

[`VerifiedSdJwt`](#verifiedsdjwt)
