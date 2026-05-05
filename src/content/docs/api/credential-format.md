---
title: "@gramota/credential-format"
slug: api/credential-format
description: "Pluggable format-handler registry (SD-JWT-VC ships; mDoc plugs in)."
section: API reference
order: 10
---

# @gramota/credential-format

> Pluggable format-handler registry (SD-JWT-VC ships; mDoc plugs in).

Install: `pnpm add @gramota/credential-format`

Source: [github.com/gramota-org/gramota/tree/main/packages/credential-format](https://github.com/gramota-org/gramota/tree/main/packages/credential-format)

## Classes

### CredentialFormatRegistry

Defined in: @gramota/credential-format/dist/registry.d.ts:24

Registry of credential-format handlers (GoF Registry + Strategy).

Use cases:

  1. The OID4VCI client asks "do you have an issuance handler for
     'vc+sd-jwt'?" — `requireIssuance(format)` returns the narrow
     capability or throws.

  2. A wallet author writes their own format (e.g. an internal proof-
     of-concept), registers it, and the rest of the SDK accepts
     credentials in that format without modification.

    const registry = new CredentialFormatRegistry()
      .register(new SdJwtVcFormatHandler())
      .register(new MDocFormatHandler())     // future
      .register(new MyCustomHandler());      // your own

The registry is mutable in the builder phase but its `find/require`
methods are pure — many lookups can run concurrently against one
registry instance.

#### Constructors

##### Constructor

```ts
new CredentialFormatRegistry(): CredentialFormatRegistry;
```

###### Returns

[`CredentialFormatRegistry`](#credentialformatregistry)

#### Methods

##### register()

```ts
register(handler: CredentialFormatHandler): this;
```

Defined in: @gramota/credential-format/dist/registry.d.ts:29

Register a handler. Each format the handler claims becomes a key.
Throws if any of those keys is already taken — duplicate registration
is a programmer error, not a silent override.

###### Parameters

###### handler

[`CredentialFormatHandler`](#credentialformathandler)

###### Returns

`this`

##### find()

```ts
find(format: string): CredentialFormatHandler;
```

Defined in: @gramota/credential-format/dist/registry.d.ts:31

Lookup a handler by format string. Returns undefined if none claims it.

###### Parameters

###### format

`string`

###### Returns

[`CredentialFormatHandler`](#credentialformathandler)

##### has()

```ts
has(format: string): boolean;
```

Defined in: @gramota/credential-format/dist/registry.d.ts:33

True iff some registered handler claims `format`.

###### Parameters

###### format

`string`

###### Returns

`boolean`

##### knownFormats()

```ts
knownFormats(): readonly string[];
```

Defined in: @gramota/credential-format/dist/registry.d.ts:35

All format identifiers any registered handler claims.

###### Returns

readonly `string`[]

##### requireIssuance()

```ts
requireIssuance(format: string): IssuanceCapableHandler;
```

Defined in: @gramota/credential-format/dist/registry.d.ts:41

Lookup with capability narrowing — issuance flow.

Throws `credential_format.unknown_format` when no handler claims
`format`, or `credential_format.capability_missing` when the handler
exists but doesn't support issuance.

###### Parameters

###### format

`string`

###### Returns

[`IssuanceCapableHandler`](#issuancecapablehandler)

***

### SdJwtVcFormatHandler

Defined in: @gramota/credential-format/dist/sd-jwt-vc.d.ts:16

Default handler for SD-JWT-VC and dc+sd-jwt credentials.

Bundled with `@gramota/credential-format` because SD-JWT-VC is the
dominant EUDIW format. mDoc gets its own package when it lands.

The validation here is intentionally minimal — full structural
verification (parsing, hash binding, KB-JWT, etc.) lives in
`@gramota/sd-jwt` / `@gramota/verifier`. This handler only confirms
the token "looks like" an SD-JWT-VC issuance: at minimum a JWS with
`~`-separated disclosure segments. That's enough to gate the OID4VCI
credential-endpoint response without pulling in the full sd-jwt
dependency tree.

#### Implements

- [`IssuanceCapableHandler`](#issuancecapablehandler)

#### Constructors

##### Constructor

```ts
new SdJwtVcFormatHandler(): SdJwtVcFormatHandler;
```

###### Returns

[`SdJwtVcFormatHandler`](#sdjwtvcformathandler)

#### Properties

##### formats

```ts
readonly formats: readonly string[];
```

Defined in: @gramota/credential-format/dist/sd-jwt-vc.d.ts:17

Format identifiers this handler claims, e.g. ["vc+sd-jwt", "dc+sd-jwt"].

###### Implementation of

[`IssuanceCapableHandler`](#issuancecapablehandler).[`formats`](#formats-2)

##### canReceiveIssuance

```ts
readonly canReceiveIssuance: true;
```

Defined in: @gramota/credential-format/dist/sd-jwt-vc.d.ts:18

Brand bit — see file header.

###### Implementation of

[`IssuanceCapableHandler`](#issuancecapablehandler).[`canReceiveIssuance`](#canreceiveissuance-1)

#### Methods

##### supports()

```ts
supports(format: string): boolean;
```

Defined in: @gramota/credential-format/dist/sd-jwt-vc.d.ts:19

True iff `format` is in [formats](#formats-1). Strict equality.

###### Parameters

###### format

`string`

###### Returns

`boolean`

###### Implementation of

[`IssuanceCapableHandler`](#issuancecapablehandler).[`supports`](#supports-2)

##### validateIssuanceToken()

```ts
validateIssuanceToken(token: string): void;
```

Defined in: @gramota/credential-format/dist/sd-jwt-vc.d.ts:20

Validate a credential token returned by an OID4VCI credential
endpoint. Throws if the token is malformed for this format.

Pre-condition: caller has already confirmed the token's format
matches `this.formats` via the registry.

###### Parameters

###### token

`string`

###### Returns

`void`

###### Implementation of

[`IssuanceCapableHandler`](#issuancecapablehandler).[`validateIssuanceToken`](#validateissuancetoken-1)

***

### CredentialFormatError

Defined in: @gramota/credential-format/dist/types.d.ts:54

#### Extends

- `Error`

#### Constructors

##### Constructor

```ts
new CredentialFormatError(
   code: CredentialFormatErrorCode, 
   message: string, 
   options?: {
  cause?: unknown;
}): CredentialFormatError;
```

Defined in: @gramota/credential-format/dist/types.d.ts:57

###### Parameters

###### code

[`CredentialFormatErrorCode`](#credentialformaterrorcode)

###### message

`string`

###### options?

###### cause?

`unknown`

###### Returns

[`CredentialFormatError`](#credentialformaterror)

###### Overrides

```ts
Error.constructor
```

#### Properties

##### name

```ts
readonly name: "CredentialFormatError" = "CredentialFormatError";
```

Defined in: @gramota/credential-format/dist/types.d.ts:55

###### Overrides

```ts
Error.name
```

##### code

```ts
readonly code: CredentialFormatErrorCode;
```

Defined in: @gramota/credential-format/dist/types.d.ts:56

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

### CredentialFormatHandler

Defined in: @gramota/credential-format/dist/types.d.ts:27

Base — every format handler advertises which format strings it claims.

Implementations live close to the format-specific logic they wrap (e.g.
`SdJwtVcFormatHandler` lives in `@gramota/credential-format-sd-jwt-vc`,
future `MDocFormatHandler` in `@gramota/credential-format-mdoc`).

#### Extended by

- [`IssuanceCapableHandler`](#issuancecapablehandler)

#### Properties

##### formats

```ts
readonly formats: readonly string[];
```

Defined in: @gramota/credential-format/dist/types.d.ts:29

Format identifiers this handler claims, e.g. ["vc+sd-jwt", "dc+sd-jwt"].

#### Methods

##### supports()

```ts
supports(format: string): boolean;
```

Defined in: @gramota/credential-format/dist/types.d.ts:31

True iff `format` is in [formats](#formats-1). Strict equality.

###### Parameters

###### format

`string`

###### Returns

`boolean`

***

### IssuanceCapableHandler

Defined in: @gramota/credential-format/dist/types.d.ts:41

Issuance capability — the handler can validate a token returned by an
OID4VCI credential endpoint of this format.

Implemented by `SdJwtVcFormatHandler` (validates compact-serialized
SD-JWT-VC). Future `MDocFormatHandler` would validate a base64url-
encoded CBOR `IssuerSigned` structure.

#### Extends

- [`CredentialFormatHandler`](#credentialformathandler)

#### Properties

##### formats

```ts
readonly formats: readonly string[];
```

Defined in: @gramota/credential-format/dist/types.d.ts:29

Format identifiers this handler claims, e.g. ["vc+sd-jwt", "dc+sd-jwt"].

###### Inherited from

[`CredentialFormatHandler`](#credentialformathandler).[`formats`](#formats-1)

##### canReceiveIssuance

```ts
readonly canReceiveIssuance: true;
```

Defined in: @gramota/credential-format/dist/types.d.ts:43

Brand bit — see file header.

#### Methods

##### supports()

```ts
supports(format: string): boolean;
```

Defined in: @gramota/credential-format/dist/types.d.ts:31

True iff `format` is in [formats](#formats-1). Strict equality.

###### Parameters

###### format

`string`

###### Returns

`boolean`

###### Inherited from

[`CredentialFormatHandler`](#credentialformathandler).[`supports`](#supports-1)

##### validateIssuanceToken()

```ts
validateIssuanceToken(token: string): void;
```

Defined in: @gramota/credential-format/dist/types.d.ts:51

Validate a credential token returned by an OID4VCI credential
endpoint. Throws if the token is malformed for this format.

Pre-condition: caller has already confirmed the token's format
matches `this.formats` via the registry.

###### Parameters

###### token

`string`

###### Returns

`void`

## Type Aliases

### CredentialFormatErrorCode

```ts
type CredentialFormatErrorCode = 
  | "credential_format.unknown_format"
  | "credential_format.duplicate_format"
  | "credential_format.capability_missing"
  | "credential_format.invalid_token";
```

Defined in: @gramota/credential-format/dist/types.d.ts:53

## Functions

### createDefaultCredentialFormatRegistry()

```ts
function createDefaultCredentialFormatRegistry(): CredentialFormatRegistry;
```

Defined in: @gramota/credential-format/dist/default-registry.d.ts:10

Build a registry pre-populated with the SD-JWT-VC handler.

  const registry = createDefaultCredentialFormatRegistry()
    .register(new MyCustomHandler());

Returns a new instance every call — never share state across consumers.

#### Returns

[`CredentialFormatRegistry`](#credentialformatregistry)

***

### hasIssuanceCapability()

```ts
function hasIssuanceCapability(handler: CredentialFormatHandler): handler is IssuanceCapableHandler;
```

Defined in: @gramota/credential-format/dist/types.d.ts:61

#### Parameters

##### handler

[`CredentialFormatHandler`](#credentialformathandler)

#### Returns

`handler is IssuanceCapableHandler`
