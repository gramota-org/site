---
title: "@gramota/oid4vp"
slug: api/oid4vp
description: "OID4VP wire format — request, response, signed JAR (RFC 9101), x509_san_dns cert helpers."
section: API reference
order: 4
---

# @gramota/oid4vp

> OID4VP wire format — request, response, signed JAR (RFC 9101), x509_san_dns cert helpers.

Install: `pnpm add @gramota/oid4vp`

Source: [github.com/gramota-org/gramota/tree/main/packages/oid4vp](https://github.com/gramota-org/gramota/tree/main/packages/oid4vp)

## Classes

### Oid4vpError

Defined in: @gramota/oid4vp/dist/types.d.ts:111

#### Extends

- `Error`

#### Constructors

##### Constructor

```ts
new Oid4vpError(
   code: Oid4vpErrorCode, 
   message: string, 
   options?: {
  cause?: unknown;
}): Oid4vpError;
```

Defined in: @gramota/oid4vp/dist/types.d.ts:114

###### Parameters

###### code

[`Oid4vpErrorCode`](#oid4vperrorcode)

###### message

`string`

###### options?

###### cause?

`unknown`

###### Returns

[`Oid4vpError`](#oid4vperror)

###### Overrides

```ts
Error.constructor
```

#### Properties

##### name

```ts
readonly name: "Oid4vpError" = "Oid4vpError";
```

Defined in: @gramota/oid4vp/dist/types.d.ts:112

###### Overrides

```ts
Error.name
```

##### code

```ts
readonly code: Oid4vpErrorCode;
```

Defined in: @gramota/oid4vp/dist/types.d.ts:113

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

### GenerateSigningCertOptions

Defined in: @gramota/oid4vp/dist/cert.d.ts:22

#### Properties

##### sanDns

```ts
readonly sanDns: string;
```

Defined in: @gramota/oid4vp/dist/cert.d.ts:26

Primary DNS name for the cert's Subject Alternative Name. Must match
the verifier's hostname (the part the wallet sees in the OID4VP
`client_id` after the `x509_san_dns:` prefix).

##### extraSanDns?

```ts
readonly optional extraSanDns?: readonly string[];
```

Defined in: @gramota/oid4vp/dist/cert.d.ts:30

Additional SAN-DNS entries — used for wildcards (e.g. `*.localtest.me`)
so a single cert covers per-tenant subdomains, or for serving multiple
verifier hostnames behind one identity.

##### commonName?

```ts
readonly optional commonName?: string;
```

Defined in: @gramota/oid4vp/dist/cert.d.ts:33

Cert subject CN — purely cosmetic, shown in cert viewers. Defaults
to `sanDns`.

##### organizationName?

```ts
readonly optional organizationName?: string;
```

Defined in: @gramota/oid4vp/dist/cert.d.ts:35

Org name for the cert subject. Defaults to `"Gramota Verifier"`.

##### validDays?

```ts
readonly optional validDays?: number;
```

Defined in: @gramota/oid4vp/dist/cert.d.ts:37

Validity in days. Default 365.

***

### SignAuthorizationRequestOptions

Defined in: @gramota/oid4vp/dist/jar.d.ts:22

#### Properties

##### request

```ts
readonly request: AuthorizationRequest;
```

Defined in: @gramota/oid4vp/dist/jar.d.ts:26

The verifier's Authorization Request to sign. Must already include
the verifier-side fields (`client_id`, `nonce`, `response_uri`, etc).
The signer doesn't validate semantic content — only wire-encodes.

##### cert

```ts
readonly cert: SigningCert;
```

Defined in: @gramota/oid4vp/dist/jar.d.ts:29

The verifier's signing material — produced by `generateSigningCert`
or supplied externally.

***

### AuthorizationRequest

Defined in: @gramota/oid4vp/dist/types.d.ts:18

OID4VP §5 — Authorization Request, the bundle a verifier sends to a wallet.

In production this is delivered as a query string, a `request_uri` (signed
JWT), or via a custom URI scheme like `openid4vp://`. We model the parsed
structure once and let serialisation handle the rest.

#### Properties

##### response\_type

```ts
response_type: "vp_token";
```

Defined in: @gramota/oid4vp/dist/types.d.ts:20

MUST be `vp_token` per OID4VP §5.

##### client\_id

```ts
client_id: string;
```

Defined in: @gramota/oid4vp/dist/types.d.ts:22

Identifier of the verifier — meaning depends on `client_id_scheme`.

##### client\_id\_scheme?

```ts
optional client_id_scheme?: ClientIdScheme;
```

Defined in: @gramota/oid4vp/dist/types.d.ts:25

How the wallet should resolve and trust `client_id`. Default
`pre-registered` — for HAIP/EUDIW the spec mandates explicit.

##### response\_mode?

```ts
optional response_mode?: ResponseMode;
```

Defined in: @gramota/oid4vp/dist/types.d.ts:27

How the wallet returns the response. HAIP requires `direct_post`.

##### response\_uri?

```ts
optional response_uri?: string;
```

Defined in: @gramota/oid4vp/dist/types.d.ts:29

Where to POST the response when `response_mode=direct_post`.

##### redirect\_uri?

```ts
optional redirect_uri?: string;
```

Defined in: @gramota/oid4vp/dist/types.d.ts:31

Where to redirect the response for legacy modes.

##### nonce

```ts
nonce: string;
```

Defined in: @gramota/oid4vp/dist/types.d.ts:33

Cryptographic challenge — bound into KB-JWT to prevent replay.

##### state?

```ts
optional state?: string;
```

Defined in: @gramota/oid4vp/dist/types.d.ts:35

Opaque verifier-controlled correlation token, echoed back unchanged.

##### presentation\_definition?

```ts
optional presentation_definition?: Readonly<Record<string, unknown>>;
```

Defined in: @gramota/oid4vp/dist/types.d.ts:38

Inline DIF Presentation Definition JSON — what the verifier wants
(OID4VP 1.0 query shape).

##### presentation\_definition\_uri?

```ts
optional presentation_definition_uri?: string;
```

Defined in: @gramota/oid4vp/dist/types.d.ts:40

Or a URL the wallet can fetch the PD from. Mutually exclusive with above.

##### dcql\_query?

```ts
optional dcql_query?: Readonly<Record<string, unknown>>;
```

Defined in: @gramota/oid4vp/dist/types.d.ts:43

DCQL query (OID4VP 2.0 — Digital Credentials Query Language).
Mutually exclusive with `presentation_definition`.

##### client\_metadata?

```ts
optional client_metadata?: Readonly<Record<string, unknown>>;
```

Defined in: @gramota/oid4vp/dist/types.d.ts:45

Wallet metadata transparency parameter.

##### scope?

```ts
optional scope?: string;
```

Defined in: @gramota/oid4vp/dist/types.d.ts:48

Subset of the wallet's supported response formats / curves the verifier
is willing to accept.

***

### AuthorizationResponse

Defined in: @gramota/oid4vp/dist/types.d.ts:64

OID4VP §6 — Authorization Response from wallet to verifier.

The wire shape depends on which query language the request used:

  - **Presentation Exchange (DIF PEX)**: `vp_token` is a string or
    string[], paired with `presentation_submission` mapping descriptors
    to vp_token positions.
  - **DCQL** (OID4VP Final 1.0): `vp_token` is a JSON OBJECT keyed by
    the DCQL credential `id` (e.g. `{"pid": "<sd-jwt-vc>"}`). No
    `presentation_submission` is sent — the keys ARE the mapping.

Verifiers should accept whichever shape the wallet sends; production EU
wallets (eudi-lib-android-wallet-ui 0.26+) use DCQL exclusively.

#### Properties

##### vp\_token

```ts
vp_token: 
  | string
  | readonly string[]
| Readonly<Record<string, string>>;
```

Defined in: @gramota/oid4vp/dist/types.d.ts:71

The presentation(s).

  - String / string[] form (PEX response).
  - Object form (DCQL response) — keys are the DCQL credential ids
    and values are the credential strings.

##### presentation\_submission?

```ts
optional presentation_submission?: Readonly<Record<string, unknown>>;
```

Defined in: @gramota/oid4vp/dist/types.d.ts:74

DIF Presentation Submission mapping descriptors → vp_token positions.
Required for PEX responses; absent for DCQL responses.

##### state?

```ts
optional state?: string;
```

Defined in: @gramota/oid4vp/dist/types.d.ts:76

Echoes the verifier's `state` from the request.

##### iss?

```ts
optional iss?: string;
```

Defined in: @gramota/oid4vp/dist/types.d.ts:78

OID4VP §6.4 — the wallet's identifier (e.g. issuer URL).

***

### SigningCert

Defined in: @gramota/oid4vp/dist/types.d.ts:96

X.509 signing material for an OID4VP verifier.

Bundles together the four artefacts a verifier needs to produce signed
Authorization Requests (RFC 9101 JAR) and prove its identity to wallets
via the `x509_san_dns` client_id_prefix:

  - `privateKeyPem` — PKCS#8 private key, used to sign the JAR
  - `certificatePem` — leaf cert, served when the wallet asks for proof
  - `x5c` — base64 DER cert(s) embedded in the JWS `x5c` header
  - `sanDns` — the SAN-DNS hostname the wallet matches against `client_id`

Generation: see `generateSigningCert` for self-signed certs (local dev,
pinned-trust-store deployments). Production typically uses an externally
issued cert (ACME, corporate CA) — same shape, different origin.

#### Properties

##### privateKeyPem

```ts
readonly privateKeyPem: string;
```

Defined in: @gramota/oid4vp/dist/types.d.ts:98

PEM-encoded PKCS#8 private key.

##### certificatePem

```ts
readonly certificatePem: string;
```

Defined in: @gramota/oid4vp/dist/types.d.ts:100

PEM-encoded leaf certificate.

##### x5c

```ts
readonly x5c: readonly string[];
```

Defined in: @gramota/oid4vp/dist/types.d.ts:103

Base64-encoded DER certs in chain order, suitable for the JWS `x5c`
header per RFC 7515 §4.1.6. Length 1 for self-signed leaves.

##### sanDns

```ts
readonly sanDns: string;
```

Defined in: @gramota/oid4vp/dist/types.d.ts:107

DNS name in the cert's Subject Alternative Name. The wallet
compares this against the OID4VP `client_id` value (with the
`x509_san_dns:` prefix stripped).

## Type Aliases

### ClientIdScheme

```ts
type ClientIdScheme = 
  | "pre-registered"
  | "redirect_uri"
  | "https"
  | "did"
  | "x509_san_dns"
  | "x509_san_uri"
  | "verifier_attestation"
  | string & {
};
```

Defined in: @gramota/oid4vp/dist/types.d.ts:10

OID4VP §5.4 — `client_id_scheme` enumerated values.

***

### ResponseMode

```ts
type ResponseMode = "direct_post" | "direct_post.jwt" | "fragment" | "query";
```

Defined in: @gramota/oid4vp/dist/types.d.ts:12

OID4VP §6.2 — `response_mode` for the authorization response.

***

### Oid4vpErrorCode

```ts
type Oid4vpErrorCode = 
  | "oid4vp.invalid_url"
  | "oid4vp.required_field_missing"
  | "oid4vp.unsupported_response_type"
  | "oid4vp.mutually_exclusive_fields"
  | "oid4vp.response_uri_required"
  | "oid4vp.invalid_json"
  | "oid4vp.invalid_value_type"
  | "oid4vp.malformed_body"
  | "oid4vp.malformed_submission"
  | "oid4vp.cert_generation_failed"
  | "oid4vp.jar_signing_failed";
```

Defined in: @gramota/oid4vp/dist/types.d.ts:110

Stable codes for `Oid4vpError`.

## Functions

### generateSigningCert()

```ts
function generateSigningCert(input: GenerateSigningCertOptions): Promise<SigningCert>;
```

Defined in: @gramota/oid4vp/dist/cert.d.ts:53

Generate an ES256 keypair + self-signed X.509 cert with the given
SAN-DNS entries.

The cert carries the standard verifier-identity extensions: serverAuth
+ clientAuth EKUs (so wallets that look for a TLS-style cert accept
it), digitalSignature + keyEncipherment KU flags, and CA:false.

Returns a [SigningCert](#signingcert) ready to feed into
[signAuthorizationRequest](#signauthorizationrequest).

#### Parameters

##### input

[`GenerateSigningCertOptions`](#generatesigningcertoptions)

#### Returns

`Promise`\<[`SigningCert`](#signingcert)\>

#### Throws

[Oid4vpError](#oid4vperror) with `oid4vp.cert_generation_failed` if
  the underlying crypto / X.509 generation fails.

***

### signingCertToJwks()

```ts
function signingCertToJwks(cert: SigningCert): Promise<{
  publicJwk: JsonWebKey;
  privateJwk: JsonWebKey;
}>;
```

Defined in: @gramota/oid4vp/dist/cert.d.ts:68

Convert a [SigningCert](#signingcert) (PEM bundle) into the JWK pair that
`@gramota/issuer` and other JOSE consumers expect.

Unlike `generateSigningCert` this is a pure conversion — it doesn't
touch crypto state or generate anything new. It just bridges the two
representations of the same key material:

  - Input shape: PKCS#8 PEM (private) + X.509 PEM (public-via-cert)
  - Output shape: two RFC 7517 JWKs with `alg: "ES256"` set

Throws [Oid4vpError](#oid4vperror) with `oid4vp.cert_generation_failed` on a
malformed PEM or an unrecognised key type.

#### Parameters

##### cert

[`SigningCert`](#signingcert)

#### Returns

`Promise`\<\{
  `publicJwk`: `JsonWebKey`;
  `privateJwk`: `JsonWebKey`;
\}\>

***

### signAuthorizationRequest()

```ts
function signAuthorizationRequest(options: SignAuthorizationRequestOptions): Promise<string>;
```

Defined in: @gramota/oid4vp/dist/jar.d.ts:49

Sign an OID4VP Authorization Request as a compact-serialised JWS,
formatted per RFC 9101 + OID4VP §5.10.

The JWS header carries:
  - `alg: "ES256"` (the only algorithm the EU wallet currently accepts
    for x509_san_dns prefix; future iterations can lift this)
  - `typ: "oauth-authz-req+jwt"` per RFC 9101
  - `x5c: [<base64-DER leaf cert>]` so the wallet doesn't need a
    separate key-discovery step

The JWS payload IS the request object — claims at the top level, not
wrapped in some envelope (RFC 9101 §10.2). Caller serves the result
with content type `application/oauth-authz-req+jwt`.

#### Parameters

##### options

[`SignAuthorizationRequestOptions`](#signauthorizationrequestoptions)

#### Returns

`Promise`\<`string`\>

#### Throws

[Oid4vpError](#oid4vperror) with `oid4vp.jar_signing_failed` if the
  private key is malformed or signing fails.

***

### buildAuthorizationRequestUrl()

```ts
function buildAuthorizationRequestUrl(baseUrl: string, request: AuthorizationRequest): string;
```

Defined in: @gramota/oid4vp/dist/request.d.ts:33

Serialise an Authorization Request to a URL with query parameters per
OID4VP §5.1 (parameter encoding rules).

The base URL is typically a custom scheme like `openid4vp://` for the
native wallet handoff, or `https://wallet.example.com/authorize` for
web flows — both work, the function just appends the query string.

Object-valued parameters (`presentation_definition`, `dcql_query`,
`client_metadata`) are JSON-encoded into the query string per §5.1.

For HAIP / EUDIW-compliant verifiers, this output is typically wrapped
in a signed JAR (RFC 9101) via [signAuthorizationRequest](#signauthorizationrequest) and
delivered as `request=<jwt>` rather than as raw query params.

#### Parameters

##### baseUrl

`string`

##### request

[`AuthorizationRequest`](#authorizationrequest)

#### Returns

`string`

#### Example

```ts
const url = buildAuthorizationRequestUrl("openid4vp://", {
  response_type: "vp_token",
  client_id: "x509_san_dns:verifier.example",
  nonce: "n-12345",
  response_mode: "direct_post",
  response_uri: "https://verifier.example/oid4vp/response",
  dcql_query: { credentials: [{ id: "pid", format: "dc+sd-jwt", meta: {...} }] },
});
```

#### Throws

[Oid4vpError](#oid4vperror) `oid4vp.required_field_missing`,
  `oid4vp.unsupported_response_type`, `oid4vp.mutually_exclusive_fields`,
  `oid4vp.response_uri_required`, or `oid4vp.invalid_value_type`.

***

### parseAuthorizationRequestUrl()

```ts
function parseAuthorizationRequestUrl(rawUrl: string): AuthorizationRequest;
```

Defined in: @gramota/oid4vp/dist/request.d.ts:45

Parse an OID4VP Authorization Request from a URL string.

Inverse of [buildAuthorizationRequestUrl](#buildauthorizationrequesturl). Validates required
fields and mutually-exclusive flag combinations; does NOT verify a
signed JAR (use the wallet's JWS verification step for that, then
call this function on the JAR's payload claims).

#### Parameters

##### rawUrl

`string`

#### Returns

[`AuthorizationRequest`](#authorizationrequest)

#### Throws

[Oid4vpError](#oid4vperror) with `oid4vp.invalid_url`,
  `oid4vp.required_field_missing`, or other field-validation codes.

***

### parseAuthorizationRequestSearchParams()

```ts
function parseAuthorizationRequestSearchParams(params: URLSearchParams | Record<string, string>): AuthorizationRequest;
```

Defined in: @gramota/oid4vp/dist/request.d.ts:59

Parse an OID4VP Authorization Request from URL query parameters.

Useful when the verifier already has parsed query params from a web
framework (`req.query` from Express, Hono, Fastify, ...). Accepts
either a `URLSearchParams` instance or a plain `Record<string, string>`.

Object-valued params (`presentation_definition`, `dcql_query`,
`client_metadata`) are JSON-decoded; everything else is left as-is.

#### Parameters

##### params

`URLSearchParams` \| `Record`\<`string`, `string`\>

#### Returns

[`AuthorizationRequest`](#authorizationrequest)

#### Throws

[Oid4vpError](#oid4vperror) with `oid4vp.invalid_json` if a JSON-valued
  param is malformed, plus the standard field-validation codes.

***

### buildAuthorizationResponseBody()

```ts
function buildAuthorizationResponseBody(response: AuthorizationResponse): string;
```

Defined in: @gramota/oid4vp/dist/response.d.ts:13

Serialise an Authorization Response to a URL-encoded form body, suitable
for `direct_post` (POST application/x-www-form-urlencoded). Per OID4VP §6:

 - `vp_token` is the raw presentation string, a JSON-encoded array if
   multiple credentials are presented (PEX), or a JSON-encoded object
   keyed by DCQL credential id (DCQL response form).
 - `presentation_submission` is JSON-encoded — only included for PEX
   responses; DCQL responses omit it.
 - `state` (optional) and `iss` (optional) pass through as strings.

#### Parameters

##### response

[`AuthorizationResponse`](#authorizationresponse)

#### Returns

`string`

***

### parseAuthorizationResponseBody()

```ts
function parseAuthorizationResponseBody(rawBody: string): AuthorizationResponse;
```

Defined in: @gramota/oid4vp/dist/response.d.ts:15

Parse an Authorization Response from a URL-encoded form body string.

#### Parameters

##### rawBody

`string`

#### Returns

[`AuthorizationResponse`](#authorizationresponse)

***

### parseAuthorizationResponseFromParams()

```ts
function parseAuthorizationResponseFromParams(params: URLSearchParams | Record<string, string>): AuthorizationResponse;
```

Defined in: @gramota/oid4vp/dist/response.d.ts:18

Parse from URLSearchParams or a plain object — handy when frameworks have
already decoded the body.

#### Parameters

##### params

`URLSearchParams` \| `Record`\<`string`, `string`\>

#### Returns

[`AuthorizationResponse`](#authorizationresponse)
