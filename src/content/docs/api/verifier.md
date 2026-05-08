---
title: "@gramota/verifier"
slug: api/verifier
description: "Relying-party verifier — 12 named security checks, IETF SD-JWT-VC + KB-JWT + OID4VP-compliant."
section: API reference
order: 1
---

# @gramota/verifier

> Relying-party verifier — 12 named security checks, IETF SD-JWT-VC + KB-JWT + OID4VP-compliant.

Install: `pnpm add @gramota/verifier`

Source: [github.com/gramota-org/gramota/tree/main/packages/verifier](https://github.com/gramota-org/gramota/tree/main/packages/verifier)

## Classes

### VerifierError

Defined in: @gramota/verifier/dist/types.d.ts:167

#### Extends

- `GramotaError`

#### Constructors

##### Constructor

```ts
new VerifierError(message: string, result: FailureResult): VerifierError;
```

Defined in: @gramota/verifier/dist/types.d.ts:173

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

##### result

```ts
readonly result: FailureResult;
```

Defined in: @gramota/verifier/dist/types.d.ts:169

The full failure record — stable for logging.

##### code

```ts
readonly code: SecurityCheckName;
```

Defined in: @gramota/verifier/dist/types.d.ts:172

Equal to `result.failedCheck` — stable identifier for log filters,
alerts, and dashboards. Same shape as the codes used by other packages.

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

#### Properties

##### presentations

```ts
readonly presentations: {
  verify: Promise<VerifyResult<TClaims>>;
};
```

Defined in: @gramota/verifier/dist/verifier.d.ts:13

Verify a presentation token. Stripe-shaped surface.

###### verify()

```ts
verify<TClaims>(presentationToken: string, options: VerifyOptions<TClaims>): Promise<VerifyResult<TClaims>>;
```

###### Type Parameters

###### TClaims

`TClaims` = `Record`\<`string`, `unknown`\>

###### Parameters

###### presentationToken

`string`

###### options

[`VerifyOptions`](#verifyoptions)\<`TClaims`\>

###### Returns

`Promise`\<[`VerifyResult`](#verifyresult)\<`TClaims`\>\>

##### responses

```ts
readonly responses: {
  verify: Promise<VerifyResponseResult<TClaims>>;
};
```

Defined in: @gramota/verifier/dist/verifier.d.ts:17

Verify an OID4VP authorization response body. Stripe-shaped surface.

###### verify()

```ts
verify<TClaims>(rawBody: string | URLSearchParams | Record<string, string>, options: VerifyResponseOptions<TClaims>): Promise<VerifyResponseResult<TClaims>>;
```

###### Type Parameters

###### TClaims

`TClaims` = `Record`\<`string`, `unknown`\>

###### Parameters

###### rawBody

`string` \| `URLSearchParams` \| `Record`\<`string`, `string`\>

###### options

[`VerifyResponseOptions`](#verifyresponseoptions)\<`TClaims`\>

###### Returns

`Promise`\<[`VerifyResponseResult`](#verifyresponseresult)\<`TClaims`\>\>

##### requests

```ts
readonly requests: {
  create: PresentationRequest;
};
```

Defined in: @gramota/verifier/dist/verifier.d.ts:21

Build a signed presentation request for the wallet. Stripe-shaped surface.

###### create()

```ts
create(options: PresentationRequestOptions): PresentationRequest;
```

###### Parameters

###### options

[`PresentationRequestOptions`](#presentationrequestoptions)

###### Returns

[`PresentationRequest`](#presentationrequest)

## Interfaces

### VerifierConfig

Defined in: @gramota/verifier/dist/types.d.ts:6

Configuration for a Verifier instance.

#### Properties

##### audience

```ts
audience: string;
```

Defined in: @gramota/verifier/dist/types.d.ts:10

The verifier's identifier. The KB-JWT's `aud` claim MUST equal this
(or any of `additionalAudiences`). Cross-verifier replay protection —
pick a stable, app-specific URL.

##### additionalAudiences?

```ts
optional additionalAudiences?: readonly string[];
```

Defined in: @gramota/verifier/dist/types.d.ts:16

Additional accepted `aud` values. Useful when wallets in the wild
disagree about what the KB-JWT audience should be. The OID4VP
`x509_san_dns:<host>` client_id is a common alternate form some
wallets (the EU reference wallet's eudi-app-android-wallet-ui) put
in `aud` instead of the verifier audience URL.

##### issuerKey?

```ts
optional issuerKey?: JsonWebKey;
```

Defined in: @gramota/verifier/dist/types.d.ts:19

Exactly one of `issuerKey` (shorthand) OR `trust` (full resolver) is
required.

##### trust?

```ts
optional trust?: TrustResolver;
```

Defined in: @gramota/verifier/dist/types.d.ts:23

Pluggable trust resolution. Use `StaticTrustResolver` for hard-coded
keys, `JwksUrlTrustResolver` for runtime JWKS fetching, or any custom
implementation of the `TrustResolver` interface.

##### statusResolver?

```ts
optional statusResolver?: StatusResolver;
```

Defined in: @gramota/verifier/dist/types.d.ts:34

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

Defined in: @gramota/verifier/dist/types.d.ts:38

JWS algorithm allowlist for both issuer and KB-JWT signatures.
Default: every IETF asymmetric algorithm we support.
`alg=none` is *never* permitted, regardless of this list.

##### maxKbJwtAgeSeconds?

```ts
optional maxKbJwtAgeSeconds?: number;
```

Defined in: @gramota/verifier/dist/types.d.ts:40

Maximum acceptable age of the KB-JWT, in seconds. Default 60.

##### maxClockSkewSeconds?

```ts
optional maxClockSkewSeconds?: number;
```

Defined in: @gramota/verifier/dist/types.d.ts:43

Maximum acceptable clock skew (KB-JWT `iat` in the future), in seconds.
Default 30.

***

### RequireInput

Defined in: @gramota/verifier/dist/types.d.ts:46

Input passed to [VerifyOptions.require](#require) predicates.

#### Type Parameters

##### TClaims

`TClaims` = `Record`\<`string`, `unknown`\>

#### Properties

##### claims

```ts
readonly claims: TClaims;
```

Defined in: @gramota/verifier/dist/types.d.ts:48

The disclosed claims — same shape as `result.claims` on success.

##### metadata

```ts
readonly metadata: VerificationMetadata;
```

Defined in: @gramota/verifier/dist/types.d.ts:50

Protocol metadata — same shape as `result.metadata` on success.

***

### RequireResult

Defined in: @gramota/verifier/dist/types.d.ts:57

Return shape for [VerifyOptions.require](#require) when the caller wants
to attach a human-readable reason. Plain `boolean` is also accepted
for the common case.

#### Properties

##### passed

```ts
readonly passed: boolean;
```

Defined in: @gramota/verifier/dist/types.d.ts:58

##### reason?

```ts
readonly optional reason?: string;
```

Defined in: @gramota/verifier/dist/types.d.ts:61

Shown in `result.reason` and the audit trail when `passed: false`.
Default: `"require predicate returned false"`.

***

### VerifyOptions

Defined in: @gramota/verifier/dist/types.d.ts:64

Per-call options for `verifier.verify(...)`.

#### Type Parameters

##### TClaims

`TClaims` = `Record`\<`string`, `unknown`\>

#### Properties

##### nonce

```ts
nonce: string;
```

Defined in: @gramota/verifier/dist/types.d.ts:67

The challenge the verifier sent to the wallet. The KB-JWT's `nonce`
claim MUST equal this. Within-verifier replay protection.

##### now?

```ts
optional now?: () => number;
```

Defined in: @gramota/verifier/dist/types.d.ts:70

Override "now" — used for tests and time-frozen environments. Returns
Unix seconds. Default: `Math.floor(Date.now() / 1000)`.

###### Returns

`number`

##### requireStatus?

```ts
optional requireStatus?: boolean;
```

Defined in: @gramota/verifier/dist/types.d.ts:82

Status-check policy for THIS verification.

- When `false`/omitted, the configured `statusResolver` (if any)
  is still consulted; "skipped" is acceptable.
- When `true`, a credential with no resolvable status fails the
  "status.check" gate. Useful for high-assurance flows where
  non-revocable credentials are unacceptable.

Has no effect when no `statusResolver` is configured on the Verifier.

##### require?

```ts
optional require?: (input: RequireInput<TClaims>) => 
  | boolean
  | RequireResult
| Promise<boolean | RequireResult>;
```

Defined in: @gramota/verifier/dist/types.d.ts:109

Application-level predicate. Runs AFTER all crypto + status checks
pass; receives the disclosed claims + protocol metadata; returns
a boolean (or `{ passed, reason }` for a custom failure reason).

If the predicate returns `false` (or `{ passed: false }`), the
verification fails with `failedCheck: "require.predicate"` and the
predicate's `reason` (or a default) becomes `result.reason`. The
`require.predicate` entry is appended to `result.checks` either
way, so audit dashboards see the same shape as for any other check.

If the predicate throws, the throw propagates — the verifier does
NOT silently treat exceptions as "passed: false". This is so
caller bugs surface as crashes during dev, not as accepted
presentations in production.

###### Parameters

###### input

[`RequireInput`](#requireinput)\<`TClaims`\>

###### Returns

  \| `boolean`
  \| [`RequireResult`](#requireresult)
  \| `Promise`\<`boolean` \| [`RequireResult`](#requireresult)\>

###### Example

```ts
await verifier.verify(token, {
  nonce,
  require: ({ claims }) =>
    claims.age_over_18 === true &&
    EU_COUNTRIES.has(claims.nationality as string),
});
```

***

### SecurityCheck

Defined in: @gramota/verifier/dist/types.d.ts:114

A single security check, recorded for observability. Every check is
present in the result regardless of pass/fail, so customers can build
audit dashboards.

#### Properties

##### name

```ts
name: SecurityCheckName;
```

Defined in: @gramota/verifier/dist/types.d.ts:116

Stable identifier — useful for logs and dashboards.

##### passed

```ts
passed: boolean;
```

Defined in: @gramota/verifier/dist/types.d.ts:117

##### message?

```ts
optional message?: string;
```

Defined in: @gramota/verifier/dist/types.d.ts:119

Human-readable detail when the check fails.

***

### VerificationMetadata

Defined in: @gramota/verifier/dist/types.d.ts:129

Protocol metadata extracted alongside the user-facing claims.

#### Properties

##### issuer

```ts
issuer: string;
```

Defined in: @gramota/verifier/dist/types.d.ts:130

##### audience

```ts
audience: string;
```

Defined in: @gramota/verifier/dist/types.d.ts:131

##### issuedAt

```ts
issuedAt: number;
```

Defined in: @gramota/verifier/dist/types.d.ts:132

##### expiresAt

```ts
expiresAt: number;
```

Defined in: @gramota/verifier/dist/types.d.ts:133

##### holderKey

```ts
holderKey: Readonly<Record<string, unknown>>;
```

Defined in: @gramota/verifier/dist/types.d.ts:137

The holder's bound public JWK from cnf.jwk in the parent SD-JWT. After
verification this is guaranteed to be a well-formed JWK that successfully
verified the KB-JWT signature.

***

### SuccessResult

Defined in: @gramota/verifier/dist/types.d.ts:140

#### Type Parameters

##### TClaims

`TClaims` = `Record`\<`string`, `unknown`\>

#### Properties

##### ok

```ts
ok: true;
```

Defined in: @gramota/verifier/dist/types.d.ts:141

##### claims

```ts
claims: TClaims;
```

Defined in: @gramota/verifier/dist/types.d.ts:144

The selectively-disclosed user claims with `_sd` / `_sd_alg` / `cnf`
stripped — this is what the application actually consumes.

##### metadata

```ts
metadata: VerificationMetadata;
```

Defined in: @gramota/verifier/dist/types.d.ts:146

Protocol-level metadata that's not part of the user claims.

##### checks

```ts
checks: readonly SecurityCheck[];
```

Defined in: @gramota/verifier/dist/types.d.ts:148

Every check we ran, all passed. Useful for audit trails.

##### status?

```ts
optional status?: CredentialStatusResult | "skipped";
```

Defined in: @gramota/verifier/dist/types.d.ts:152

When `options.status` was supplied, the resolved status (or
"skipped" if the credential carried no status reference). Absent
when status checking wasn't requested.

#### Methods

##### unwrap()

```ts
unwrap(): TClaims;
```

Defined in: @gramota/verifier/dist/types.d.ts:154

Returns claims; never throws on success.

###### Returns

`TClaims`

***

### FailureResult

Defined in: @gramota/verifier/dist/types.d.ts:156

#### Properties

##### ok

```ts
ok: false;
```

Defined in: @gramota/verifier/dist/types.d.ts:157

##### reason

```ts
reason: string;
```

Defined in: @gramota/verifier/dist/types.d.ts:159

Human-readable reason — surfaces the message from the failed check.

##### failedCheck

```ts
failedCheck: SecurityCheckName;
```

Defined in: @gramota/verifier/dist/types.d.ts:161

Stable identifier of the first check that failed.

##### checks

```ts
checks: readonly SecurityCheck[];
```

Defined in: @gramota/verifier/dist/types.d.ts:163

Every check up to and including the one that failed.

#### Methods

##### unwrap()

```ts
unwrap(): never;
```

Defined in: @gramota/verifier/dist/types.d.ts:165

Throws `VerifierError` carrying this result.

###### Returns

`never`

***

### PresentationRequestOptions

Defined in: @gramota/verifier/dist/verifier.d.ts:56

Options for `verifier.request()`.

#### Properties

##### baseUrl

```ts
baseUrl: string;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:58

Base URL or scheme: `openid4vp://authorize`, `https://wallet.example.com/...`

##### nonce

```ts
nonce: string;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:60

OID4VP nonce.

##### state?

```ts
optional state?: string;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:62

Optional opaque CSRF state echoed back unchanged in the response.

##### responseUri?

```ts
optional responseUri?: string;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:64

`direct_post` callback URL (required when response_mode=direct_post).

##### presentationDefinition?

```ts
optional presentationDefinition?: Readonly<Record<string, unknown>>;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:66

Inline DIF Presentation Definition.

##### presentationDefinitionUri?

```ts
optional presentationDefinitionUri?: string;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:68

Or a URL the wallet can fetch the PD from. Mutually exclusive with above.

##### responseMode?

```ts
optional responseMode?: "direct_post" | "direct_post.jwt" | "fragment" | "query";
```

Defined in: @gramota/verifier/dist/verifier.d.ts:71

Override response_mode (default: direct_post when responseUri is set,
otherwise undefined).

##### clientIdScheme?

```ts
optional clientIdScheme?: string;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:73

client_id_scheme (default: redirect_uri).

##### clientId?

```ts
optional clientId?: string;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:75

Override the client_id (defaults to the verifier's audience).

***

### PresentationRequest

Defined in: @gramota/verifier/dist/verifier.d.ts:78

Result of `verifier.request()`.

#### Properties

##### url

```ts
url: string;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:80

The full URL to share with the wallet (QR / deep link).

##### request

```ts
request: AuthorizationRequest;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:82

The structured AuthorizationRequest, useful for storage and logging.

##### nonce

```ts
nonce: string;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:84

Echoes the nonce so callers can persist it for later verification.

##### state

```ts
state: string;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:86

Echoes the state if one was supplied.

***

### VerifyResponseOptions

Defined in: @gramota/verifier/dist/verifier.d.ts:89

Options for `verifier.response()`.

#### Type Parameters

##### TClaims

`TClaims` = `Record`\<`string`, `unknown`\>

#### Properties

##### expectedNonce

```ts
expectedNonce: string;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:91

Required — the nonce used in the original request.

##### expectedState?

```ts
optional expectedState?: string;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:93

Optional — when supplied, response.state MUST equal this.

##### now?

```ts
optional now?: () => number;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:95

Override "now" — for tests.

###### Returns

`number`

##### requireStatus?

```ts
optional requireStatus?: boolean;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:99

Forwarded to `verify()` — fail when credential has no resolvable
status. Has effect only when the Verifier was constructed with a
`statusResolver`.

##### require?

```ts
optional require?: (input: RequireInput<TClaims>) => 
  | boolean
  | RequireResult
| Promise<boolean | RequireResult>;
```

Defined in: @gramota/verifier/dist/verifier.d.ts:102

Forwarded to `verify()` — application-level predicate that runs
after all crypto + status checks pass. See [VerifyOptions.require](#require).

###### Parameters

###### input

[`RequireInput`](#requireinput)\<`TClaims`\>

###### Returns

  \| `boolean`
  \| [`RequireResult`](#requireresult)
  \| `Promise`\<`boolean` \| [`RequireResult`](#requireresult)\>

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
  | "status.check"
  | "require.predicate";
```

Defined in: @gramota/verifier/dist/types.d.ts:122

Stable identifiers for the security checks we run, in execution order.

***

### VerifyResult

```ts
type VerifyResult<TClaims> = 
  | SuccessResult<TClaims>
  | FailureResult;
```

Defined in: @gramota/verifier/dist/types.d.ts:139

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

Defined in: @gramota/verifier/dist/verifier.d.ts:52

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
