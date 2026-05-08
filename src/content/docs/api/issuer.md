---
title: "@gramota/issuer"
slug: api/issuer
description: "Issuer for SD-JWT-VC, with single + batch issuance for one-time-use credential pools."
section: API reference
order: 2
---

# @gramota/issuer

> Issuer for SD-JWT-VC, with single + batch issuance for one-time-use credential pools.

Install: `pnpm add @gramota/issuer`

Source: [github.com/gramota-org/gramota/tree/main/packages/issuer](https://github.com/gramota-org/gramota/tree/main/packages/issuer)

## Classes

### Issuer

Defined in: @gramota/issuer/dist/issuer.d.ts:33

The issuer role per IETF SD-JWT-VC §3.

Wraps `issueSdJwt` (the low-level primitive in `@gramota/sd-jwt`) with:
  - stateful config (signer, issuer id, optional kid/typ/hashAlg),
  - holder-binding (cnf.jwk),
  - sensible expiry handling (`expiresIn` or `expiresAt`),
  - validation: every claim listed in `selectivelyDisclosable` must
    appear in `subject`,
  - Signer Strategy for signing — accepts raw JWKs (shorthand)
    or production-grade Signers (HSM, KMS, custom backends).

Two API shapes resolve to the same code path:
  - `issuer.credentials.issue(...)` — Stripe-style namespacing,
    symmetric with `holder.credentials.*` and forward-compatible
    with future operations (revoke, suspend, list).
  - `issuer.issue(...)` — flat shorthand for the common case.

#### Constructors

##### Constructor

```ts
new Issuer(config: IssuerConfig): Issuer;
```

Defined in: @gramota/issuer/dist/issuer.d.ts:45

###### Parameters

###### config

[`IssuerConfig`](#issuerconfig)

###### Returns

[`Issuer`](#issuer)

#### Properties

##### credentials

```ts
readonly credentials: IssuerCredentialsApi;
```

Defined in: @gramota/issuer/dist/issuer.d.ts:44

Credential operations. `issuer.credentials.{issue,issueBatch}(...)`.
Mirrors `holder.credentials.*` for stylistic symmetry across the SDK.

#### Accessors

##### publicKey

###### Get Signature

```ts
get publicKey(): JsonWebKey;
```

Defined in: @gramota/issuer/dist/issuer.d.ts:67

The issuer's public JWK — useful to publish at /.well-known/jwks.json.

###### Returns

`JsonWebKey`

##### issuerId

###### Get Signature

```ts
get issuerId(): string;
```

Defined in: @gramota/issuer/dist/issuer.d.ts:69

The issuer's identifier — useful for downstream URLs.

###### Returns

`string`

#### Methods

##### issue()

```ts
issue(options: IssueOptions): Promise<IssueResult>;
```

Defined in: @gramota/issuer/dist/issuer.d.ts:50

Issue a single SD-JWT-VC credential bound to a holder.

Equivalent to `issuer.credentials.issue(options)`. Both shapes are
stable; pick whichever reads better at the call site.

###### Parameters

###### options

[`IssueOptions`](#issueoptions)

###### Returns

`Promise`\<[`IssueResult`](#issueresult)\>

##### issueBatch()

```ts
issueBatch(options: BatchIssueOptions): Promise<readonly IssueResult[]>;
```

Defined in: @gramota/issuer/dist/issuer.d.ts:63

Issue N credentials in a batch — OID4VCI Draft 14/15 batch flow.

Equivalent to `issuer.credentials.issueBatch(options)`. Each entry in
`options.credentials` produces one independent credential bound to
that entry's `holderKey`, with fresh disclosure salts (so two
credentials over the same claims are unlinkable on the wire) and a
distinct credentialId. Shared options (subject, vct, expiry, …)
apply to every credential.

The EU reference wallet uses this to mint pools of one-time-use
credentials so each presentation reveals a fresh token rather than
a long-lived one.

###### Parameters

###### options

[`BatchIssueOptions`](#batchissueoptions)

###### Returns

`Promise`\<readonly [`IssueResult`](#issueresult)[]\>

***

### IssuerError

Defined in: @gramota/issuer/dist/types.d.ts:127

#### Extends

- `GramotaError`

#### Constructors

##### Constructor

```ts
new IssuerError(
   code: IssuerErrorCode, 
   message: string, 
   options?: {
  cause?: unknown;
}): IssuerError;
```

Defined in: @gramota/issuer/dist/types.d.ts:129

###### Parameters

###### code

[`IssuerErrorCode`](#issuererrorcode)

###### message

`string`

###### options?

###### cause?

`unknown`

###### Returns

[`IssuerError`](#issuererror)

###### Overrides

```ts
GramotaError.constructor
```

#### Properties

##### cause?

```ts
readonly optional cause?: unknown;
```

Defined in: .pnpm/@gramota+core@0.2.0/node\_modules/@gramota/core/dist/error.d.ts:44

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
readonly code: IssuerErrorCode;
```

Defined in: @gramota/issuer/dist/types.d.ts:128

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

### IssuerCredentialsApi

Defined in: @gramota/issuer/dist/issuer.d.ts:5

Stripe-style sub-API for credential operations.
 `issuer.credentials.X(...)`.

#### Methods

##### issue()

```ts
issue(options: IssueOptions): Promise<IssueResult>;
```

Defined in: @gramota/issuer/dist/issuer.d.ts:7

Issue a single SD-JWT-VC credential bound to a holder.

###### Parameters

###### options

[`IssueOptions`](#issueoptions)

###### Returns

`Promise`\<[`IssueResult`](#issueresult)\>

##### issueBatch()

```ts
issueBatch(options: BatchIssueOptions): Promise<readonly IssueResult[]>;
```

Defined in: @gramota/issuer/dist/issuer.d.ts:13

Issue N credentials in a batch, one per holder-key entry — the
OID4VCI Draft 14/15 batch flow. The EU reference wallet asks for
`numberOfCredentials = 10` so it can use a fresh credential per
presentation (one-time use, unlinkable). Each entry gets its own
`cnf.jwk`, fresh disclosure salts, and a distinct credentialId.

###### Parameters

###### options

[`BatchIssueOptions`](#batchissueoptions)

###### Returns

`Promise`\<readonly [`IssueResult`](#issueresult)[]\>

***

### IssueOptions

Defined in: @gramota/issuer/dist/types.d.ts:37

#### Properties

##### subject

```ts
subject: Readonly<Record<string, unknown>>;
```

Defined in: @gramota/issuer/dist/types.d.ts:41

All claims that will go into the credential. Top-level keys become
either selectively-disclosable disclosures or directly-visible payload
claims, controlled by `selectivelyDisclosable`.

##### selectivelyDisclosable?

```ts
optional selectivelyDisclosable?: readonly string[];
```

Defined in: @gramota/issuer/dist/types.d.ts:44

Names of `subject` keys to make selectively disclosable. Names that
don't appear in `subject` cause an error. Default: empty (no SD).

##### holderKey

```ts
holderKey: JsonWebKey;
```

Defined in: @gramota/issuer/dist/types.d.ts:47

Holder's PUBLIC JWK — bound into `cnf.jwk`. Required by SD-JWT-VC for
holder-binding (the security model collapses without it).

##### vct

```ts
vct: string;
```

Defined in: @gramota/issuer/dist/types.d.ts:51

SD-JWT-VC credential type identifier — required by the spec. Customers
who really know what they're doing can pass an empty string to skip,
but the default behaviour rejects missing `vct`.

##### expiresIn?

```ts
optional expiresIn?: number;
```

Defined in: @gramota/issuer/dist/types.d.ts:54

Seconds-until-expiry, relative to `issuedAt`. Mutually exclusive with
`expiresAt`.

##### expiresAt?

```ts
optional expiresAt?: number;
```

Defined in: @gramota/issuer/dist/types.d.ts:56

Absolute expiry as Unix seconds. Mutually exclusive with `expiresIn`.

##### notBefore?

```ts
optional notBefore?: number;
```

Defined in: @gramota/issuer/dist/types.d.ts:58

Optional `nbf` (not-before) claim.

##### issuedAt?

```ts
optional issuedAt?: number;
```

Defined in: @gramota/issuer/dist/types.d.ts:60

Override `iat` — defaults to `floor(Date.now()/1000)` at call time.

##### status?

```ts
optional status?: Readonly<Record<string, unknown>>;
```

Defined in: @gramota/issuer/dist/types.d.ts:62

Optional `status` claim for revocation tracking (Token Status List).

##### credentialId?

```ts
optional credentialId?: string;
```

Defined in: @gramota/issuer/dist/types.d.ts:64

Override the generated credential ID (default: random UUID v4).

***

### IssueResult

Defined in: @gramota/issuer/dist/types.d.ts:67

Result of `issuer.issue()`.

#### Properties

##### token

```ts
token: string;
```

Defined in: @gramota/issuer/dist/types.d.ts:69

The compact-serialised SD-JWT-VC token to send to the holder.

##### credentialId

```ts
credentialId: string;
```

Defined in: @gramota/issuer/dist/types.d.ts:71

Issuer-side identifier for tracking.

##### disclosures

```ts
disclosures: readonly SdJwtDisclosure[];
```

Defined in: @gramota/issuer/dist/types.d.ts:73

Disclosure objects — useful for the issuer's own records / audit logs.

##### expiresAt

```ts
expiresAt: number;
```

Defined in: @gramota/issuer/dist/types.d.ts:75

Computed expiry (if `expiresIn` or `expiresAt` was set).

***

### BatchIssueEntry

Defined in: @gramota/issuer/dist/types.d.ts:82

Per-credential binding for `issueBatch`. Everything that varies *across*
credentials in the batch goes here; everything shared (subject, vct,
expiry, …) sits at the top level of [BatchIssueOptions](#batchissueoptions).

#### Properties

##### holderKey

```ts
holderKey: JsonWebKey;
```

Defined in: @gramota/issuer/dist/types.d.ts:85

Holder's PUBLIC JWK — bound into this credential's `cnf.jwk`. Each
entry must have a distinct holder key for one-time-use unlinkability.

##### credentialId?

```ts
optional credentialId?: string;
```

Defined in: @gramota/issuer/dist/types.d.ts:87

Override the generated credential ID (default: random UUID v4 per entry).

##### status?

```ts
optional status?: Readonly<Record<string, unknown>>;
```

Defined in: @gramota/issuer/dist/types.d.ts:91

Per-credential `status` claim — typical use is to allocate a distinct
Token Status List index for each one-time credential so they can be
revoked independently.

***

### BatchIssueOptions

Defined in: @gramota/issuer/dist/types.d.ts:102

Options for `issuer.issueBatch()` (OID4VCI Draft 14/15 batch issuance).

Shared across the batch: subject, vct, expiry, notBefore, issuedAt,
selectivelyDisclosable.

Per-credential: `credentials[i]` (holderKey, optional credentialId,
optional status).

#### Properties

##### subject

```ts
subject: Readonly<Record<string, unknown>>;
```

Defined in: @gramota/issuer/dist/types.d.ts:105

Claims shared by every credential in the batch. Same semantics as
[IssueOptions.subject](#subject).

##### vct

```ts
vct: string;
```

Defined in: @gramota/issuer/dist/types.d.ts:107

SD-JWT-VC type identifier — shared across the batch.

##### selectivelyDisclosable?

```ts
optional selectivelyDisclosable?: readonly string[];
```

Defined in: @gramota/issuer/dist/types.d.ts:112

Names of `subject` keys to make selectively disclosable. Validated
once against `subject`; applies to every credential. Each credential
gets fresh random salts (so two credentials over the same data are
unlinkable on the wire).

##### expiresIn?

```ts
optional expiresIn?: number;
```

Defined in: @gramota/issuer/dist/types.d.ts:114

Shared `expiresIn`. Mutually exclusive with `expiresAt`.

##### expiresAt?

```ts
optional expiresAt?: number;
```

Defined in: @gramota/issuer/dist/types.d.ts:116

Shared absolute `expiresAt`. Mutually exclusive with `expiresIn`.

##### notBefore?

```ts
optional notBefore?: number;
```

Defined in: @gramota/issuer/dist/types.d.ts:118

Shared `nbf`.

##### issuedAt?

```ts
optional issuedAt?: number;
```

Defined in: @gramota/issuer/dist/types.d.ts:121

Shared `iat`. Defaults to `floor(Date.now()/1000)` evaluated *once*
for the whole batch (so every credential reports the same iat).

##### credentials

```ts
credentials: readonly BatchIssueEntry[];
```

Defined in: @gramota/issuer/dist/types.d.ts:123

One entry per credential to issue. Length ≥ 1.

## Type Aliases

### IssuerConfig

```ts
type IssuerConfig = IssuerSignerInput & {
  issuerId: string;
  hashAlg?: HashAlg;
  kid?: string;
  typ?: string;
};
```

Defined in: @gramota/issuer/dist/types.d.ts:27

Configuration for an Issuer instance — set once, used per `issue()`.

#### Type Declaration

##### issuerId

```ts
issuerId: string;
```

Issuer identifier (a stable URL). Becomes the `iss` claim.

##### hashAlg?

```ts
optional hashAlg?: HashAlg;
```

Hash algorithm for selective-disclosure digests. Default `sha-256`.

##### kid?

```ts
optional kid?: string;
```

JOSE `kid` header to set on every issued credential. Optional.

##### typ?

```ts
optional typ?: string;
```

JOSE `typ` header. Default `vc+sd-jwt` (per SD-JWT-VC spec).

***

### IssuerErrorCode

```ts
type IssuerErrorCode = 
  | "issuer.subject_invalid"
  | "issuer.holder_key_required"
  | "issuer.vct_required"
  | "issuer.expiry_conflict"
  | "issuer.expiry_invalid"
  | "issuer.disclosable_missing"
  | "issuer.reserved_claim_in_subject"
  | "issuer.batch_empty";
```

Defined in: @gramota/issuer/dist/types.d.ts:126

Stable codes for `IssuerError`.
