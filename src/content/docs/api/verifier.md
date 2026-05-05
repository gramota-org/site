---
title: "@gramota/verifier"
slug: api/verifier
description: "Relying-party verifier — 12 named security checks, IETF SD-JWT-VC + KB-JWT + OID4VP-compliant."
section: API reference
order: 1
---

> Relying-party verifier — 12 named security checks, IETF SD-JWT-VC + KB-JWT + OID4VP-compliant.

Install: `pnpm add @gramota/verifier`

Source: [github.com/gramota-org/gramota/tree/main/packages/verifier](https://github.com/gramota-org/gramota/tree/main/packages/verifier)

## Classes

### VerifierError

Defined in: @gramota/verifier/dist/types.d.ts:116

#### Extends

- `Error`

#### Constructors

##### Constructor

```ts
new VerifierError(message: string, result: FailureResult): VerifierError;
```

Defined in: @gramota/verifier/dist/types.d.ts:123

###### Parameters

###### message

`string`

###### result

[`FailureResult`](#failureresult)

The full failure record — stable for logging.

###### Returns

[`VerifierError`](#verifiererror)

###### Overrides

```ts
Error.constructor
```

#### Properties

##### result

```ts
readonly result: FailureResult;
```

Defined in: @gramota/verifier/dist/types.d.ts:118

The full failure record — stable for logging.

##### name

```ts
readonly name: "VerifierError" = "VerifierError";
```

Defined in: @gramota/verifier/dist/types.d.ts:119

###### Overrides

```ts
Error.name
```

##### code

```ts
readonly code: SecurityCheckName;
```

Defined in: @gramota/verifier/dist/types.d.ts:122

Equal to `result.failedCheck` — stable identifier for log filters,
alerts, and dashboards. Same shape as the codes used by other packages.

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

***

### Verifier

Defined in: @gramota/verifier/dist/verifier.d.ts:3

#### Constructors

##### Constructor

```ts
new Verifier(config: VerifierConfig): Verifier;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:11

###### Parameters

###### config

[`VerifierConfig`](#verifierconfig)

###### Returns

[`Verifier`](#verifier)

#### Methods

##### verify()

```ts
verify<TClaims>(presentationToken: string, options: VerifyOptions): Promise<VerifyResult<TClaims>>;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:19

Verify an SD-JWT-VC presentation token end-to-end.

Runs 9 security checks in order; stops at the first failure and reports
which check failed. On success, returns the disclosed claims plus
protocol metadata plus the full audit trail of checks performed.

###### Type Parameters

###### TClaims

`TClaims` = `Record`\<`string`, `unknown`\>

###### Parameters

###### presentationToken

`string`

###### options

[`VerifyOptions`](#verifyoptions)

###### Returns

`Promise`\<[`VerifyResult`](#verifyresult)\<`TClaims`\>\>

##### request()

```ts
request(options: PresentationRequestOptions): PresentationRequest;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:21

Build an OID4VP Authorization Request URL to share with the wallet.

###### Parameters

###### options

[`PresentationRequestOptions`](#presentationrequestoptions)

###### Returns

[`PresentationRequest`](#presentationrequest)

##### response()

```ts
response<TClaims>(rawBody: string | URLSearchParams | Record<string, string>, options: VerifyResponseOptions): Promise<VerifyResponseResult<TClaims>>;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:28

Process an OID4VP Authorization Response body end-to-end:
parse the form body, enforce CSRF state matching, and verify the
vp_token cryptographically. Returns the same result shape as `verify()`
plus the parsed transport envelope.

###### Type Parameters

###### TClaims

`TClaims` = `Record`\<`string`, `unknown`\>

###### Parameters

###### rawBody

`string` \| `URLSearchParams` \| `Record`\<`string`, `string`\>

###### options

[`VerifyResponseOptions`](#verifyresponseoptions)

###### Returns

`Promise`\<[`VerifyResponseResult`](#verifyresponseresult)\<`TClaims`\>\>

## Interfaces

### VerifierConfig

Defined in: @gramota/verifier/dist/types.d.ts:5

Configuration for a Verifier instance.

#### Properties

##### audience

```ts
audience: string;
```

Defined in: @gramota/verifier/dist/types.d.ts:9

The verifier's identifier. The KB-JWT's `aud` claim MUST equal this
(or any of `additionalAudiences`). Cross-verifier replay protection —
pick a stable, app-specific URL.

##### additionalAudiences?

```ts
optional additionalAudiences?: readonly string[];
```

Defined in: @gramota/verifier/dist/types.d.ts:15

Additional accepted `aud` values. Useful when wallets in the wild
disagree about what the KB-JWT audience should be. The OID4VP
`x509_san_dns:<host>` client_id is a common alternate form some
wallets (the EU reference wallet's eudi-app-android-wallet-ui) put
in `aud` instead of the verifier audience URL.

##### issuerKey?

```ts
optional issuerKey?: JsonWebKey;
```

Defined in: @gramota/verifier/dist/types.d.ts:18

Exactly one of `issuerKey` (shorthand) OR `trust` (full resolver) is
required.

##### trust?

```ts
optional trust?: TrustResolver;
```

Defined in: @gramota/verifier/dist/types.d.ts:22

Pluggable trust resolution. Use `StaticTrustResolver` for hard-coded
keys, `JwksUrlTrustResolver` for runtime JWKS fetching, or any custom
implementation of the `TrustResolver` interface.

##### statusResolver?

```ts
optional statusResolver?: StatusResolver;
```

Defined in: @gramota/verifier/dist/types.d.ts:33

Pluggable revocation/suspension resolution (Strategy pattern).

When set, the verifier runs a 10th security check ("status.check")
after all crypto checks pass. Default: omitted — no status check.

Use `StatusListResolver` for IETF Token Status List (the typical EU
choice). Custom resolvers (CRL, OCSP, EU Trusted Issuers Registry,
deny-lists) implement the `StatusResolver` interface and plug in here.

##### algorithms?

```ts
optional algorithms?: readonly SupportedAlg[];
```

Defined in: @gramota/verifier/dist/types.d.ts:37

JWS algorithm allowlist for both issuer and KB-JWT signatures.
Default: every IETF asymmetric algorithm we support.
`alg=none` is *never* permitted, regardless of this list.

##### maxKbJwtAgeSeconds?

```ts
optional maxKbJwtAgeSeconds?: number;
```

Defined in: @gramota/verifier/dist/types.d.ts:39

Maximum acceptable age of the KB-JWT, in seconds. Default 60.

##### maxClockSkewSeconds?

```ts
optional maxClockSkewSeconds?: number;
```

Defined in: @gramota/verifier/dist/types.d.ts:42

Maximum acceptable clock skew (KB-JWT `iat` in the future), in seconds.
Default 30.

***

### VerifyOptions

Defined in: @gramota/verifier/dist/types.d.ts:45

Per-call options for `verifier.verify(...)`.

#### Properties

##### nonce

```ts
nonce: string;
```

Defined in: @gramota/verifier/dist/types.d.ts:48

The challenge the verifier sent to the wallet. The KB-JWT's `nonce`
claim MUST equal this. Within-verifier replay protection.

##### now?

```ts
optional now?: () => number;
```

Defined in: @gramota/verifier/dist/types.d.ts:51

Override "now" — used for tests and time-frozen environments. Returns
Unix seconds. Default: `Math.floor(Date.now() / 1000)`.

###### Returns

`number`

##### requireStatus?

```ts
optional requireStatus?: boolean;
```

Defined in: @gramota/verifier/dist/types.d.ts:63

Status-check policy for THIS verification.

- When `false`/omitted, the configured `statusResolver` (if any)
  is still consulted; "skipped" is acceptable.
- When `true`, a credential with no resolvable status fails the
  "status.check" gate. Useful for high-assurance flows where
  non-revocable credentials are unacceptable.

Has no effect when no `statusResolver` is configured on the Verifier.

***

### SecurityCheck

Defined in: @gramota/verifier/dist/types.d.ts:68

A single security check, recorded for observability. Every check is
present in the result regardless of pass/fail, so customers can build
audit dashboards.

#### Properties

##### name

```ts
name: SecurityCheckName;
```

Defined in: @gramota/verifier/dist/types.d.ts:70

Stable identifier — useful for logs and dashboards.

##### passed

```ts
passed: boolean;
```

Defined in: @gramota/verifier/dist/types.d.ts:71

##### message?

```ts
optional message?: string;
```

Defined in: @gramota/verifier/dist/types.d.ts:73

Human-readable detail when the check fails.

***

### VerificationMetadata

Defined in: @gramota/verifier/dist/types.d.ts:78

Protocol metadata extracted alongside the user-facing claims.

#### Properties

##### issuer

```ts
issuer: string;
```

Defined in: @gramota/verifier/dist/types.d.ts:79

##### audience

```ts
audience: string;
```

Defined in: @gramota/verifier/dist/types.d.ts:80

##### issuedAt

```ts
issuedAt: number;
```

Defined in: @gramota/verifier/dist/types.d.ts:81

##### expiresAt

```ts
expiresAt: number;
```

Defined in: @gramota/verifier/dist/types.d.ts:82

##### holderKey

```ts
holderKey: Readonly<Record<string, unknown>>;
```

Defined in: @gramota/verifier/dist/types.d.ts:86

The holder's bound public JWK from cnf.jwk in the parent SD-JWT. After
verification this is guaranteed to be a well-formed JWK that successfully
verified the KB-JWT signature.

***

### SuccessResult

Defined in: @gramota/verifier/dist/types.d.ts:89

#### Type Parameters

##### TClaims

`TClaims` = `Record`\<`string`, `unknown`\>

#### Properties

##### ok

```ts
ok: true;
```

Defined in: @gramota/verifier/dist/types.d.ts:90

##### claims

```ts
claims: TClaims;
```

Defined in: @gramota/verifier/dist/types.d.ts:93

The selectively-disclosed user claims with `_sd` / `_sd_alg` / `cnf`
stripped — this is what the application actually consumes.

##### metadata

```ts
metadata: VerificationMetadata;
```

Defined in: @gramota/verifier/dist/types.d.ts:95

Protocol-level metadata that's not part of the user claims.

##### checks

```ts
checks: readonly SecurityCheck[];
```

Defined in: @gramota/verifier/dist/types.d.ts:97

Every check we ran, all passed. Useful for audit trails.

##### status?

```ts
optional status?: CredentialStatusResult | "skipped";
```

Defined in: @gramota/verifier/dist/types.d.ts:101

When `options.status` was supplied, the resolved status (or
"skipped" if the credential carried no status reference). Absent
when status checking wasn't requested.

#### Methods

##### unwrap()

```ts
unwrap(): TClaims;
```

Defined in: @gramota/verifier/dist/types.d.ts:103

Returns claims; never throws on success.

###### Returns

`TClaims`

***

### FailureResult

Defined in: @gramota/verifier/dist/types.d.ts:105

#### Properties

##### ok

```ts
ok: false;
```

Defined in: @gramota/verifier/dist/types.d.ts:106

##### reason

```ts
reason: string;
```

Defined in: @gramota/verifier/dist/types.d.ts:108

Human-readable reason — surfaces the message from the failed check.

##### failedCheck

```ts
failedCheck: SecurityCheckName;
```

Defined in: @gramota/verifier/dist/types.d.ts:110

Stable identifier of the first check that failed.

##### checks

```ts
checks: readonly SecurityCheck[];
```

Defined in: @gramota/verifier/dist/types.d.ts:112

Every check up to and including the one that failed.

#### Methods

##### unwrap()

```ts
unwrap(): never;
```

Defined in: @gramota/verifier/dist/types.d.ts:114

Throws `VerifierError` carrying this result.

###### Returns

`never`

***

### PresentationRequestOptions

Defined in: @gramota/verifier/dist/verifier.d.ts:36

Options for `verifier.request()`.

#### Properties

##### baseUrl

```ts
baseUrl: string;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:38

Base URL or scheme: `openid4vp://authorize`, `https://wallet.example.com/...`

##### nonce

```ts
nonce: string;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:40

OID4VP nonce.

##### state?

```ts
optional state?: string;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:42

Optional opaque CSRF state echoed back unchanged in the response.

##### responseUri?

```ts
optional responseUri?: string;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:44

`direct_post` callback URL (required when response_mode=direct_post).

##### presentationDefinition?

```ts
optional presentationDefinition?: Readonly<Record<string, unknown>>;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:46

Inline DIF Presentation Definition.

##### presentationDefinitionUri?

```ts
optional presentationDefinitionUri?: string;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:48

Or a URL the wallet can fetch the PD from. Mutually exclusive with above.

##### responseMode?

```ts
optional responseMode?: "direct_post" | "direct_post.jwt" | "fragment" | "query";
```

Defined in: @gramota/verifier/dist/verifier.d.ts:51

Override response_mode (default: direct_post when responseUri is set,
otherwise undefined).

##### clientIdScheme?

```ts
optional clientIdScheme?: string;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:53

client_id_scheme (default: redirect_uri).

##### clientId?

```ts
optional clientId?: string;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:55

Override the client_id (defaults to the verifier's audience).

***

### PresentationRequest

Defined in: @gramota/verifier/dist/verifier.d.ts:58

Result of `verifier.request()`.

#### Properties

##### url

```ts
url: string;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:60

The full URL to share with the wallet (QR / deep link).

##### request

```ts
request: AuthorizationRequest;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:62

The structured AuthorizationRequest, useful for storage and logging.

##### nonce

```ts
nonce: string;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:64

Echoes the nonce so callers can persist it for later verification.

##### state

```ts
state: string;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:66

Echoes the state if one was supplied.

***

### VerifyResponseOptions

Defined in: @gramota/verifier/dist/verifier.d.ts:69

Options for `verifier.response()`.

#### Properties

##### expectedNonce

```ts
expectedNonce: string;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:71

Required — the nonce used in the original request.

##### expectedState?

```ts
optional expectedState?: string;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:73

Optional — when supplied, response.state MUST equal this.

##### now?

```ts
optional now?: () => number;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:75

Override "now" — for tests.

###### Returns

`number`

##### requireStatus?

```ts
optional requireStatus?: boolean;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:79

Forwarded to `verify()` — fail when credential has no resolvable
status. Has effect only when the Verifier was constructed with a
`statusResolver`.

## Type Aliases

### SecurityCheckName

```ts
type SecurityCheckName = 
  | "structure.parse"
  | "trust.resolution"
  | "issuer.signature"
  | "hash-binding.disclosures"
  | "kb-jwt.present"
  | "kb-jwt.cnf-binding"
  | "kb-jwt.signature"
  | "kb-jwt.audience"
  | "kb-jwt.nonce"
  | "kb-jwt.time"
  | "kb-jwt.transcript"
  | "status.check";
```

Defined in: @gramota/verifier/dist/types.d.ts:76

Stable identifiers for the security checks we run, in execution order.

***

### VerifyResult

```ts
type VerifyResult<TClaims> = 
  | SuccessResult<TClaims>
  | FailureResult;
```

Defined in: @gramota/verifier/dist/types.d.ts:88

#### Type Parameters

##### TClaims

`TClaims` = `Record`\<`string`, `unknown`\>

***

### VerifyResponseResult

```ts
type VerifyResponseResult<TClaims> = VerifyResult<TClaims> & {
  response?: AuthorizationResponse;
};
```

Defined in: @gramota/verifier/dist/verifier.d.ts:32

Result of `verifier.responses.verify()` — same shape as `VerifyResult`
plus the parsed OID4VP transport envelope.

#### Type Declaration

##### response?

```ts
optional response?: AuthorizationResponse;
```

#### Type Parameters

##### TClaims

`TClaims` = `Record`\<`string`, `unknown`\>

## Functions

### inspect()

```ts
function inspect(presentationToken: string): ParsedSdJwt;
```

Defined in: @gramota/verifier/dist/inspect.d.ts:7

Parse an SD-JWT-VC presentation token without verifying anything.
Useful for debug UIs, CLI tools, and admin dashboards. Never use the
output to make trust decisions — that's `verifier.verify()`'s job.

#### Parameters

##### presentationToken

`string`

#### Returns

`ParsedSdJwt`
