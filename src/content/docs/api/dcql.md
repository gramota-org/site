---
title: "@gramota/dcql"
slug: api/dcql
description: "Digital Credentials Query Language — OID4VP 2.0 query format."
section: API reference
order: 8
---

# @gramota/dcql

> Digital Credentials Query Language — OID4VP 2.0 query format.

Install: `pnpm add @gramota/dcql`

Source: [github.com/gramota-org/gramota/tree/main/packages/dcql](https://github.com/gramota-org/gramota/tree/main/packages/dcql)

## Classes

### DcqlSdJwtVcMatcher

Defined in: @gramota/dcql/dist/sd-jwt-vc-matcher.d.ts:30

Match an SD-JWT-VC credential against a DCQL credential query.

Returns `null` if the credential cannot satisfy the query.

Match rules (v1):
  - format must be "vc+sd-jwt" or "dc+sd-jwt"
  - meta.vct_values (if present) — credential's `vct` claim must be in the list
  - every claim in `claims[]` must be available either as a disclosure
    (single-segment path) or directly in the JWT payload (multi-segment)
  - claim values, when specified via `values: [...]`, must equal one of them

#### Constructors

##### Constructor

```ts
new DcqlSdJwtVcMatcher(): DcqlSdJwtVcMatcher;
```

###### Returns

[`DcqlSdJwtVcMatcher`](#dcqlsdjwtvcmatcher)

#### Accessors

##### formats

###### Get Signature

```ts
get formats(): readonly string[];
```

Defined in: @gramota/dcql/dist/sd-jwt-vc-matcher.d.ts:33

Format identifiers this matcher handles.

###### Returns

readonly `string`[]

#### Methods

##### match()

```ts
match(credential: SdJwtVcCredentialView, query: DcqlCredentialQuery): DcqlMatchResult;
```

Defined in: @gramota/dcql/dist/sd-jwt-vc-matcher.d.ts:31

###### Parameters

###### credential

[`SdJwtVcCredentialView`](#sdjwtvccredentialview)

###### query

[`DcqlCredentialQuery`](#dcqlcredentialquery)

###### Returns

[`DcqlMatchResult`](#dcqlmatchresult)

***

### DcqlError

Defined in: @gramota/dcql/dist/types.d.ts:51

#### Extends

- `GramotaError`

#### Constructors

##### Constructor

```ts
new DcqlError(
   code: DcqlErrorCode, 
   message: string, 
   options?: {
  cause?: unknown;
}): DcqlError;
```

Defined in: @gramota/dcql/dist/types.d.ts:53

###### Parameters

###### code

[`DcqlErrorCode`](#dcqlerrorcode)

###### message

`string`

###### options?

###### cause?

`unknown`

###### Returns

[`DcqlError`](#dcqlerror)

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
readonly code: DcqlErrorCode;
```

Defined in: @gramota/dcql/dist/types.d.ts:52

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

### SdJwtVcCredentialView

Defined in: @gramota/dcql/dist/sd-jwt-vc-matcher.d.ts:5

A holder-side credential view the matcher consumes. Decoupled from
`@gramota/holder`'s StoredCredential for testability.

#### Properties

##### parsed

```ts
parsed: ParsedSdJwt;
```

Defined in: @gramota/dcql/dist/sd-jwt-vc-matcher.d.ts:6

***

### DcqlMatchResult

Defined in: @gramota/dcql/dist/sd-jwt-vc-matcher.d.ts:10

#### Properties

##### disclose

```ts
disclose: readonly string[];
```

Defined in: @gramota/dcql/dist/sd-jwt-vc-matcher.d.ts:12

Names of selectively-disclosable claims required to satisfy the query.

##### satisfiedClaims

```ts
satisfiedClaims: readonly {
  id: string;
  path: readonly (string | number)[];
}[];
```

Defined in: @gramota/dcql/dist/sd-jwt-vc-matcher.d.ts:14

Per-claim detail for audit.

***

### DcqlMatcher

Defined in: @gramota/dcql/dist/select.d.ts:3

#### Type Parameters

##### TCredential

`TCredential`

#### Properties

##### formats

```ts
formats: readonly string[];
```

Defined in: @gramota/dcql/dist/select.d.ts:4

#### Methods

##### match()

```ts
match(credential: TCredential, query: DcqlCredentialQuery): DcqlMatchResult;
```

Defined in: @gramota/dcql/dist/select.d.ts:5

###### Parameters

###### credential

`TCredential`

###### query

[`DcqlCredentialQuery`](#dcqlcredentialquery)

###### Returns

[`DcqlMatchResult`](#dcqlmatchresult)

***

### DcqlSelectInput

Defined in: @gramota/dcql/dist/select.d.ts:7

#### Type Parameters

##### TCredential

`TCredential`

#### Properties

##### query

```ts
query: DcqlQuery;
```

Defined in: @gramota/dcql/dist/select.d.ts:8

##### credentials

```ts
credentials: readonly TCredential[];
```

Defined in: @gramota/dcql/dist/select.d.ts:9

##### matchers?

```ts
optional matchers?: readonly DcqlMatcher<TCredential>[];
```

Defined in: @gramota/dcql/dist/select.d.ts:11

Strategy: zero or more matchers, dispatched by format. Default: SD-JWT-VC.

##### pickCredential?

```ts
optional pickCredential?: (candidates: readonly {
  credential: TCredential;
  result: DcqlMatchResult;
}[]) => {
  credential: TCredential;
  result: DcqlMatchResult;
};
```

Defined in: @gramota/dcql/dist/select.d.ts:13

Picker when multiple credentials satisfy a query. Default: first match.

###### Parameters

###### candidates

readonly \{
  `credential`: `TCredential`;
  `result`: [`DcqlMatchResult`](#dcqlmatchresult);
\}[]

###### Returns

```ts
{
  credential: TCredential;
  result: DcqlMatchResult;
}
```

###### credential

```ts
credential: TCredential;
```

###### result

```ts
result: DcqlMatchResult;
```

***

### DcqlSelectionMatch

Defined in: @gramota/dcql/dist/select.d.ts:21

#### Type Parameters

##### TCredential

`TCredential`

#### Properties

##### query

```ts
query: DcqlCredentialQuery;
```

Defined in: @gramota/dcql/dist/select.d.ts:22

##### credential

```ts
credential: TCredential;
```

Defined in: @gramota/dcql/dist/select.d.ts:23

##### disclose

```ts
disclose: readonly string[];
```

Defined in: @gramota/dcql/dist/select.d.ts:24

##### result

```ts
result: DcqlMatchResult;
```

Defined in: @gramota/dcql/dist/select.d.ts:25

***

### DcqlSelectionFailure

Defined in: @gramota/dcql/dist/select.d.ts:27

#### Properties

##### query

```ts
query: DcqlCredentialQuery;
```

Defined in: @gramota/dcql/dist/select.d.ts:28

##### reason

```ts
reason: string;
```

Defined in: @gramota/dcql/dist/select.d.ts:29

***

### DcqlSelection

Defined in: @gramota/dcql/dist/select.d.ts:31

#### Type Parameters

##### TCredential

`TCredential`

#### Properties

##### matches

```ts
matches: readonly DcqlSelectionMatch<TCredential>[];
```

Defined in: @gramota/dcql/dist/select.d.ts:32

##### unmatched

```ts
unmatched: readonly DcqlSelectionFailure[];
```

Defined in: @gramota/dcql/dist/select.d.ts:33

##### fullySatisfied

```ts
fullySatisfied: boolean;
```

Defined in: @gramota/dcql/dist/select.d.ts:36

Whether every required credential_set is satisfied (or, when no sets
are present, every credentials[] entry is matched).

***

### DcqlQuery

Defined in: @gramota/dcql/dist/types.d.ts:10

DCQL — Digital Credentials Query Language (OID4VP 2.0).
Spec: OID4VP 2.0 §6 (DCQL).

The OID4VP 2.0 replacement for DIF Presentation Exchange v2 (which lives
in `@gramota/presentation-exchange`). Both query languages exist; pick
whichever your verifier or wallet ecosystem speaks.

#### Properties

##### credentials

```ts
credentials: readonly DcqlCredentialQuery[];
```

Defined in: @gramota/dcql/dist/types.d.ts:12

Credential queries the wallet must satisfy.

##### credential\_sets?

```ts
optional credential_sets?: readonly DcqlCredentialSet[];
```

Defined in: @gramota/dcql/dist/types.d.ts:15

Optional sets describing which combinations of credentials are
acceptable (OR/AND logic across credentials).

***

### DcqlCredentialQuery

Defined in: @gramota/dcql/dist/types.d.ts:17

#### Properties

##### id

```ts
id: string;
```

Defined in: @gramota/dcql/dist/types.d.ts:18

##### format

```ts
format: string;
```

Defined in: @gramota/dcql/dist/types.d.ts:20

Credential format: "vc+sd-jwt", "dc+sd-jwt", "mso_mdoc", "ldp_vc", …

##### meta?

```ts
optional meta?: Readonly<Record<string, unknown>>;
```

Defined in: @gramota/dcql/dist/types.d.ts:23

Format-specific filters. For SD-JWT-VC: `{ vct_values: string[] }`.
For mDoc: `{ doctype_value: string }`.

##### claims?

```ts
optional claims?: readonly DcqlClaimQuery[];
```

Defined in: @gramota/dcql/dist/types.d.ts:25

Claims the wallet must reveal.

##### claim\_sets?

```ts
optional claim_sets?: readonly readonly string[][];
```

Defined in: @gramota/dcql/dist/types.d.ts:27

Named groups of claims, when the verifier accepts alternate sets.

***

### DcqlClaimQuery

Defined in: @gramota/dcql/dist/types.d.ts:29

#### Properties

##### id?

```ts
optional id?: string;
```

Defined in: @gramota/dcql/dist/types.d.ts:31

Optional identifier for use in `claim_sets`.

##### path

```ts
path: readonly (string | number)[];
```

Defined in: @gramota/dcql/dist/types.d.ts:37

Path segments to the claim. Strings = property keys; numbers = array
indices; null = "any element of an array". E.g.
  ["family_name"]                            → top-level family_name
  ["address", "country"]                     → nested address.country
  ["eu.europa.ec.eudi.pid.1", "family_name"] → mDoc namespaced

##### values?

```ts
optional values?: readonly unknown[];
```

Defined in: @gramota/dcql/dist/types.d.ts:39

Optional value constraint — claim must equal one of these.

***

### DcqlCredentialSet

Defined in: @gramota/dcql/dist/types.d.ts:41

#### Properties

##### options

```ts
options: readonly readonly string[][];
```

Defined in: @gramota/dcql/dist/types.d.ts:44

Each option is a list of credential ids. The wallet picks one option
whose credentials it can all supply.

##### required?

```ts
optional required?: boolean;
```

Defined in: @gramota/dcql/dist/types.d.ts:46

When `false`, the verifier accepts the request without this set.

##### purpose?

```ts
optional purpose?: string;
```

Defined in: @gramota/dcql/dist/types.d.ts:47

## Type Aliases

### DcqlPathSegment

```ts
type DcqlPathSegment = string | number | null;
```

Defined in: @gramota/dcql/dist/path.d.ts:15

DCQL path evaluator.

Per OID4VP 2.0 DCQL §6.4, claim paths are arrays of segments:
  - string  → property key
  - number  → array index
  - null    → wildcard (any element of an array)

Returns the matched value (single match) or undefined.

For SD-JWT-VC, "any element" matching is rare — most paths are single
property keys (top-level claims). Multi-value wildcard semantics
(returning the cross product of matches) are deferred to v2.

***

### DcqlErrorCode

```ts
type DcqlErrorCode = 
  | "dcql.invalid_query"
  | "dcql.invalid_path"
  | "dcql.unsatisfiable"
  | "dcql.format_unsupported";
```

Defined in: @gramota/dcql/dist/types.d.ts:50

Stable codes for `DcqlError`.

## Variables

### SD\_JWT\_VC\_FORMAT

```ts
const SD_JWT_VC_FORMAT: "vc+sd-jwt" = "vc+sd-jwt";
```

Defined in: @gramota/dcql/dist/sd-jwt-vc-matcher.d.ts:8

***

### DC\_SD\_JWT\_VC\_FORMAT

```ts
const DC_SD_JWT_VC_FORMAT: "dc+sd-jwt" = "dc+sd-jwt";
```

Defined in: @gramota/dcql/dist/sd-jwt-vc-matcher.d.ts:9

## Functions

### evaluateDcqlPath()

```ts
function evaluateDcqlPath(path: readonly DcqlPathSegment[], root: unknown): unknown;
```

Defined in: @gramota/dcql/dist/path.d.ts:17

Evaluate a DCQL path against a value.

#### Parameters

##### path

readonly [`DcqlPathSegment`](#dcqlpathsegment)[]

##### root

`unknown`

#### Returns

`unknown`

***

### validateDcqlPath()

```ts
function validateDcqlPath(path: unknown): void;
```

Defined in: @gramota/dcql/dist/path.d.ts:19

Validate a DCQL path is well-formed. Throws on invalid input.

#### Parameters

##### path

`unknown`

#### Returns

`void`

***

### leafPropertyName()

```ts
function leafPropertyName(path: readonly DcqlPathSegment[]): string;
```

Defined in: @gramota/dcql/dist/path.d.ts:22

When the path is a single string segment, return that string —
the most common SD-JWT-VC case (top-level disclosure name).

#### Parameters

##### path

readonly [`DcqlPathSegment`](#dcqlpathsegment)[]

#### Returns

`string`

***

### selectForDcql()

```ts
function selectForDcql<TCredential>(input: DcqlSelectInput<TCredential>): DcqlSelection<TCredential>;
```

Defined in: @gramota/dcql/dist/select.d.ts:39

Run a DCQL query against the holder's credentials.

#### Type Parameters

##### TCredential

`TCredential`

#### Parameters

##### input

[`DcqlSelectInput`](#dcqlselectinput)\<`TCredential`\>

#### Returns

[`DcqlSelection`](#dcqlselection)\<`TCredential`\>
