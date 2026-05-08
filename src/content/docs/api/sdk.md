---
title: "@gramota/sdk"
slug: api/sdk
description: "Top-level Stripe-shaped facade. One config, one import, lazy-instantiated clients."
section: API reference
order: 0
---

# @gramota/sdk

> Top-level Stripe-shaped facade. One config, one import, lazy-instantiated clients.

Install: `pnpm add @gramota/sdk`

Source: [github.com/gramota-org/gramota/tree/main/packages/sdk](https://github.com/gramota-org/gramota/tree/main/packages/sdk)

## Classes

### GramotaError

Defined in: .pnpm/@gramota+core@0.2.0/node\_modules/@gramota/core/dist/error.d.ts:34

Base error for everything thrown out of `@gramota/*` packages.

Every per-package error class extends this. Two reasons:

  1. **One catch site.** Telemetry, logging, and error boundaries
     can use `instanceof GramotaError` instead of importing every
     package's error class. Particularly important for app-level
     Sentry integration where you want to tag SDK errors uniformly.

  2. **Stable error code surface.** Each subclass narrows `code` to
     its own union (`SecurityCheckName` for verifier, `IssuerErrorCode`
     for issuer, etc.) but `error.code` is always a string at runtime,
     so generic logs / metrics keys work without type gymnastics.

Subclasses **should**:
  - Set `name` to the subclass name (improves stack traces)
  - Pass a structured `code` for programmatic branching
  - Pass `cause` when wrapping a thrown error from a dependency

#### Example

```ts
try {
  await verifier.presentations.verify(token, { nonce });
} catch (err) {
  if (err instanceof GramotaError) {
    telemetry.recordError(err.name, err.code);
    throw err;
  }
  throw err;
}
```

#### Extends

- `Error`

#### Constructors

##### Constructor

```ts
new GramotaError(
   message: string, 
   code: string, 
   options?: {
  cause?: unknown;
}): GramotaError;
```

Defined in: .pnpm/@gramota+core@0.2.0/node\_modules/@gramota/core/dist/error.d.ts:45

###### Parameters

###### message

`string`

###### code

`string`

###### options?

###### cause?

`unknown`

###### Returns

[`GramotaError`](#gramotaerror)

###### Overrides

```ts
Error.constructor
```

#### Properties

##### code

```ts
readonly code: string;
```

Defined in: .pnpm/@gramota+core@0.2.0/node\_modules/@gramota/core/dist/error.d.ts:39

Stable string that identifies the failure mode. Subclasses narrow
the type; at runtime it's always a string. Use for branching, logs,
and metrics labels — never serialize [GramotaError.message](#message)
for that purpose, message strings drift across versions.

##### cause?

```ts
readonly optional cause?: unknown;
```

Defined in: .pnpm/@gramota+core@0.2.0/node\_modules/@gramota/core/dist/error.d.ts:44

Optional original error that caused this one. Always set when the
Gramota package is wrapping a thrown exception from a dependency
(Web Crypto, JOSE, fetch). Survives `JSON.stringify(err)` only via
the `cause` property — Node 16.9+ logs it natively.

##### name

```ts
name: string;
```

Defined in: .pnpm/typescript@5.9.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

```ts
Error.name
```

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

### Gramota

Defined in: @gramota/sdk/dist/gramota.d.ts:67

`@gramota/sdk` — top-level facade for the Gramota EU Digital Identity
Wallet SDK.

Use this package when you want one import + one config object instead
of wiring `@gramota/verifier`, `@gramota/issuer`, `@gramota/holder`,
and `@gramota/qr` separately.

  ```ts
  import { Gramota } from "@gramota/sdk";

  const gramota = new Gramota({
    verifier: { audience: "https://my-bank.com", trust },
  });

  const result = await gramota.verifier.presentations.verify(token, { nonce });
  const code = gramota.qr.fromAuthorizationRequest(req);
  ```

Re-exports the foundational types from `@gramota/core` (`GramotaError`,
`Fetcher`) so app code rarely has to import from `@gramota/core`
directly.

#### Constructors

##### Constructor

```ts
new Gramota(options?: GramotaOptions): Gramota;
```

Defined in: @gramota/sdk/dist/gramota.d.ts:73

###### Parameters

###### options?

[`GramotaOptions`](#gramotaoptions)

###### Returns

[`Gramota`](#gramota)

#### Accessors

##### verifier

###### Get Signature

```ts
get verifier(): Verifier;
```

Defined in: @gramota/sdk/dist/gramota.d.ts:76

Verify presentation tokens and OID4VP responses, build OID4VP
authorization requests. Lazy — constructed on first access.

###### Returns

`Verifier`

##### issuer

###### Get Signature

```ts
get issuer(): Issuer;
```

Defined in: @gramota/sdk/dist/gramota.d.ts:78

Issue OID4VCI credentials. Lazy — constructed on first access.

###### Returns

`Issuer`

##### holder

###### Get Signature

```ts
get holder(): Holder;
```

Defined in: @gramota/sdk/dist/gramota.d.ts:80

Receive credentials, build presentations. Lazy — constructed on first access.

###### Returns

`Holder`

##### qr

###### Get Signature

```ts
get qr(): QrClient;
```

Defined in: @gramota/sdk/dist/gramota.d.ts:82

QR code rendering. Always available — has no required config.

###### Returns

`QrClient`

## Interfaces

### FetcherResponse

Defined in: .pnpm/@gramota+core@0.2.0/node\_modules/@gramota/core/dist/fetcher.d.ts:35

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

Defined in: .pnpm/@gramota+core@0.2.0/node\_modules/@gramota/core/dist/fetcher.d.ts:36

##### status

```ts
readonly status: number;
```

Defined in: .pnpm/@gramota+core@0.2.0/node\_modules/@gramota/core/dist/fetcher.d.ts:37

##### headers?

```ts
readonly optional headers?: {
  get: string;
};
```

Defined in: .pnpm/@gramota+core@0.2.0/node\_modules/@gramota/core/dist/fetcher.d.ts:41

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

Defined in: .pnpm/@gramota+core@0.2.0/node\_modules/@gramota/core/dist/fetcher.d.ts:44

###### Returns

`Promise`\<`unknown`\>

##### text()

```ts
text(): Promise<string>;
```

Defined in: .pnpm/@gramota+core@0.2.0/node\_modules/@gramota/core/dist/fetcher.d.ts:45

###### Returns

`Promise`\<`string`\>

***

### GramotaOptions

Defined in: @gramota/sdk/dist/gramota.d.ts:49

Construction-time options for [Gramota](#gramota).

`verifier`, `issuer`, `holder`, and `qr` are the per-client config
objects. They're optional — only the clients you reference get
instantiated lazily, and only their config keys are required.

#### Properties

##### verifier?

```ts
readonly optional verifier?: VerifierConfig;
```

Defined in: @gramota/sdk/dist/gramota.d.ts:51

Verifier config — required if you call `gramota.verifier`.

##### issuer?

```ts
readonly optional issuer?: IssuerConfig;
```

Defined in: @gramota/sdk/dist/gramota.d.ts:53

Issuer config — required if you call `gramota.issuer`.

##### holder?

```ts
readonly optional holder?: HolderConfig;
```

Defined in: @gramota/sdk/dist/gramota.d.ts:55

Holder config — required if you call `gramota.holder`.

##### qr?

```ts
readonly optional qr?: QrClientOptions;
```

Defined in: @gramota/sdk/dist/gramota.d.ts:58

QR client options. Defaults to a vanilla QrClient when
not provided.

##### fetcher?

```ts
readonly optional fetcher?: Fetcher;
```

Defined in: @gramota/sdk/dist/gramota.d.ts:65

Fetcher applied to every client that supports one and doesn't
specify its own. Useful for app-wide concerns like retry,
timeout, telemetry, or a request-id header. Per-client `fetcher`
still wins when set.

## Type Aliases

### Fetcher

```ts
type Fetcher = (url: string, init?: RequestInit) => Promise<FetcherResponse>;
```

Defined in: .pnpm/@gramota+core@0.2.0/node\_modules/@gramota/core/dist/fetcher.d.ts:49

Adapter-friendly HTTP fetcher. Compatible with global `fetch`,
`node-fetch`, `undici`, and test mocks.

#### Parameters

##### url

`string`

##### init?

`RequestInit`

#### Returns

`Promise`\<[`FetcherResponse`](#fetcherresponse)\>

## Functions

### isGramotaError()

```ts
function isGramotaError(err: unknown): err is GramotaError;
```

Defined in: .pnpm/@gramota+core@0.2.0/node\_modules/@gramota/core/dist/error.d.ts:56

Type guard — narrows a caught `unknown` to [GramotaError](#gramotaerror).

Particularly useful at app-level catch sites where you want to log
SDK errors uniformly without losing type information about where
they came from.

#### Parameters

##### err

`unknown`

#### Returns

`err is GramotaError`

***

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

Defined in: .pnpm/@gramota+core@0.2.0/node\_modules/@gramota/core/dist/fetcher.d.ts:60

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
