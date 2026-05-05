---
title: "@gramota/issuer"
slug: api/issuer
description: "Issuer for SD-JWT-VC, with single + batch issuance for one-time-use credential pools."
section: API reference
order: 2
---

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

Defined in: @gramota/issuer/dist/types.d.ts:126

#### Extends

- `Error`

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
Error.constructor
```

#### Properties

##### name

```ts
readonly name: "IssuerError" = "IssuerError";
```

Defined in: @gramota/issuer/dist/types.d.ts:127

###### Overrides

```ts
Error.name
```

##### code

```ts
readonly code: IssuerErrorCode;
```

Defined in: @gramota/issuer/dist/types.d.ts:128

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

Defined in: @gramota/issuer/dist/types.d.ts:36

#### Properties

##### subject

```ts
subject: Readonly<Record<string, unknown>>;
```

Defined in: @gramota/issuer/dist/types.d.ts:40

All claims that will go into the credential. Top-level keys become
either selectively-disclosable disclosures or directly-visible payload
claims, controlled by `selectivelyDisclosable`.

##### selectivelyDisclosable?

```ts
optional selectivelyDisclosable?: readonly string[];
```

Defined in: @gramota/issuer/dist/types.d.ts:43

Names of `subject` keys to make selectively disclosable. Names that
don't appear in `subject` cause an error. Default: empty (no SD).

##### holderKey

```ts
holderKey: JsonWebKey;
```

Defined in: @gramota/issuer/dist/types.d.ts:46

Holder's PUBLIC JWK — bound into `cnf.jwk`. Required by SD-JWT-VC for
holder-binding (the security model collapses without it).

##### vct

```ts
vct: string;
```

Defined in: @gramota/issuer/dist/types.d.ts:50

SD-JWT-VC credential type identifier — required by the spec. Customers
who really know what they're doing can pass an empty string to skip,
but the default behaviour rejects missing `vct`.

##### expiresIn?

```ts
optional expiresIn?: number;
```

Defined in: @gramota/issuer/dist/types.d.ts:53

Seconds-until-expiry, relative to `issuedAt`. Mutually exclusive with
`expiresAt`.

##### expiresAt?

```ts
optional expiresAt?: number;
```

Defined in: @gramota/issuer/dist/types.d.ts:55

Absolute expiry as Unix seconds. Mutually exclusive with `expiresIn`.

##### notBefore?

```ts
optional notBefore?: number;
```

Defined in: @gramota/issuer/dist/types.d.ts:57

Optional `nbf` (not-before) claim.

##### issuedAt?

```ts
optional issuedAt?: number;
```

Defined in: @gramota/issuer/dist/types.d.ts:59

Override `iat` — defaults to `floor(Date.now()/1000)` at call time.

##### status?

```ts
optional status?: Readonly<Record<string, unknown>>;
```

Defined in: @gramota/issuer/dist/types.d.ts:61

Optional `status` claim for revocation tracking (Token Status List).

##### credentialId?

```ts
optional credentialId?: string;
```

Defined in: @gramota/issuer/dist/types.d.ts:63

Override the generated credential ID (default: random UUID v4).

***

### IssueResult

Defined in: @gramota/issuer/dist/types.d.ts:66

Result of `issuer.issue()`.

#### Properties

##### token

```ts
token: string;
```

Defined in: @gramota/issuer/dist/types.d.ts:68

The compact-serialised SD-JWT-VC token to send to the holder.

##### credentialId

```ts
credentialId: string;
```

Defined in: @gramota/issuer/dist/types.d.ts:70

Issuer-side identifier for tracking.

##### disclosures

```ts
disclosures: readonly SdJwtDisclosure[];
```

Defined in: @gramota/issuer/dist/types.d.ts:72

Disclosure objects — useful for the issuer's own records / audit logs.

##### expiresAt

```ts
expiresAt: number;
```

Defined in: @gramota/issuer/dist/types.d.ts:74

Computed expiry (if `expiresIn` or `expiresAt` was set).

***

### BatchIssueEntry

Defined in: @gramota/issuer/dist/types.d.ts:81

Per-credential binding for `issueBatch`. Everything that varies *across*
credentials in the batch goes here; everything shared (subject, vct,
expiry, …) sits at the top level of [BatchIssueOptions](#batchissueoptions).

#### Properties

##### holderKey

```ts
holderKey: JsonWebKey;
```

Defined in: @gramota/issuer/dist/types.d.ts:84

Holder's PUBLIC JWK — bound into this credential's `cnf.jwk`. Each
entry must have a distinct holder key for one-time-use unlinkability.

##### credentialId?

```ts
optional credentialId?: string;
```

Defined in: @gramota/issuer/dist/types.d.ts:86

Override the generated credential ID (default: random UUID v4 per entry).

##### status?

```ts
optional status?: Readonly<Record<string, unknown>>;
```

Defined in: @gramota/issuer/dist/types.d.ts:90

Per-credential `status` claim — typical use is to allocate a distinct
Token Status List index for each one-time credential so they can be
revoked independently.

***

### BatchIssueOptions

Defined in: @gramota/issuer/dist/types.d.ts:101

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

Defined in: @gramota/issuer/dist/types.d.ts:104

Claims shared by every credential in the batch. Same semantics as
[IssueOptions.subject](#subject).

##### vct

```ts
vct: string;
```

Defined in: @gramota/issuer/dist/types.d.ts:106

SD-JWT-VC type identifier — shared across the batch.

##### selectivelyDisclosable?

```ts
optional selectivelyDisclosable?: readonly string[];
```

Defined in: @gramota/issuer/dist/types.d.ts:111

Names of `subject` keys to make selectively disclosable. Validated
once against `subject`; applies to every credential. Each credential
gets fresh random salts (so two credentials over the same data are
unlinkable on the wire).

##### expiresIn?

```ts
optional expiresIn?: number;
```

Defined in: @gramota/issuer/dist/types.d.ts:113

Shared `expiresIn`. Mutually exclusive with `expiresAt`.

##### expiresAt?

```ts
optional expiresAt?: number;
```

Defined in: @gramota/issuer/dist/types.d.ts:115

Shared absolute `expiresAt`. Mutually exclusive with `expiresIn`.

##### notBefore?

```ts
optional notBefore?: number;
```

Defined in: @gramota/issuer/dist/types.d.ts:117

Shared `nbf`.

##### issuedAt?

```ts
optional issuedAt?: number;
```

Defined in: @gramota/issuer/dist/types.d.ts:120

Shared `iat`. Defaults to `floor(Date.now()/1000)` evaluated *once*
for the whole batch (so every credential reports the same iat).

##### credentials

```ts
credentials: readonly BatchIssueEntry[];
```

Defined in: @gramota/issuer/dist/types.d.ts:122

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

Defined in: @gramota/issuer/dist/types.d.ts:26

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

Defined in: @gramota/issuer/dist/types.d.ts:125

Stable codes for `IssuerError`.
