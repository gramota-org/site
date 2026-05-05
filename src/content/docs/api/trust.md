---
title: "@gramota/trust"
slug: api/trust
description: "TrustResolver Strategy — Static, JwksUrl, SdJwtVcIssuer (.well-known/jwt-vc-issuer)."
section: API reference
order: 11
---

> TrustResolver Strategy — Static, JwksUrl, SdJwtVcIssuer (.well-known/jwt-vc-issuer).

Install: `pnpm add @gramota/trust`

Source: [github.com/gramota-org/gramota/tree/main/packages/trust](https://github.com/gramota-org/gramota/tree/main/packages/trust)

## Classes

### JwksUrlTrustResolver

Defined in: @gramota/trust/dist/jwks-url.d.ts:20

Resolve issuer keys by fetching a JWK Set (RFC 7517 §5) from the issuer's
well-known URL. Caches per-issuer for `cacheMs`.

#### Implements

- [`TrustResolver`](#trustresolver)

#### Constructors

##### Constructor

```ts
new JwksUrlTrustResolver(options?: JwksUrlResolverOptions): JwksUrlTrustResolver;
```

Defined in: @gramota/trust/dist/jwks-url.d.ts:26

###### Parameters

###### options?

[`JwksUrlResolverOptions`](#jwksurlresolveroptions)

###### Returns

[`JwksUrlTrustResolver`](#jwksurltrustresolver)

#### Methods

##### resolveIssuerKeys()

```ts
resolveIssuerKeys(context: TrustContext): Promise<readonly JsonWebKey[]>;
```

Defined in: @gramota/trust/dist/jwks-url.d.ts:27

Return all candidate JWKs that might verify this issuer's JWS. The
verifier will try each in order until one succeeds. Throw if no candidate
can be produced — that's a trust-resolution failure.

###### Parameters

###### context

[`TrustContext`](#trustcontext)

###### Returns

`Promise`\<readonly `JsonWebKey`[]\>

###### Implementation of

[`TrustResolver`](#trustresolver).[`resolveIssuerKeys`](#resolveissuerkeys-3)

##### invalidate()

```ts
invalidate(iss: string): void;
```

Defined in: @gramota/trust/dist/jwks-url.d.ts:30

Manually invalidate the cache for a given issuer. Useful when keys
rotate and the consumer knows about it out of band.

###### Parameters

###### iss

`string`

###### Returns

`void`

***

### SdJwtVcIssuerTrustResolver

Defined in: @gramota/trust/dist/sd-jwt-vc-issuer.d.ts:47

A pluggable strategy for figuring out which JWK(s) should verify an
issuer's JWS. Strategy + Repository pattern: implementations can be a
static list, a JWKS URL fetch, an EU Trusted List, or anything custom.

#### Implements

- [`TrustResolver`](#trustresolver)

#### Constructors

##### Constructor

```ts
new SdJwtVcIssuerTrustResolver(options?: SdJwtVcIssuerResolverOptions): SdJwtVcIssuerTrustResolver;
```

Defined in: @gramota/trust/dist/sd-jwt-vc-issuer.d.ts:53

###### Parameters

###### options?

[`SdJwtVcIssuerResolverOptions`](#sdjwtvcissuerresolveroptions)

###### Returns

[`SdJwtVcIssuerTrustResolver`](#sdjwtvcissuertrustresolver)

#### Methods

##### resolveIssuerKeys()

```ts
resolveIssuerKeys(context: TrustContext): Promise<readonly JsonWebKey[]>;
```

Defined in: @gramota/trust/dist/sd-jwt-vc-issuer.d.ts:54

Return all candidate JWKs that might verify this issuer's JWS. The
verifier will try each in order until one succeeds. Throw if no candidate
can be produced — that's a trust-resolution failure.

###### Parameters

###### context

[`TrustContext`](#trustcontext)

###### Returns

`Promise`\<readonly `JsonWebKey`[]\>

###### Implementation of

[`TrustResolver`](#trustresolver).[`resolveIssuerKeys`](#resolveissuerkeys-3)

##### invalidate()

```ts
invalidate(iss: string): void;
```

Defined in: @gramota/trust/dist/sd-jwt-vc-issuer.d.ts:56

Force-clear cache for one issuer.

###### Parameters

###### iss

`string`

###### Returns

`void`

***

### StaticTrustResolver

Defined in: @gramota/trust/dist/static.d.ts:23

Trust a fixed set of public keys, optionally keyed by issuer URL.

Two configuration shapes:

  // Flat list — every key is trusted for every issuer.
  new StaticTrustResolver([key1, key2])

  // Per-issuer map — strict isolation between issuers.
  new StaticTrustResolver({
    "https://issuer-a.example.com": [keyA1, keyA2],
    "https://issuer-b.example.com": [keyB],
  })

`kid` matching: if both the JWT header and a configured key carry a `kid`,
the resolver returns only matching keys; otherwise it returns all keys for
the issuer (verifier will try them in order).

#### Implements

- [`TrustResolver`](#trustresolver)

#### Constructors

##### Constructor

```ts
new StaticTrustResolver(input: StaticTrustInput): StaticTrustResolver;
```

Defined in: @gramota/trust/dist/static.d.ts:27

###### Parameters

###### input

[`StaticTrustInput`](#statictrustinput)

###### Returns

[`StaticTrustResolver`](#statictrustresolver)

#### Methods

##### resolveIssuerKeys()

```ts
resolveIssuerKeys(context: TrustContext): Promise<readonly JsonWebKey[]>;
```

Defined in: @gramota/trust/dist/static.d.ts:28

Return all candidate JWKs that might verify this issuer's JWS. The
verifier will try each in order until one succeeds. Throw if no candidate
can be produced — that's a trust-resolution failure.

###### Parameters

###### context

[`TrustContext`](#trustcontext)

###### Returns

`Promise`\<readonly `JsonWebKey`[]\>

###### Implementation of

[`TrustResolver`](#trustresolver).[`resolveIssuerKeys`](#resolveissuerkeys-3)

***

### TrustResolutionError

Defined in: @gramota/trust/dist/types.d.ts:22

#### Extends

- `Error`

#### Constructors

##### Constructor

```ts
new TrustResolutionError(
   code: TrustErrorCode, 
   message: string, 
   options?: {
  cause?: unknown;
}): TrustResolutionError;
```

Defined in: @gramota/trust/dist/types.d.ts:25

###### Parameters

###### code

[`TrustErrorCode`](#trusterrorcode)

###### message

`string`

###### options?

###### cause?

`unknown`

###### Returns

[`TrustResolutionError`](#trustresolutionerror)

###### Overrides

```ts
Error.constructor
```

#### Properties

##### name

```ts
readonly name: "TrustResolutionError" = "TrustResolutionError";
```

Defined in: @gramota/trust/dist/types.d.ts:23

###### Overrides

```ts
Error.name
```

##### code

```ts
readonly code: TrustErrorCode;
```

Defined in: @gramota/trust/dist/types.d.ts:24

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

### JwksUrlResolverOptions

Defined in: @gramota/trust/dist/jwks-url.d.ts:4

#### Properties

##### jwksUrl?

```ts
optional jwksUrl?: (iss: string) => string;
```

Defined in: @gramota/trust/dist/jwks-url.d.ts:8

Build the JWKS URL from the issuer's `iss` claim. Default: appends
`/.well-known/jwks.json`. SD-JWT-VC §5.1 also defines a different scheme
via `/.well-known/jwt-issuer/...`; pass a custom builder for that.

###### Parameters

###### iss

`string`

###### Returns

`string`

##### cacheMs?

```ts
optional cacheMs?: number;
```

Defined in: @gramota/trust/dist/jwks-url.d.ts:10

Cache TTL in milliseconds. Default: 5 minutes.

##### fetcher?

```ts
optional fetcher?: Fetcher;
```

Defined in: @gramota/trust/dist/jwks-url.d.ts:12

Override the global `fetch` — useful for tests + custom transports.

##### now?

```ts
optional now?: () => number;
```

Defined in: @gramota/trust/dist/jwks-url.d.ts:14

Override `Date.now()` — used for cache expiry tests.

###### Returns

`number`

***

### SdJwtVcIssuerResolverOptions

Defined in: @gramota/trust/dist/sd-jwt-vc-issuer.d.ts:37

#### Properties

##### metadataUrl?

```ts
optional metadataUrl?: (iss: string) => string;
```

Defined in: @gramota/trust/dist/sd-jwt-vc-issuer.d.ts:39

Override the well-known URL builder. Default: `<iss>/.well-known/jwt-vc-issuer`.

###### Parameters

###### iss

`string`

###### Returns

`string`

##### cacheMs?

```ts
optional cacheMs?: number;
```

Defined in: @gramota/trust/dist/sd-jwt-vc-issuer.d.ts:41

Cache TTL in milliseconds. Default: 5 minutes.

##### fetcher?

```ts
optional fetcher?: Fetcher;
```

Defined in: @gramota/trust/dist/sd-jwt-vc-issuer.d.ts:43

Override `fetch`.

##### now?

```ts
optional now?: () => number;
```

Defined in: @gramota/trust/dist/sd-jwt-vc-issuer.d.ts:45

Override `Date.now()` — for tests.

###### Returns

`number`

***

### TrustContext

Defined in: @gramota/trust/dist/types.d.ts:3

Inputs the resolver gets to make a decision.

#### Properties

##### iss

```ts
iss: string;
```

Defined in: @gramota/trust/dist/types.d.ts:5

The `iss` claim from the JWT payload, if any.

##### kid

```ts
kid: string;
```

Defined in: @gramota/trust/dist/types.d.ts:7

The `kid` claim from the JWT protected header, if any.

##### header

```ts
header: Readonly<Record<string, unknown>>;
```

Defined in: @gramota/trust/dist/types.d.ts:9

The full protected header — useful for `x5c`, `jwk`, custom params.

***

### TrustResolver

Defined in: @gramota/trust/dist/types.d.ts:14

A pluggable strategy for figuring out which JWK(s) should verify an
issuer's JWS. Strategy + Repository pattern: implementations can be a
static list, a JWKS URL fetch, an EU Trusted List, or anything custom.

#### Methods

##### resolveIssuerKeys()

```ts
resolveIssuerKeys(context: TrustContext): Promise<readonly JsonWebKey[]>;
```

Defined in: @gramota/trust/dist/types.d.ts:18

Return all candidate JWKs that might verify this issuer's JWS. The
verifier will try each in order until one succeeds. Throw if no candidate
can be produced — that's a trust-resolution failure.

###### Parameters

###### context

[`TrustContext`](#trustcontext)

###### Returns

`Promise`\<readonly `JsonWebKey`[]\>

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

### StaticTrustInput

```ts
type StaticTrustInput = 
  | readonly JsonWebKey[]
| Readonly<Record<string, readonly JsonWebKey[]>>;
```

Defined in: @gramota/trust/dist/static.d.ts:4

Constructor input forms for StaticTrustResolver.

***

### TrustErrorCode

```ts
type TrustErrorCode = 
  | "trust.iss_required"
  | "trust.issuer_not_configured"
  | "trust.fetch_failed"
  | "trust.http_error"
  | "trust.malformed_jwks"
  | "trust.invalid_input";
```

Defined in: @gramota/trust/dist/types.d.ts:21

Stable codes for `TrustResolutionError`.
