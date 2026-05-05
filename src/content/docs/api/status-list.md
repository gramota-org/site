---
title: "@gramota/status-list"
slug: api/status-list
description: "IETF Token Status List + StatusResolver Strategy for revocation / suspension."
section: API reference
order: 12
---

# @gramota/status-list

> IETF Token Status List + StatusResolver Strategy for revocation / suspension.

Install: `pnpm add @gramota/status-list`

Source: [github.com/gramota-org/gramota/tree/main/packages/status-list](https://github.com/gramota-org/gramota/tree/main/packages/status-list)

## Classes

### StatusListResolver

Defined in: @gramota/status-list/dist/resolver.d.ts:57

IETF Token Status List resolver — the default resolver.

Pure delegation to `checkCredentialStatus`; the only thing this class
adds is the Strategy shape so it composes through DI.

#### Implements

- [`StatusResolver`](#statusresolver)

#### Constructors

##### Constructor

```ts
new StatusListResolver(config: StatusListResolverConfig): StatusListResolver;
```

Defined in: @gramota/status-list/dist/resolver.d.ts:59

###### Parameters

###### config

[`StatusListResolverConfig`](#statuslistresolverconfig)

###### Returns

[`StatusListResolver`](#statuslistresolver)

#### Methods

##### resolveStatus()

```ts
resolveStatus(credential: ParsedSdJwt, options?: ResolveStatusOptions): Promise<CredentialStatusResult | "skipped">;
```

Defined in: @gramota/status-list/dist/resolver.d.ts:60

###### Parameters

###### credential

`ParsedSdJwt`

###### options?

[`ResolveStatusOptions`](#resolvestatusoptions)

###### Returns

`Promise`\<[`CredentialStatusResult`](#credentialstatusresult) \| `"skipped"`\>

###### Implementation of

[`StatusResolver`](#statusresolver).[`resolveStatus`](#resolvestatus)

***

### StatusListError

Defined in: @gramota/status-list/dist/types.d.ts:72

#### Extends

- `Error`

#### Constructors

##### Constructor

```ts
new StatusListError(
   code: StatusListErrorCode, 
   message: string, 
   options?: {
  cause?: unknown;
}): StatusListError;
```

Defined in: @gramota/status-list/dist/types.d.ts:75

###### Parameters

###### code

[`StatusListErrorCode`](#statuslisterrorcode)

###### message

`string`

###### options?

###### cause?

`unknown`

###### Returns

[`StatusListError`](#statuslisterror)

###### Overrides

```ts
Error.constructor
```

#### Properties

##### name

```ts
readonly name: "StatusListError" = "StatusListError";
```

Defined in: @gramota/status-list/dist/types.d.ts:73

###### Overrides

```ts
Error.name
```

##### code

```ts
readonly code: StatusListErrorCode;
```

Defined in: @gramota/status-list/dist/types.d.ts:74

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

### BuildStatusListOptions

Defined in: @gramota/status-list/dist/build.d.ts:3

#### Properties

##### issuer

```ts
issuer: string;
```

Defined in: @gramota/status-list/dist/build.d.ts:5

Issuer URL (= `iss` claim).

##### subject

```ts
subject: string;
```

Defined in: @gramota/status-list/dist/build.d.ts:8

Public list URL (= `sub` claim, MUST equal the URL the list will be
fetched from — the verifier enforces match).

##### length

```ts
length: number;
```

Defined in: @gramota/status-list/dist/build.d.ts:10

Number of statuses to encode. The packed bytes are sized to fit.

##### bits?

```ts
optional bits?: StatusBits;
```

Defined in: @gramota/status-list/dist/build.d.ts:12

Bit-width per status. Default: 1 (valid/invalid only).

##### issuedAt?

```ts
optional issuedAt?: number;
```

Defined in: @gramota/status-list/dist/build.d.ts:14

Issued-at, unix seconds. Default: now.

##### expiresAt?

```ts
optional expiresAt?: number;
```

Defined in: @gramota/status-list/dist/build.d.ts:16

Optional expiry, unix seconds.

##### ttl?

```ts
optional ttl?: number;
```

Defined in: @gramota/status-list/dist/build.d.ts:18

Optional caching TTL hint.

##### initial?

```ts
optional initial?: Readonly<Record<number, number>>;
```

Defined in: @gramota/status-list/dist/build.d.ts:20

Initial statuses — index → code. Codes default to 0 (valid).

##### privateKey

```ts
privateKey: JsonWebKey;
```

Defined in: @gramota/status-list/dist/build.d.ts:22

Issuer's signing JWK.

##### alg

```ts
alg: SupportedAlg;
```

Defined in: @gramota/status-list/dist/build.d.ts:24

JWS algorithm — must match the key.

##### kid?

```ts
optional kid?: string;
```

Defined in: @gramota/status-list/dist/build.d.ts:26

Key id for the JWS header (so verifiers can pick the right JWK).

***

### CheckCredentialStatusOptions

Defined in: @gramota/status-list/dist/check.d.ts:5

#### Properties

##### trustedIssuers

```ts
trustedIssuers: readonly JsonWebKey[];
```

Defined in: @gramota/status-list/dist/check.d.ts:8

Trusted issuer JWKs — the status list's signature must verify
against one. Same semantics as everywhere else in the SDK.

##### fetcher?

```ts
optional fetcher?: Fetcher;
```

Defined in: @gramota/status-list/dist/check.d.ts:10

Override fetch — for tests.

##### now?

```ts
optional now?: () => number;
```

Defined in: @gramota/status-list/dist/check.d.ts:12

Override "now" — for expiry checks.

###### Returns

`number`

##### list?

```ts
optional list?: StatusList;
```

Defined in: @gramota/status-list/dist/check.d.ts:15

Pre-fetched / cached list — skip the network if supplied. The list
is still validated (`sub` match, expiry) before use.

***

### FetchStatusListOptions

Defined in: @gramota/status-list/dist/fetch.d.ts:4

#### Properties

##### fetcher?

```ts
optional fetcher?: Fetcher;
```

Defined in: @gramota/status-list/dist/fetch.d.ts:6

Override fetch — for tests.

##### trustedIssuers?

```ts
optional trustedIssuers?: readonly JsonWebKey[];
```

Defined in: @gramota/status-list/dist/fetch.d.ts:9

Trusted issuer JWKs the list's signature must verify against. If
omitted, the list is parsed but its signature is NOT checked.

##### now?

```ts
optional now?: () => number;
```

Defined in: @gramota/status-list/dist/fetch.d.ts:11

Override "now" — for expiry checks. Defaults to system time.

###### Returns

`number`

***

### ResolveStatusOptions

Defined in: @gramota/status-list/dist/resolver.d.ts:24

Per-call options that may vary independently of resolver config.

#### Properties

##### now?

```ts
optional now?: () => number;
```

Defined in: @gramota/status-list/dist/resolver.d.ts:26

Override "now" — for tests + frozen-time environments.

###### Returns

`number`

***

### StatusResolver

Defined in: @gramota/status-list/dist/resolver.d.ts:39

Strategy interface for resolving a credential's status.

Returns "skipped" when the credential carries no status reference and
the resolver couldn't (or wasn't asked to) infer one. The verifier
decides how to interpret "skipped" — fail or pass — based on policy
(`requireStatus` per call).

Implementations are pure (no per-flow state); a single instance can
serve many concurrent verifications.

#### Methods

##### resolveStatus()

```ts
resolveStatus(credential: ParsedSdJwt, options?: ResolveStatusOptions): Promise<CredentialStatusResult | "skipped">;
```

Defined in: @gramota/status-list/dist/resolver.d.ts:40

###### Parameters

###### credential

`ParsedSdJwt`

###### options?

[`ResolveStatusOptions`](#resolvestatusoptions)

###### Returns

`Promise`\<[`CredentialStatusResult`](#credentialstatusresult) \| `"skipped"`\>

***

### StatusListResolverConfig

Defined in: @gramota/status-list/dist/resolver.d.ts:42

#### Properties

##### trustedIssuers

```ts
trustedIssuers: readonly JsonWebKey[];
```

Defined in: @gramota/status-list/dist/resolver.d.ts:44

Trusted JWKs the status-list signature must verify against.

##### fetcher?

```ts
optional fetcher?: Fetcher;
```

Defined in: @gramota/status-list/dist/resolver.d.ts:46

Optional fetcher override.

##### list?

```ts
optional list?: StatusList;
```

Defined in: @gramota/status-list/dist/resolver.d.ts:49

Pre-fetched / cached list — skip the network when supplied. The
`sub` of the list must match the credential's status URI.

***

### StatusReference

Defined in: @gramota/status-list/dist/types.d.ts:24

A reference to a credential's status — embedded as `status.status_list`
in the credential payload.

#### Properties

##### uri

```ts
uri: string;
```

Defined in: @gramota/status-list/dist/types.d.ts:26

URL where the wallet/verifier fetches the status list token.

##### idx

```ts
idx: number;
```

Defined in: @gramota/status-list/dist/types.d.ts:28

0-based index into the list.

***

### StatusList

Defined in: @gramota/status-list/dist/types.d.ts:33

A parsed (decoded + decompressed) status list.

#### Properties

##### bits

```ts
bits: StatusBits;
```

Defined in: @gramota/status-list/dist/types.d.ts:35

Bit-width of each status entry.

##### bytes

```ts
bytes: Uint8Array;
```

Defined in: @gramota/status-list/dist/types.d.ts:38

Decompressed raw bitstring. Each byte holds 8/bits statuses
(for bits=1, 8 statuses; bits=2, 4 statuses; etc.).

##### length

```ts
length: number;
```

Defined in: @gramota/status-list/dist/types.d.ts:40

Total number of statuses encoded — derived from `bytes.length`.

##### issuer

```ts
issuer: string;
```

Defined in: @gramota/status-list/dist/types.d.ts:42

Issuer of the list (`iss` claim of the status list token).

##### subject

```ts
subject: string;
```

Defined in: @gramota/status-list/dist/types.d.ts:45

The list's own URL / subject (`sub` claim — should match the URI
used to fetch it).

##### issuedAt

```ts
issuedAt: number;
```

Defined in: @gramota/status-list/dist/types.d.ts:47

Issued-at, unix seconds.

##### expiresAt?

```ts
optional expiresAt?: number;
```

Defined in: @gramota/status-list/dist/types.d.ts:49

Expiry (unix seconds), if the issuer set one.

##### ttl?

```ts
optional ttl?: number;
```

Defined in: @gramota/status-list/dist/types.d.ts:51

Caching hint (seconds), if set.

***

### CredentialStatusResult

Defined in: @gramota/status-list/dist/types.d.ts:60

Result of resolving a credential's status.

#### Properties

##### code

```ts
code: number;
```

Defined in: @gramota/status-list/dist/types.d.ts:62

Numeric status code.

##### state

```ts
state: StatusState;
```

Defined in: @gramota/status-list/dist/types.d.ts:64

Human-readable label.

##### list

```ts
list: StatusList;
```

Defined in: @gramota/status-list/dist/types.d.ts:66

The list that was consulted.

##### reference

```ts
reference: StatusReference;
```

Defined in: @gramota/status-list/dist/types.d.ts:68

The reference that pointed at the list.

## Type Aliases

### Fetcher

```ts
type Fetcher = (url: string, init?: RequestInit) => Promise<FetcherResponse>;
```

Defined in: .pnpm/@gramota+jose@0.2.0/node\_modules/@gramota/jose/dist/fetcher.d.ts:44

Adapter-friendly HTTP fetcher. Compatible with global `fetch`,
`node-fetch`, `undici`, and test mocks.

#### Parameters

##### url

`string`

##### init?

`RequestInit`

#### Returns

`Promise`\<`FetcherResponse`\>

***

### StatusBits

```ts
type StatusBits = 1 | 2 | 4 | 8;
```

Defined in: @gramota/status-list/dist/types.d.ts:31

Permitted bit-widths per status (RFC requires one of these).

***

### StatusState

```ts
type StatusState = "valid" | "invalid" | "suspended" | "application_specific" | "unknown";
```

Defined in: @gramota/status-list/dist/types.d.ts:58

Friendly label for a status code.

***

### StatusListErrorCode

```ts
type StatusListErrorCode = 
  | "status_list.invalid_input"
  | "status_list.invalid_token"
  | "status_list.invalid_payload"
  | "status_list.invalid_compression"
  | "status_list.invalid_bits"
  | "status_list.index_out_of_range"
  | "status_list.fetch_failed"
  | "status_list.signature_invalid"
  | "status_list.subject_mismatch"
  | "status_list.expired"
  | "status_list.no_status_reference";
```

Defined in: @gramota/status-list/dist/types.d.ts:71

Stable error codes for `StatusListError`.

## Variables

### STATUS\_VALID

```ts
const STATUS_VALID: 0 = 0;
```

Defined in: @gramota/status-list/dist/types.d.ts:54

Status code values defined by the spec.

***

### STATUS\_INVALID

```ts
const STATUS_INVALID: 1 = 1;
```

Defined in: @gramota/status-list/dist/types.d.ts:55

***

### STATUS\_SUSPENDED

```ts
const STATUS_SUSPENDED: 2 = 2;
```

Defined in: @gramota/status-list/dist/types.d.ts:56

## Functions

### buildStatusListToken()

```ts
function buildStatusListToken(options: BuildStatusListOptions): Promise<string>;
```

Defined in: @gramota/status-list/dist/build.d.ts:34

Build a signed Status List token (compact JWS) per the IETF spec.

Returns the compact JWS string. Hosting it at the URL passed as
`subject` makes it a real, fetchable status list.

#### Parameters

##### options

[`BuildStatusListOptions`](#buildstatuslistoptions)

#### Returns

`Promise`\<`string`\>

***

### checkCredentialStatus()

```ts
function checkCredentialStatus(credential: ParsedSdJwt, options: CheckCredentialStatusOptions): Promise<CredentialStatusResult>;
```

Defined in: @gramota/status-list/dist/check.d.ts:30

Resolve a credential's status per IETF Token Status List.

  1. Read the credential's `status.status_list = { uri, idx }`.
  2. Fetch the list (or use one passed in via `options.list`).
  3. Verify its signature against `trustedIssuers`.
  4. Read the bit(s) at `idx`.
  5. Return a structured result with code + state.

Throws `StatusListError("status_list.no_status_reference")` if the
credential has no `status` claim — callers should treat that as
"issuer didn't opt into revocation" (not as a verification failure).

#### Parameters

##### credential

`ParsedSdJwt`

##### options

[`CheckCredentialStatusOptions`](#checkcredentialstatusoptions)

#### Returns

`Promise`\<[`CredentialStatusResult`](#credentialstatusresult)\>

***

### readStatusReference()

```ts
function readStatusReference(credential: ParsedSdJwt): StatusReference;
```

Defined in: @gramota/status-list/dist/check.d.ts:32

Pull `status.status_list = { uri, idx }` out of a parsed credential.

#### Parameters

##### credential

`ParsedSdJwt`

#### Returns

[`StatusReference`](#statusreference)

***

### fetchStatusList()

```ts
function fetchStatusList(url: string, options?: FetchStatusListOptions): Promise<StatusList>;
```

Defined in: @gramota/status-list/dist/fetch.d.ts:21

Fetch a status list from `url`, optionally verify its JWS signature
against `trustedIssuers`, and return the parsed list.

Per the IETF spec, the list's `sub` claim MUST equal the URL it was
fetched from — we enforce this so a stolen list can't be presented
for a different URL.

#### Parameters

##### url

`string`

##### options?

[`FetchStatusListOptions`](#fetchstatuslistoptions)

#### Returns

`Promise`\<[`StatusList`](#statuslist)\>

***

### parseStatusListToken()

```ts
function parseStatusListToken(token: string): StatusList;
```

Defined in: @gramota/status-list/dist/parse.d.ts:19

Parse a Status List token (compact JWS form).

Expected payload claims per the IETF spec:
  iss         — issuer URL (string)
  sub         — list URL (string, MUST equal the URL used to fetch it)
  iat         — issued-at, unix seconds (number)
  exp         — optional expiry (unix seconds)
  ttl         — optional caching hint (seconds)
  status_list — { bits, lst }
    bits      — 1 | 2 | 4 | 8
    lst       — base64url(zlib_compressed_bitstring)

NOTE: this function does NOT verify the JWS signature. Use
`verifyStatusListToken` (in fetch.ts / a separate wrapper) when
trust matters — i.e., before relying on the result for verification.

#### Parameters

##### token

`string`

#### Returns

[`StatusList`](#statuslist)

***

### parseStatusListPayload()

```ts
function parseStatusListPayload(payload: Record<string, unknown>): StatusList;
```

Defined in: @gramota/status-list/dist/parse.d.ts:21

Parse a status list from an already-decoded JWT payload object.

#### Parameters

##### payload

`Record`\<`string`, `unknown`\>

#### Returns

[`StatusList`](#statuslist)

***

### getStatus()

```ts
function getStatus(list: StatusList, index: number): number;
```

Defined in: @gramota/status-list/dist/parse.d.ts:30

Read the status code at `index` from a parsed list.

Bit ordering per spec: within a byte, the lowest-numbered indices live
in the LSBs. For bits=2:
  byte 0 = b7 b6 b5 b4 b3 b2 b1 b0
          [idx3][idx2][idx1][idx0]

#### Parameters

##### list

[`StatusList`](#statuslist)

##### index

`number`

#### Returns

`number`
