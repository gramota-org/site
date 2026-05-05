---
title: "@gramota/jose"
slug: api/jose
description: "JWS sign + verify, x5c chain validation, pluggable Signer Strategy."
section: API reference
order: 8
---

> JWS sign + verify, x5c chain validation, pluggable Signer Strategy.

Install: `pnpm add @gramota/jose`

Source: [github.com/gramota-org/gramota/tree/main/packages/jose](https://github.com/gramota-org/gramota/tree/main/packages/jose)

## Classes

### JwkSigner

Defined in: @gramota/jose/dist/signer.d.ts:64

Default `Signer` implementation backed by an in-memory JWK.

Handy for tests, dev environments, and server-side issuers that hold
their signing key in a secret-manager-fetched env var. For mobile
wallets and high-assurance flows, swap in a hardware-backed Signer.

#### Implements

- [`Signer`](#signer)

#### Constructors

##### Constructor

```ts
new JwkSigner(options: JwkSignerOptions): JwkSigner;
```

Defined in: @gramota/jose/dist/signer.d.ts:70

###### Parameters

###### options

[`JwkSignerOptions`](#jwksigneroptions)

###### Returns

[`JwkSigner`](#jwksigner)

#### Properties

##### publicKey

```ts
readonly publicKey: JsonWebKey;
```

Defined in: @gramota/jose/dist/signer.d.ts:65

Public counterpart — verifiers use this. Must always be extractable
(not in an HSM), since it's needed downstream for `cnf.jwk` etc.

###### Implementation of

[`Signer`](#signer).[`publicKey`](#publickey)

##### alg

```ts
readonly alg: SupportedAlg;
```

Defined in: @gramota/jose/dist/signer.d.ts:66

JWS algorithm this signer produces. Must match `publicKey`'s
algorithm capabilities (e.g. ES256 with a P-256 EC key).

###### Implementation of

[`Signer`](#signer).[`alg`](#alg-1)

#### Methods

##### sign()

```ts
sign(signedPayload: string): Promise<string>;
```

Defined in: @gramota/jose/dist/signer.d.ts:71

Sign a "header.payload" string, return base64url(signature).

###### Parameters

###### signedPayload

`string`

###### Returns

`Promise`\<`string`\>

###### Implementation of

[`Signer`](#signer).[`sign`](#sign)

***

### JoseError

Defined in: @gramota/jose/dist/types.d.ts:40

#### Extends

- `Error`

#### Constructors

##### Constructor

```ts
new JoseError(
   code: JoseErrorCode, 
   message: string, 
   options?: {
  cause?: unknown;
}): JoseError;
```

Defined in: @gramota/jose/dist/types.d.ts:43

###### Parameters

###### code

[`JoseErrorCode`](#joseerrorcode)

###### message

`string`

###### options?

###### cause?

`unknown`

###### Returns

[`JoseError`](#joseerror)

###### Overrides

```ts
Error.constructor
```

#### Properties

##### name

```ts
readonly name: "JoseError" = "JoseError";
```

Defined in: @gramota/jose/dist/types.d.ts:41

###### Overrides

```ts
Error.name
```

##### code

```ts
readonly code: JoseErrorCode;
```

Defined in: @gramota/jose/dist/types.d.ts:42

##### message

```ts
message: string;
```

Defined in: .pnpm/typescript@5.9.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

```ts
Error.message
```

##### stack?

```ts
optional stack?: string;
```

Defined in: .pnpm/typescript@5.9.3/node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

```ts
Error.stack
```

## Interfaces

### FetcherResponse

Defined in: @gramota/jose/dist/fetcher.d.ts:30

Subset of the Web `Response` shape that Gramota libraries actually
consume.

Both `json()` and `text()` are required — every real-world `fetch`
impl (Web platform, undici, node-fetch) supplies both, and forcing
adapters to implement both keeps library call sites clean (no
`if (!response.text) throw` guards on the hot path). Test mocks
use the [mockFetcherResponse](#mockfetcherresponse) helper to satisfy the contract
without typing out every method.

#### Properties

##### ok

```ts
readonly ok: boolean;
```

Defined in: @gramota/jose/dist/fetcher.d.ts:31

##### status

```ts
readonly status: number;
```

Defined in: @gramota/jose/dist/fetcher.d.ts:32

##### headers?

```ts
readonly optional headers?: {
  get: string;
};
```

Defined in: @gramota/jose/dist/fetcher.d.ts:36

Optional, but if present must support case-insensitive header
lookup per HTTP §3.2. Required by RFC 9449 §8 (DPoP-Nonce) and
a few other "look at the header on a non-success response" paths.

###### get()

```ts
get(name: string): string;
```

###### Parameters

###### name

`string`

###### Returns

`string`

#### Methods

##### json()

```ts
json(): Promise<unknown>;
```

Defined in: @gramota/jose/dist/fetcher.d.ts:39

###### Returns

`Promise`\<`unknown`\>

##### text()

```ts
text(): Promise<string>;
```

Defined in: @gramota/jose/dist/fetcher.d.ts:40

###### Returns

`Promise`\<`string`\>

***

### SignJwsOptions

Defined in: @gramota/jose/dist/sign.d.ts:2

#### Properties

##### alg

```ts
alg: SupportedAlg;
```

Defined in: @gramota/jose/dist/sign.d.ts:4

Algorithm to use. Must be in the supported set.

##### typ?

```ts
optional typ?: string;
```

Defined in: @gramota/jose/dist/sign.d.ts:6

Optional `typ` JOSE header (e.g. "kb+jwt", "vc+sd-jwt").

##### kid?

```ts
optional kid?: string;
```

Defined in: @gramota/jose/dist/sign.d.ts:8

Optional `kid` JOSE header.

##### extraHeader?

```ts
optional extraHeader?: Record<string, unknown>;
```

Defined in: @gramota/jose/dist/sign.d.ts:10

Additional protected header parameters. Cannot override `alg`/`typ`/`kid`.

***

### Signer

Defined in: @gramota/jose/dist/signer.d.ts:38

A pluggable signing strategy.

`sign()` takes the JWS-canonical "header.payload" string (two
base64url-encoded segments joined by a dot) and returns just the
base64url-encoded signature segment. This shape matches what
`@gramota/sd-jwt`'s `issueSdJwt` `signer` callback expects, so a
`Signer` instance can drop in as that callback via `signer.sign`.

Implementations are expected to be stateless from the caller's
perspective — concurrent `sign()` calls must not interfere.

#### Properties

##### publicKey

```ts
readonly publicKey: JsonWebKey;
```

Defined in: @gramota/jose/dist/signer.d.ts:41

Public counterpart — verifiers use this. Must always be extractable
(not in an HSM), since it's needed downstream for `cnf.jwk` etc.

##### alg

```ts
readonly alg: SupportedAlg;
```

Defined in: @gramota/jose/dist/signer.d.ts:44

JWS algorithm this signer produces. Must match `publicKey`'s
algorithm capabilities (e.g. ES256 with a P-256 EC key).

#### Methods

##### sign()

```ts
sign(signedPayload: string): Promise<string>;
```

Defined in: @gramota/jose/dist/signer.d.ts:46

Sign a "header.payload" string, return base64url(signature).

###### Parameters

###### signedPayload

`string`

###### Returns

`Promise`\<`string`\>

***

### JwkSignerOptions

Defined in: @gramota/jose/dist/signer.d.ts:48

#### Properties

##### publicKey

```ts
publicKey: JsonWebKey;
```

Defined in: @gramota/jose/dist/signer.d.ts:50

Public counterpart — also used to bind the signer to its alg.

##### privateKey

```ts
privateKey: JsonWebKey;
```

Defined in: @gramota/jose/dist/signer.d.ts:53

Private JWK. Held in memory — see file header. Not for production
secret-material storage; use `WebAuthnSigner`/`HsmSigner` there.

##### alg

```ts
alg: SupportedAlg;
```

Defined in: @gramota/jose/dist/signer.d.ts:55

JWS alg.

***

### JsonWebKey

Defined in: @gramota/jose/dist/types.d.ts:2

JSON Web Key (RFC 7517). Minimum fields by key type.

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### kty

```ts
kty: "RSA" | "EC" | "OKP" | "oct";
```

Defined in: @gramota/jose/dist/types.d.ts:3

##### alg?

```ts
optional alg?: string;
```

Defined in: @gramota/jose/dist/types.d.ts:4

##### kid?

```ts
optional kid?: string;
```

Defined in: @gramota/jose/dist/types.d.ts:5

##### use?

```ts
optional use?: string;
```

Defined in: @gramota/jose/dist/types.d.ts:6

##### n?

```ts
optional n?: string;
```

Defined in: @gramota/jose/dist/types.d.ts:7

##### e?

```ts
optional e?: string;
```

Defined in: @gramota/jose/dist/types.d.ts:8

##### d?

```ts
optional d?: string;
```

Defined in: @gramota/jose/dist/types.d.ts:9

##### p?

```ts
optional p?: string;
```

Defined in: @gramota/jose/dist/types.d.ts:10

##### q?

```ts
optional q?: string;
```

Defined in: @gramota/jose/dist/types.d.ts:11

##### dp?

```ts
optional dp?: string;
```

Defined in: @gramota/jose/dist/types.d.ts:12

##### dq?

```ts
optional dq?: string;
```

Defined in: @gramota/jose/dist/types.d.ts:13

##### qi?

```ts
optional qi?: string;
```

Defined in: @gramota/jose/dist/types.d.ts:14

##### crv?

```ts
optional crv?: string;
```

Defined in: @gramota/jose/dist/types.d.ts:15

##### x?

```ts
optional x?: string;
```

Defined in: @gramota/jose/dist/types.d.ts:16

##### y?

```ts
optional y?: string;
```

Defined in: @gramota/jose/dist/types.d.ts:17

##### k?

```ts
optional k?: string;
```

Defined in: @gramota/jose/dist/types.d.ts:18

***

### VerifyJwsOptions

Defined in: @gramota/jose/dist/types.d.ts:23

#### Extended by

- [`VerifyJwsX5cOptions`](#verifyjwsx5coptions)

#### Properties

##### algorithms?

```ts
optional algorithms?: readonly SupportedAlg[];
```

Defined in: @gramota/jose/dist/types.d.ts:25

Algorithm allowlist. Defaults to all supported algorithms above.

***

### VerifiedJws

Defined in: @gramota/jose/dist/types.d.ts:27

#### Extended by

- [`VerifiedJwsWithX5c`](#verifiedjwswithx5c)

#### Properties

##### header

```ts
header: {
[key: string]: unknown;
  alg: string;
};
```

Defined in: @gramota/jose/dist/types.d.ts:29

Decoded JWS protected header.

###### Index Signature

```ts
[key: string]: unknown
```

###### alg

```ts
alg: string;
```

##### payload

```ts
payload: Record<string, unknown>;
```

Defined in: @gramota/jose/dist/types.d.ts:34

Decoded JWS payload (parsed as JSON).

##### alg

```ts
alg: SupportedAlg;
```

Defined in: @gramota/jose/dist/types.d.ts:36

The exact algorithm that verified successfully.

***

### VerifyJwsX5cOptions

Defined in: @gramota/jose/dist/verify-x5c.d.ts:3

#### Extends

- [`VerifyJwsOptions`](#verifyjwsoptions)

#### Properties

##### algorithms?

```ts
optional algorithms?: readonly SupportedAlg[];
```

Defined in: @gramota/jose/dist/types.d.ts:25

Algorithm allowlist. Defaults to all supported algorithms above.

###### Inherited from

[`VerifyJwsOptions`](#verifyjwsoptions).[`algorithms`](#algorithms)

##### trustAnchors?

```ts
optional trustAnchors?: readonly string[];
```

Defined in: @gramota/jose/dist/verify-x5c.d.ts:6

Optional cert-chain validation. When provided, the chain is verified
against the supplied trust anchors before signature verification.

##### now?

```ts
optional now?: Date;
```

Defined in: @gramota/jose/dist/verify-x5c.d.ts:8

Override "now" — for chain-validity tests.

***

### VerifiedJwsWithX5c

Defined in: @gramota/jose/dist/verify-x5c.d.ts:10

#### Extends

- [`VerifiedJws`](#verifiedjws)

#### Properties

##### header

```ts
header: {
[key: string]: unknown;
  alg: string;
};
```

Defined in: @gramota/jose/dist/types.d.ts:29

Decoded JWS protected header.

###### Index Signature

```ts
[key: string]: unknown
```

###### alg

```ts
alg: string;
```

###### Inherited from

[`VerifiedJws`](#verifiedjws).[`header`](#header)

##### payload

```ts
payload: Record<string, unknown>;
```

Defined in: @gramota/jose/dist/types.d.ts:34

Decoded JWS payload (parsed as JSON).

###### Inherited from

[`VerifiedJws`](#verifiedjws).[`payload`](#payload)

##### alg

```ts
alg: SupportedAlg;
```

Defined in: @gramota/jose/dist/types.d.ts:36

The exact algorithm that verified successfully.

###### Inherited from

[`VerifiedJws`](#verifiedjws).[`alg`](#alg-5)

##### chain?

```ts
optional chain?: ChainValidationResult;
```

Defined in: @gramota/jose/dist/verify-x5c.d.ts:12

Set when `trustAnchors` were supplied and the chain validated.

***

### ChainValidationOptions

Defined in: @gramota/jose/dist/x5c.d.ts:19

#### Properties

##### trustAnchors

```ts
trustAnchors: readonly string[];
```

Defined in: @gramota/jose/dist/x5c.d.ts:21

PEM-encoded trust anchor certificates the chain must lead to.

##### now?

```ts
optional now?: Date;
```

Defined in: @gramota/jose/dist/x5c.d.ts:23

Override "now" — useful for tests.

***

### ChainValidationResult

Defined in: @gramota/jose/dist/x5c.d.ts:25

#### Properties

##### leaf

```ts
leaf: X509Certificate;
```

Defined in: @gramota/jose/dist/x5c.d.ts:27

The leaf (x5c[0]) certificate, parsed.

##### chain

```ts
chain: readonly X509Certificate[];
```

Defined in: @gramota/jose/dist/x5c.d.ts:29

Every certificate in the chain, in x5c order.

##### anchor

```ts
anchor: X509Certificate;
```

Defined in: @gramota/jose/dist/x5c.d.ts:31

The trust anchor that ultimately validated the chain.

## Type Aliases

### Fetcher

```ts
type Fetcher = (url: string, init?: RequestInit) => Promise<FetcherResponse>;
```

Defined in: @gramota/jose/dist/fetcher.d.ts:44

Adapter-friendly HTTP fetcher. Compatible with global `fetch`,
`node-fetch`, `undici`, and test mocks.

#### Parameters

##### url

`string`

##### init?

`RequestInit`

#### Returns

`Promise`\<[`FetcherResponse`](#fetcherresponse)\>

***

### SupportedAlg

```ts
type SupportedAlg = 
  | "ES256"
  | "ES384"
  | "ES512"
  | "EdDSA"
  | "RS256"
  | "RS384"
  | "RS512"
  | "PS256"
  | "PS384"
  | "PS512";
```

Defined in: @gramota/jose/dist/types.d.ts:22

Algorithms we accept by default. `alg: "none"` is never permitted.

***

### JoseErrorCode

```ts
type JoseErrorCode = 
  | "jose.invalid_input"
  | "jose.malformed_jws"
  | "jose.malformed_header"
  | "jose.malformed_payload"
  | "jose.malformed_signature"
  | "jose.alg_missing"
  | "jose.alg_none_disallowed"
  | "jose.alg_not_allowed"
  | "jose.signature_invalid"
  | "jose.key_import_failed"
  | "jose.signing_failed"
  | "jose.x5c_missing"
  | "jose.x5c_empty"
  | "jose.x5c_parse_failed"
  | "jose.x5c_chain_invalid"
  | "jose.x5c_no_trust_anchor";
```

Defined in: @gramota/jose/dist/types.d.ts:39

Stable machine-readable error codes for `JoseError`.

## Functions

### mockFetcherResponse()

```ts
function mockFetcherResponse(input: {
  ok?: boolean;
  status?: number;
  json?: unknown;
  text?: string;
  headers?: Readonly<Record<string, string>>;
}): FetcherResponse;
```

Defined in: @gramota/jose/dist/fetcher.d.ts:55

Build a [FetcherResponse](#fetcherresponse) for tests / in-process adapters with
minimal boilerplate. Both `json()` and `text()` are derived from the
supplied body so the strict contract is satisfied without forcing
mock authors to spell every method out.

  mockFetcherResponse({ json: { keys: [...] } })
  mockFetcherResponse({ text: "compact-jws" })
  mockFetcherResponse({ ok: false, status: 404, text: "not found" })

#### Parameters

##### input

###### ok?

`boolean`

###### status?

`number`

###### json?

`unknown`

Provide either `json` or `text`. If both, `json` wins for `json()`,
`text` wins for `text()`. If neither, the body is the empty string.

###### text?

`string`

###### headers?

`Readonly`\<`Record`\<`string`, `string`\>\>

#### Returns

[`FetcherResponse`](#fetcherresponse)

***

### makeSigner()

```ts
function makeSigner(privateKey: JsonWebKey, alg: SupportedAlg): Promise<(signedPayload: string) => Promise<string>>;
```

Defined in: @gramota/jose/dist/make-signer.d.ts:10

Build a signer compatible with `@gramota/sd-jwt`'s `issueSdJwt` `signer`
field — takes `header.payload` and returns just the base64url signature.

This is the bridge between @gramota/jose (which signs full JWS strings)
and @gramota/sd-jwt (which composes its own header/payload and only needs
the signature back).

#### Parameters

##### privateKey

[`JsonWebKey`](#jsonwebkey)

##### alg

[`SupportedAlg`](#supportedalg)

#### Returns

`Promise`\<(`signedPayload`: `string`) => `Promise`\<`string`\>\>

***

### signJws()

```ts
function signJws(
   payload: Record<string, unknown>, 
   privateKey: JsonWebKey, 
options: SignJwsOptions): Promise<string>;
```

Defined in: @gramota/jose/dist/sign.d.ts:21

Sign a payload as a compact-serialised JWS.

Hard rules:
 - `alg=none` is impossible to request via this API: SupportedAlg never
   contains "none".
 - The provided `alg` is set in the protected header — `jose` will refuse
   to sign if the JWK can't perform that algorithm, so a typo is loud.

#### Parameters

##### payload

`Record`\<`string`, `unknown`\>

##### privateKey

[`JsonWebKey`](#jsonwebkey)

##### options

[`SignJwsOptions`](#signjwsoptions)

#### Returns

`Promise`\<`string`\>

***

### asSigner()

```ts
function asSigner(input: 
  | Signer
  | {
  publicKey: JsonWebKey;
  privateKey: JsonWebKey;
  alg: SupportedAlg;
}): Signer;
```

Defined in: @gramota/jose/dist/signer.d.ts:80

Promote a raw JWK config to a Signer, or pass through an existing one.

Used by orchestrators (Holder, Issuer, Oid4vciClient) to accept
either form on their config and normalize internally. Stripe-style
"shorthand" pattern — ergonomic for tests/dev, principled for prod.

#### Parameters

##### input

  \| [`Signer`](#signer)
  \| \{
  `publicKey`: [`JsonWebKey`](#jsonwebkey);
  `privateKey`: [`JsonWebKey`](#jsonwebkey);
  `alg`: [`SupportedAlg`](#supportedalg);
\}

#### Returns

[`Signer`](#signer)

***

### computeJwkThumbprint()

```ts
function computeJwkThumbprint(jwk: JsonWebKey): string;
```

Defined in: @gramota/jose/dist/thumbprint.d.ts:30

Compute the SHA-256 JWK Thumbprint per RFC 7638.

  computeJwkThumbprint({ kty: "EC", crv: "P-256", x: "...", y: "..." })
    → "G7B0w8...22 chars total"

Returns the thumbprint in base64url encoding (the canonical form
referenced by `jkt` claims). Throws [JoseError](#joseerror)
with `jose.invalid_input` for unsupported `kty` values or missing
required members.

#### Parameters

##### jwk

[`JsonWebKey`](#jsonwebkey)

#### Returns

`string`

***

### verifyJwsWithX5c()

```ts
function verifyJwsWithX5c(jws: string, options?: VerifyJwsX5cOptions): Promise<VerifiedJwsWithX5c>;
```

Defined in: @gramota/jose/dist/verify-x5c.d.ts:35

Verify a JWS where the public key is supplied via the `x5c` JOSE header
(RFC 7515 §4.1.6) — common for OID4VP authorization requests under the
EUDI HAIP profile and any deployment using x509 trust.

Two modes:
  - **Signature only** — extract key from x5c[0], verify the JWS. This
    proves cryptographic integrity but NOT that you trust the issuer.
  - **With trust anchors** — additionally validate the cert chain leads
    to one of `options.trustAnchors`. This proves authenticity to the
    extent your trust anchors are correct.

Errors:
  - `jose.x5c_missing`         — header has no x5c
  - `jose.x5c_empty`           — x5c is an empty array
  - `jose.x5c_parse_failed`    — a cert in x5c is malformed
  - `jose.x5c_chain_invalid`   — chain check failed (validity, signature)
  - `jose.x5c_no_trust_anchor` — last cert doesn't lead to a trusted root
  - `jose.signature_invalid`   — JWS signature didn't verify against x5c[0]
  - all the standard `jose.*` codes from `verifyJws`

#### Parameters

##### jws

`string`

##### options?

[`VerifyJwsX5cOptions`](#verifyjwsx5coptions)

#### Returns

`Promise`\<[`VerifiedJwsWithX5c`](#verifiedjwswithx5c)\>

***

### verifyJws()

```ts
function verifyJws(
   jws: string, 
   publicKey: JsonWebKey, 
options?: VerifyJwsOptions): Promise<VerifiedJws>;
```

Defined in: @gramota/jose/dist/verify.d.ts:30

Verify a compact-serialised JWS against a public JWK.

Hard rules (enforced before any crypto runs, so attackers can't smuggle
past via a body the crypto library accepts despite a malformed header):
 - `alg=none` is rejected unconditionally, regardless of the caller's
   allowlist.
 - The header `alg` MUST appear in `options.algorithms` (defaults to
   every IETF JOSE asymmetric algorithm).
 - The payload MUST decode to a JSON object — bare strings / arrays
   are rejected.

#### Parameters

##### jws

`string`

##### publicKey

[`JsonWebKey`](#jsonwebkey)

##### options?

[`VerifyJwsOptions`](#verifyjwsoptions)

#### Returns

`Promise`\<[`VerifiedJws`](#verifiedjws)\>

#### Example

```ts
const { header, payload, alg } = await verifyJws(jws, issuerJwk, {
  algorithms: ["ES256"], // narrow the allowlist
});
console.log(payload.iss);
```

#### Throws

[JoseError](#joseerror) with stable codes:
  - `jose.invalid_input` — empty / non-string JWS
  - `jose.malformed_jws`, `jose.malformed_header` — pre-flight parse failures
  - `jose.alg_missing`, `jose.alg_none_disallowed`, `jose.alg_not_allowed`
  - `jose.key_import_failed` — JWK couldn't be imported for this alg
  - `jose.signature_invalid` — cryptographic verification failed
  - `jose.malformed_payload` — payload isn't a JSON object

***

### x5cToPem()

```ts
function x5cToPem(x5cEntry: string): string;
```

Defined in: @gramota/jose/dist/x5c.d.ts:9

Convert a single `x5c` entry to PEM format.

Per RFC 7515 §4.1.6, x5c entries are base64-encoded (NOT base64url) DER
certificates. We just wrap them in standard PEM headers.

#### Parameters

##### x5cEntry

`string`

#### Returns

`string`

***

### parseX5cEntry()

```ts
function parseX5cEntry(x5cEntry: string): X509Certificate;
```

Defined in: @gramota/jose/dist/x5c.d.ts:11

Parse a single `x5c` entry as an X.509 certificate.

#### Parameters

##### x5cEntry

`string`

#### Returns

`X509Certificate`

***

### extractPublicKeyFromX5c()

```ts
function extractPublicKeyFromX5c(x5c: readonly string[]): JsonWebKey;
```

Defined in: @gramota/jose/dist/x5c.d.ts:18

Extract the public JWK from `x5c[0]` (the leaf signing certificate).

This produces a JWK suitable for passing to `verifyJws`. It does not
validate the chain or the cert's trust — use `validateX5cChain` for that.

#### Parameters

##### x5c

readonly `string`[]

#### Returns

[`JsonWebKey`](#jsonwebkey)

***

### validateX5cChain()

```ts
function validateX5cChain(x5c: readonly string[], options: ChainValidationOptions): ChainValidationResult;
```

Defined in: @gramota/jose/dist/x5c.d.ts:47

Validate an `x5c` chain against trust anchors.

Rules enforced:
  1. Every cert in `x5c` is currently within its validity window.
  2. Each cert is cryptographically signed by the next in `x5c`.
  3. The last cert in `x5c` is signed by (or equal to) one of `trustAnchors`.

Throws `JoseError` with `code: "jose.x5c_chain_invalid"` or
`"jose.x5c_no_trust_anchor"` if validation fails.

Returns the leaf certificate (for further inspection) and the trust anchor
that validated the chain.

#### Parameters

##### x5c

readonly `string`[]

##### options

[`ChainValidationOptions`](#chainvalidationoptions)

#### Returns

[`ChainValidationResult`](#chainvalidationresult)
