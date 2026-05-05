---
title: "@gramota/presentation-exchange"
slug: api/presentation-exchange
description: "DIF Presentation Exchange v2 — legacy OID4VP 1.0 query format."
section: API reference
order: 6
---

> DIF Presentation Exchange v2 — legacy OID4VP 1.0 query format.

Install: `pnpm add @gramota/presentation-exchange`

Source: [github.com/gramota-org/gramota/tree/main/packages/presentation-exchange](https://github.com/gramota-org/gramota/tree/main/packages/presentation-exchange)

## Classes

### SdJwtVcMatcher

Defined in: @gramota/presentation-exchange/dist/sd-jwt-vc-matcher.d.ts:12

Match SD-JWT-VC credentials against a Presentation Definition descriptor.

#### Implements

- [`CredentialMatcher`](#credentialmatcher)\<[`SdJwtVcCredentialView`](#sdjwtvccredentialview)\>

#### Constructors

##### Constructor

```ts
new SdJwtVcMatcher(): SdJwtVcMatcher;
```

###### Returns

[`SdJwtVcMatcher`](#sdjwtvcmatcher)

#### Properties

##### format

```ts
readonly format: "vc+sd-jwt" = "vc+sd-jwt";
```

Defined in: @gramota/presentation-exchange/dist/sd-jwt-vc-matcher.d.ts:13

Stable format identifier (e.g. "vc+sd-jwt").

###### Implementation of

[`CredentialMatcher`](#credentialmatcher).[`format`](#format)

#### Methods

##### appliesTo()

```ts
appliesTo(descriptor: InputDescriptor): boolean;
```

Defined in: @gramota/presentation-exchange/dist/sd-jwt-vc-matcher.d.ts:14

Decide whether the descriptor's format/alg constraints apply to this
credential type.

###### Parameters

###### descriptor

[`InputDescriptor`](#inputdescriptor)

###### Returns

`boolean`

###### Implementation of

[`CredentialMatcher`](#credentialmatcher).[`appliesTo`](#appliesto)

##### match()

```ts
match(credential: SdJwtVcCredentialView, descriptor: InputDescriptor): MatchResult;
```

Defined in: @gramota/presentation-exchange/dist/sd-jwt-vc-matcher.d.ts:15

Evaluate the credential against the descriptor. Returns the disclosure
names this descriptor would require, or `null` if no match.

###### Parameters

###### credential

[`SdJwtVcCredentialView`](#sdjwtvccredentialview)

###### descriptor

[`InputDescriptor`](#inputdescriptor)

###### Returns

[`MatchResult`](#matchresult)

###### Implementation of

[`CredentialMatcher`](#credentialmatcher).[`match`](#match)

***

### PresentationExchangeError

Defined in: @gramota/presentation-exchange/dist/types.d.ts:112

#### Extends

- `Error`

#### Constructors

##### Constructor

```ts
new PresentationExchangeError(
   code: PresentationExchangeErrorCode, 
   message: string, 
   options?: {
  cause?: unknown;
}): PresentationExchangeError;
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:115

###### Parameters

###### code

[`PresentationExchangeErrorCode`](#presentationexchangeerrorcode)

###### message

`string`

###### options?

###### cause?

`unknown`

###### Returns

[`PresentationExchangeError`](#presentationexchangeerror)

###### Overrides

```ts
Error.constructor
```

#### Properties

##### name

```ts
readonly name: "PresentationExchangeError" = "PresentationExchangeError";
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:113

###### Overrides

```ts
Error.name
```

##### code

```ts
readonly code: PresentationExchangeErrorCode;
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:114

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

### CredentialMatcher

Defined in: @gramota/presentation-exchange/dist/matcher.d.ts:4

A credential matcher per credential format. New formats (W3C VC, mdoc)
can plug in new implementations of this interface — Strategy pattern.

#### Type Parameters

##### TCredential

`TCredential`

#### Properties

##### format

```ts
readonly format: string;
```

Defined in: @gramota/presentation-exchange/dist/matcher.d.ts:6

Stable format identifier (e.g. "vc+sd-jwt").

#### Methods

##### appliesTo()

```ts
appliesTo(descriptor: InputDescriptor): boolean;
```

Defined in: @gramota/presentation-exchange/dist/matcher.d.ts:9

Decide whether the descriptor's format/alg constraints apply to this
credential type.

###### Parameters

###### descriptor

[`InputDescriptor`](#inputdescriptor)

###### Returns

`boolean`

##### match()

```ts
match(credential: TCredential, descriptor: InputDescriptor): MatchResult;
```

Defined in: @gramota/presentation-exchange/dist/matcher.d.ts:12

Evaluate the credential against the descriptor. Returns the disclosure
names this descriptor would require, or `null` if no match.

###### Parameters

###### credential

`TCredential`

###### descriptor

[`InputDescriptor`](#inputdescriptor)

###### Returns

[`MatchResult`](#matchresult)

***

### MatchResult

Defined in: @gramota/presentation-exchange/dist/matcher.d.ts:14

#### Properties

##### disclose

```ts
disclose: readonly string[];
```

Defined in: @gramota/presentation-exchange/dist/matcher.d.ts:17

Names of selectively-disclosable claims required to satisfy the
descriptor. Pass these to `holder.present({ disclose: [...] })`.

##### satisfiedFields

```ts
satisfiedFields: readonly {
  fieldId: string;
  path: string;
}[];
```

Defined in: @gramota/presentation-exchange/dist/matcher.d.ts:19

Field-by-field detail, useful for audit logs and debug UIs.

***

### SdJwtVcCredentialView

Defined in: @gramota/presentation-exchange/dist/sd-jwt-vc-matcher.d.ts:7

Convenience: a holder-stored credential exposes its parsed form. We
accept either the full StoredCredential shape or just the parsed view —
keeping the matcher decoupled from `@gramota/holder`'s internals.

#### Properties

##### parsed

```ts
parsed: ParsedSdJwt;
```

Defined in: @gramota/presentation-exchange/dist/sd-jwt-vc-matcher.d.ts:8

***

### SelectInput

Defined in: @gramota/presentation-exchange/dist/select.d.ts:3

#### Type Parameters

##### TCredential

`TCredential`

#### Properties

##### definition

```ts
definition: PresentationDefinition;
```

Defined in: @gramota/presentation-exchange/dist/select.d.ts:4

##### credentials

```ts
credentials: readonly TCredential[];
```

Defined in: @gramota/presentation-exchange/dist/select.d.ts:5

##### matchers?

```ts
optional matchers?: readonly CredentialMatcher<TCredential>[];
```

Defined in: @gramota/presentation-exchange/dist/select.d.ts:7

Custom matchers — Strategy pattern; default is SD-JWT-VC.

##### pickCredential?

```ts
optional pickCredential?: (candidates: readonly {
  credential: TCredential;
  result: MatchResult;
}[]) => {
  credential: TCredential;
  result: MatchResult;
};
```

Defined in: @gramota/presentation-exchange/dist/select.d.ts:10

When multiple credentials satisfy a descriptor, which to pick.
Default: the first one.

###### Parameters

###### candidates

readonly \{
  `credential`: `TCredential`;
  `result`: [`MatchResult`](#matchresult);
\}[]

###### Returns

```ts
{
  credential: TCredential;
  result: MatchResult;
}
```

###### credential

```ts
credential: TCredential;
```

###### result

```ts
result: MatchResult;
```

***

### SelectionMatch

Defined in: @gramota/presentation-exchange/dist/select.d.ts:18

#### Type Parameters

##### TCredential

`TCredential`

#### Properties

##### descriptor

```ts
descriptor: InputDescriptor;
```

Defined in: @gramota/presentation-exchange/dist/select.d.ts:19

##### credential

```ts
credential: TCredential;
```

Defined in: @gramota/presentation-exchange/dist/select.d.ts:20

##### disclose

```ts
disclose: readonly string[];
```

Defined in: @gramota/presentation-exchange/dist/select.d.ts:22

Names of selectively-disclosable claims to disclose.

##### result

```ts
result: MatchResult;
```

Defined in: @gramota/presentation-exchange/dist/select.d.ts:24

Audit detail.

***

### SelectionFailure

Defined in: @gramota/presentation-exchange/dist/select.d.ts:26

#### Properties

##### descriptor

```ts
descriptor: InputDescriptor;
```

Defined in: @gramota/presentation-exchange/dist/select.d.ts:27

##### reason

```ts
reason: string;
```

Defined in: @gramota/presentation-exchange/dist/select.d.ts:28

***

### Selection

Defined in: @gramota/presentation-exchange/dist/select.d.ts:30

#### Type Parameters

##### TCredential

`TCredential`

#### Properties

##### matches

```ts
matches: readonly SelectionMatch<TCredential>[];
```

Defined in: @gramota/presentation-exchange/dist/select.d.ts:31

##### unmatched

```ts
unmatched: readonly SelectionFailure[];
```

Defined in: @gramota/presentation-exchange/dist/select.d.ts:32

##### fullySatisfied

```ts
fullySatisfied: boolean;
```

Defined in: @gramota/presentation-exchange/dist/select.d.ts:33

***

### PresentationDefinition

Defined in: @gramota/presentation-exchange/dist/types.d.ts:11

DIF Presentation Exchange v2 types — what the verifier asks for, and how
the holder responds.

Spec: https://identity.foundation/presentation-exchange/spec/v2.1.1/

Scope of this package: input_descriptors, fields, format, limit_disclosure.
Deferred to v2: submission_requirements, predicate, full filter (JSON
Schema), frame.

#### Properties

##### id

```ts
id: string;
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:12

##### name?

```ts
optional name?: string;
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:13

##### purpose?

```ts
optional purpose?: string;
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:14

##### format?

```ts
optional format?: FormatMap;
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:17

Acceptable credential formats and their algorithms, applied at the PD
level (overridable per input_descriptor).

##### input\_descriptors

```ts
input_descriptors: readonly InputDescriptor[];
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:18

***

### InputDescriptor

Defined in: @gramota/presentation-exchange/dist/types.d.ts:25

#### Properties

##### id

```ts
id: string;
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:26

##### name?

```ts
optional name?: string;
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:27

##### purpose?

```ts
optional purpose?: string;
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:28

##### format?

```ts
optional format?: FormatMap;
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:30

Per-descriptor format override.

##### constraints

```ts
constraints: Constraints;
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:31

***

### Constraints

Defined in: @gramota/presentation-exchange/dist/types.d.ts:33

#### Properties

##### fields?

```ts
optional fields?: readonly Field[];
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:34

##### limit\_disclosure?

```ts
optional limit_disclosure?: "required" | "preferred";
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:37

When "required", the holder MUST limit disclosure to only the requested
fields (selective disclosure mandatory). When "preferred", it's a hint.

***

### Field

Defined in: @gramota/presentation-exchange/dist/types.d.ts:39

#### Properties

##### path

```ts
path: readonly string[];
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:42

JSONPath expressions; the verifier's query into the credential. The
field is satisfied if ANY of the paths match.

##### id?

```ts
optional id?: string;
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:44

Optional friendly id for audit logs.

##### optional?

```ts
optional optional?: boolean;
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:46

When true, missing field doesn't fail the descriptor.

##### filter?

```ts
optional filter?: {
  type?: "string" | "number" | "boolean" | "integer";
};
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:49

JSON Schema fragment to validate the matched value. v1 supports
`{ type: "..." }` only.

###### type?

```ts
optional type?: "string" | "number" | "boolean" | "integer";
```

##### purpose?

```ts
optional purpose?: string;
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:52

***

### PresentationSubmission

Defined in: @gramota/presentation-exchange/dist/types.d.ts:56

A holder-built mapping of which credentials satisfy which descriptors,
per DIF PE §6 — the wallet's response to a Presentation Definition.

#### Properties

##### id

```ts
id: string;
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:57

##### definition\_id

```ts
definition_id: string;
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:58

##### descriptor\_map

```ts
descriptor_map: readonly DescriptorMap[];
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:59

***

### DescriptorMap

Defined in: @gramota/presentation-exchange/dist/types.d.ts:61

#### Properties

##### id

```ts
id: string;
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:62

##### format

```ts
format: string;
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:64

e.g. "vc+sd-jwt", "jwt_vp", "ldp_vp", "mso_mdoc".

##### path

```ts
path: string;
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:66

JSONPath into the vp_token (`$` for single-credential responses).

##### path\_nested?

```ts
optional path_nested?: DescriptorMap;
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:67

## Type Aliases

### JsonPathSegment

```ts
type JsonPathSegment = 
  | {
  kind: "property";
  name: string;
}
  | {
  kind: "index";
  index: number;
};
```

Defined in: @gramota/presentation-exchange/dist/jsonpath.d.ts:20

Minimal JSONPath subset sufficient for SD-JWT-VC presentation queries.

Supported:
  $                  — the root
  $.foo              — property
  $.foo.bar          — nested property
  $['foo']           — bracket notation
  $['foo']['bar']    — chained bracket
  $.foo[0]           — array index

NOT supported (v1):
  $..foo             — recursive descent
  $.foo[*]           — wildcards
  $[?(@.x>0)]        — filters

Returns the matched value, or `undefined` if no match. Throws only on
malformed expressions.

***

### FormatMap

```ts
type FormatMap = Readonly<Record<string, {
  alg?: readonly string[];
}>>;
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:22

Maps a credential format identifier (e.g. "vc+sd-jwt") to algorithm
constraints. Per DIF PE §5.5.

***

### PresentationExchangeErrorCode

```ts
type PresentationExchangeErrorCode = 
  | "pe.jsonpath_invalid"
  | "pe.unsatisfiable"
  | "pe.format_unsupported"
  | "pe.invalid_input"
  | "dcql.invalid_query"
  | "dcql.invalid_path";
```

Defined in: @gramota/presentation-exchange/dist/types.d.ts:70

Stable codes for `PresentationExchangeError`.

## Variables

### SD\_JWT\_VC\_FORMAT

```ts
const SD_JWT_VC_FORMAT: "vc+sd-jwt" = "vc+sd-jwt";
```

Defined in: @gramota/presentation-exchange/dist/sd-jwt-vc-matcher.d.ts:10

## Functions

### parseJsonPath()

```ts
function parseJsonPath(expr: string): readonly JsonPathSegment[];
```

Defined in: @gramota/presentation-exchange/dist/jsonpath.d.ts:27

#### Parameters

##### expr

`string`

#### Returns

readonly [`JsonPathSegment`](#jsonpathsegment)[]

***

### evaluateJsonPath()

```ts
function evaluateJsonPath(expr: string, root: unknown): unknown;
```

Defined in: @gramota/presentation-exchange/dist/jsonpath.d.ts:29

Evaluate a JSONPath against a value. Returns the matched leaf or undefined.

#### Parameters

##### expr

`string`

##### root

`unknown`

#### Returns

`unknown`

***

### leafClaimName()

```ts
function leafClaimName(expr: string): string;
```

Defined in: @gramota/presentation-exchange/dist/jsonpath.d.ts:33

Return the leaf claim name for a single-segment path like `$.given_name`,
or null for longer or non-property paths. Useful for SD-JWT-VC where a
top-level disclosure name == the JSONPath leaf.

#### Parameters

##### expr

`string`

#### Returns

`string`

***

### selectForDefinition()

```ts
function selectForDefinition<TCredential>(input: SelectInput<TCredential>): Selection<TCredential>;
```

Defined in: @gramota/presentation-exchange/dist/select.d.ts:42

Pick credentials + disclosures that satisfy a Presentation Definition.

Pure function: given a definition and a credential set, return what to
present. Caller (the holder) executes the actual presentation building
with `@gramota/holder`.

#### Type Parameters

##### TCredential

`TCredential`

#### Parameters

##### input

[`SelectInput`](#selectinput)\<`TCredential`\>

#### Returns

[`Selection`](#selection)\<`TCredential`\>

***

### buildPresentationSubmission()

```ts
function buildPresentationSubmission<TCredential>(
   definition: PresentationDefinition, 
   selection: Selection<TCredential>, 
   options?: {
  id?: string;
}): PresentationSubmission;
```

Defined in: @gramota/presentation-exchange/dist/select.d.ts:46

Build a Presentation Submission from a Selection. The vp_token paths
follow the convention: `$` for a single credential, `$[0]`, `$[1]`, ...
for arrays.

#### Type Parameters

##### TCredential

`TCredential`

#### Parameters

##### definition

[`PresentationDefinition`](#presentationdefinition)

##### selection

[`Selection`](#selection)\<`TCredential`\>

##### options?

###### id?

`string`

#### Returns

[`PresentationSubmission`](#presentationsubmission)
