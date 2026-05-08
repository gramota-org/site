---
title: "@gramota/qr"
slug: api/qr
description: "QR-code rendering for EUDIW deep links — Strategy-pluggable renderer, lazy / memoised result class."
section: API reference
order: 4
---

# @gramota/qr

> QR-code rendering for EUDIW deep links — Strategy-pluggable renderer, lazy / memoised result class.

Install: `pnpm add @gramota/qr`

Source: [github.com/gramota-org/gramota/tree/main/packages/qr](https://github.com/gramota-org/gramota/tree/main/packages/qr)

## Classes

### QrClient

Defined in: @gramota/qr/dist/client.d.ts:12

`@gramota/qr` public API.

Two patterns work — pick whichever fits:

  1. **Default singleton** (zero config):
     ```ts
     import { qr } from "@gramota/qr";
     const code = qr.fromUrl("openid4vp://…");
     ```

  2. **Custom client** (custom renderer, default options):
     ```ts
     import { QrClient } from "@gramota/qr";
     const qr = new QrClient({ errorCorrection: "H", width: 512 });
     const code = qr.fromUrl("openid4vp://…");
     ```

Tree-shakers can also import the named factories directly
(`fromUrl`, `fromAuthorizationRequest`, `fromCredentialOffer`) —
they delegate to the singleton.

#### Constructors

##### Constructor

```ts
new QrClient(options?: QrClientOptions): QrClient;
```

Defined in: @gramota/qr/dist/client.d.ts:15

###### Parameters

###### options?

[`QrClientOptions`](#qrclientoptions)

###### Returns

[`QrClient`](#qrclient)

#### Methods

##### fromUrl()

```ts
fromUrl(url: string, options?: QrOptions): QrCode;
```

Defined in: @gramota/qr/dist/client.d.ts:28

Render any URL as a QR code.

###### Parameters

###### url

`string`

###### options?

[`QrOptions`](#qroptions)

###### Returns

[`QrCode`](#qrcode)

###### Example

```ts
const code = qr.fromUrl("openid4vp://?client_id=…");
const dataUrl = await code.toDataUrl();
```

###### Throws

[QrError](#qrerror) with `qr.invalid_url` if the input isn't a
  non-empty string with a `<scheme>:` prefix.

##### fromAuthorizationRequest()

```ts
fromAuthorizationRequest(request: AuthorizationRequest, options?: QrOptions & {
  scheme?: string;
}): QrCode;
```

Defined in: @gramota/qr/dist/client.d.ts:34

Render an OID4VP AuthorizationRequest as a QR code. Default
scheme is `openid4vp://`. Override via `{ scheme }` for HAIP /
country-specific wallet schemes.

###### Parameters

###### request

`AuthorizationRequest`

###### options?

[`QrOptions`](#qroptions) & \{
  `scheme?`: `string`;
\}

###### Returns

[`QrCode`](#qrcode)

##### fromCredentialOffer()

```ts
fromCredentialOffer(offer: CredentialOffer, options?: QrOptions & {
  scheme?: string;
}): QrCode;
```

Defined in: @gramota/qr/dist/client.d.ts:41

Render an OID4VCI CredentialOffer as a QR code. Default
scheme is `openid-credential-offer://` per OID4VCI §4.1.

###### Parameters

###### offer

`CredentialOffer`

###### options?

[`QrOptions`](#qroptions) & \{
  `scheme?`: `string`;
\}

###### Returns

[`QrCode`](#qrcode)

***

### QrCode

Defined in: @gramota/qr/dist/qr-code.d.ts:15

#### Constructors

##### Constructor

```ts
new QrCode(
   url: string, 
   renderer: QrRenderer, 
   options?: QrOptions): QrCode;
```

Defined in: @gramota/qr/dist/qr-code.d.ts:24

**`Internal`**

— construct via the [qr](#qr) factories, not directly.

###### Parameters

###### url

`string`

###### renderer

[`QrRenderer`](#qrrenderer)

###### options?

[`QrOptions`](#qroptions)

###### Returns

[`QrCode`](#qrcode)

#### Properties

##### url

```ts
readonly url: string;
```

Defined in: @gramota/qr/dist/qr-code.d.ts:17

The URL encoded in the QR matrix — exactly what scanners will read.

#### Methods

##### toDataUrl()

```ts
toDataUrl(): Promise<string>;
```

Defined in: @gramota/qr/dist/qr-code.d.ts:30

PNG as a `data:image/png;base64,…` URL — drop directly into an
`<img src>` attribute. Best for fast inline rendering in HTML
emails and dashboards.

###### Returns

`Promise`\<`string`\>

##### toSvg()

```ts
toSvg(): Promise<string>;
```

Defined in: @gramota/qr/dist/qr-code.d.ts:35

Raw SVG markup — drop into `innerHTML` (or Angular `[innerHTML]`).
Scales without quality loss, good for print and high-DPI screens.

###### Returns

`Promise`\<`string`\>

##### toPng()

```ts
toPng(): Promise<Uint8Array<ArrayBuffer>>;
```

Defined in: @gramota/qr/dist/qr-code.d.ts:41

Raw PNG bytes — `Uint8Array` for portability (Node `Buffer`
extends it). Use for `fs.writeFile`, multipart uploads, and
binary-channel transports.

###### Returns

`Promise`\<`Uint8Array`\<`ArrayBuffer`\>\>

***

### DefaultQrRenderer

Defined in: @gramota/qr/dist/renderer.d.ts:29

Default renderer — Adapter (GoF) over the `qrcode` npm package.

Maps our [QrOptions](#qroptions) shape onto `qrcode`'s, dispatches based
on `format`, and surfaces failures as [QrError](#qrerror). Swappable
via [QrRenderer](#qrrenderer): anyone with stricter requirements
(Trust-on-first-use logo embedding, brand-coloured QR with a styled
data-pattern, etc.) writes their own implementation.

#### Implements

- [`QrRenderer`](#qrrenderer)

#### Constructors

##### Constructor

```ts
new DefaultQrRenderer(): DefaultQrRenderer;
```

###### Returns

[`DefaultQrRenderer`](#defaultqrrenderer)

#### Methods

##### render()

```ts
render(
   url: string, 
   format: QrFormat, 
options: QrOptions): Promise<string | Uint8Array<ArrayBuffer>>;
```

Defined in: @gramota/qr/dist/renderer.d.ts:30

Render the given URL as a QR code in `format`.

Return type depends on `format`:
  - `"dataUrl"` → `string` (a `data:image/png;base64,...` URL)
  - `"svg"` → `string` (the raw `<svg>...</svg>` markup)
  - `"png"` → `Uint8Array` (raw PNG bytes — `Buffer` in Node, but
    typed as `Uint8Array` so this is portable).

Throw [QrError](#qrerror) with `qr.unsupported_format` if the
renderer can't produce the requested format, or
`qr.render_failed` for any other failure.

###### Parameters

###### url

`string`

###### format

[`QrFormat`](#qrformat)

###### options

[`QrOptions`](#qroptions)

###### Returns

`Promise`\<`string` \| `Uint8Array`\<`ArrayBuffer`\>\>

###### Implementation of

[`QrRenderer`](#qrrenderer).[`render`](#render)

***

### QrError

Defined in: @gramota/qr/dist/types.d.ts:29

Errors thrown anywhere in `@gramota/qr` carry one of these codes
plus a free-form message. Caught upstream, the code is stable
across releases — log it in audit trails, branch on it in handlers.

#### Extends

- `GramotaError`

#### Constructors

##### Constructor

```ts
new QrError(
   code: QrErrorCode, 
   message: string, 
   options?: {
  cause?: unknown;
}): QrError;
```

Defined in: @gramota/qr/dist/types.d.ts:31

###### Parameters

###### code

[`QrErrorCode`](#qrerrorcode)

###### message

`string`

###### options?

###### cause?

`unknown`

###### Returns

[`QrError`](#qrerror)

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
readonly code: QrErrorCode;
```

Defined in: @gramota/qr/dist/types.d.ts:30

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

### QrClientOptions

Defined in: @gramota/qr/dist/client.d.ts:7

Construction-time options for [QrClient](#qrclient).

#### Extends

- [`QrOptions`](#qroptions)

#### Properties

##### renderer?

```ts
readonly optional renderer?: QrRenderer;
```

Defined in: @gramota/qr/dist/client.d.ts:10

Override the rendering Strategy. Defaults to a singleton
[DefaultQrRenderer](#defaultqrrenderer) backed by the `qrcode` npm package.

##### width?

```ts
readonly optional width?: number;
```

Defined in: @gramota/qr/dist/types.d.ts:44

Pixel width of the rendered QR. PNG uses this directly; SVG
scales to fit. Default: 300.

###### Inherited from

[`QrOptions`](#qroptions).[`width`](#width-1)

##### margin?

```ts
readonly optional margin?: number;
```

Defined in: @gramota/qr/dist/types.d.ts:46

Quiet-zone modules around the matrix. Default: 1.

###### Inherited from

[`QrOptions`](#qroptions).[`margin`](#margin-1)

##### colors?

```ts
readonly optional colors?: {
  dark?: string;
  light?: string;
};
```

Defined in: @gramota/qr/dist/types.d.ts:49

Foreground / background colours. CSS colour strings (e.g.
`"#0b1220"`). Default: black on white.

###### dark?

```ts
readonly optional dark?: string;
```

###### light?

```ts
readonly optional light?: string;
```

###### Inherited from

[`QrOptions`](#qroptions).[`colors`](#colors-1)

##### errorCorrection?

```ts
readonly optional errorCorrection?: "L" | "M" | "Q" | "H";
```

Defined in: @gramota/qr/dist/types.d.ts:57

Reed-Solomon error-correction level. Higher = more redundant
data, larger matrix, more tolerant of dirt / partial occlusion.
Default: `"M"` (15% recovery — the QR-spec recommendation for
general use).

###### Inherited from

[`QrOptions`](#qroptions).[`errorCorrection`](#errorcorrection-1)

***

### QrRenderer

Defined in: @gramota/qr/dist/renderer.d.ts:4

Strategy interface. Implementations decide HOW to render; the
orchestrator decides WHEN.

#### Methods

##### render()

```ts
render(
   url: string, 
   format: QrFormat, 
options: QrOptions): Promise<string | Uint8Array<ArrayBuffer>>;
```

Defined in: @gramota/qr/dist/renderer.d.ts:18

Render the given URL as a QR code in `format`.

Return type depends on `format`:
  - `"dataUrl"` → `string` (a `data:image/png;base64,...` URL)
  - `"svg"` → `string` (the raw `<svg>...</svg>` markup)
  - `"png"` → `Uint8Array` (raw PNG bytes — `Buffer` in Node, but
    typed as `Uint8Array` so this is portable).

Throw [QrError](#qrerror) with `qr.unsupported_format` if the
renderer can't produce the requested format, or
`qr.render_failed` for any other failure.

###### Parameters

###### url

`string`

###### format

[`QrFormat`](#qrformat)

###### options

[`QrOptions`](#qroptions)

###### Returns

`Promise`\<`string` \| `Uint8Array`\<`ArrayBuffer`\>\>

***

### QrOptions

Defined in: @gramota/qr/dist/types.d.ts:41

Layout options forwarded to the renderer. Specific renderers may
accept additional knobs (logo embedding, custom corner shapes, …)
via their own constructor options — these four are the universal
subset every renderer is expected to honour.

#### Extended by

- [`QrClientOptions`](#qrclientoptions)

#### Properties

##### width?

```ts
readonly optional width?: number;
```

Defined in: @gramota/qr/dist/types.d.ts:44

Pixel width of the rendered QR. PNG uses this directly; SVG
scales to fit. Default: 300.

##### margin?

```ts
readonly optional margin?: number;
```

Defined in: @gramota/qr/dist/types.d.ts:46

Quiet-zone modules around the matrix. Default: 1.

##### colors?

```ts
readonly optional colors?: {
  dark?: string;
  light?: string;
};
```

Defined in: @gramota/qr/dist/types.d.ts:49

Foreground / background colours. CSS colour strings (e.g.
`"#0b1220"`). Default: black on white.

###### dark?

```ts
readonly optional dark?: string;
```

###### light?

```ts
readonly optional light?: string;
```

##### errorCorrection?

```ts
readonly optional errorCorrection?: "L" | "M" | "Q" | "H";
```

Defined in: @gramota/qr/dist/types.d.ts:57

Reed-Solomon error-correction level. Higher = more redundant
data, larger matrix, more tolerant of dirt / partial occlusion.
Default: `"M"` (15% recovery — the QR-spec recommendation for
general use).

## Type Aliases

### ~~QrFactoryOptions~~

```ts
type QrFactoryOptions = QrClientOptions;
```

Defined in: @gramota/qr/dist/client.d.ts:58

#### Deprecated

alias for [QrClientOptions](#qrclientoptions) — kept for source compat.

***

### QrFormat

```ts
type QrFormat = "dataUrl" | "svg" | "png";
```

Defined in: @gramota/qr/dist/types.d.ts:12

Output formats a [QrRenderer](#qrrenderer) may be asked to produce.

***

### QrErrorCode

```ts
type QrErrorCode = "qr.invalid_url" | "qr.render_failed" | "qr.unsupported_format";
```

Defined in: @gramota/qr/dist/types.d.ts:17

Stable error codes for [QrError](#qrerror). Pinned strings (not
descriptions) so callers can branch on them in switch statements.

## Variables

### qr

```ts
const qr: QrClient;
```

Defined in: @gramota/qr/dist/client.d.ts:53

Default singleton [QrClient](#qrclient) with the default renderer.

Most consumers want this — no construction, no options, just
`qr.fromUrl(deepLink)`. Pass a custom renderer or default options
by constructing your own `new QrClient({...})`.

***

### fromUrl

```ts
const fromUrl: QrClient["fromUrl"];
```

Defined in: @gramota/qr/dist/client.d.ts:54

`@gramota/qr` public API.

Two patterns work — pick whichever fits:

  1. **Default singleton** (zero config):
     ```ts
     import { qr } from "@gramota/qr";
     const code = qr.fromUrl("openid4vp://…");
     ```

  2. **Custom client** (custom renderer, default options):
     ```ts
     import { QrClient } from "@gramota/qr";
     const qr = new QrClient({ errorCorrection: "H", width: 512 });
     const code = qr.fromUrl("openid4vp://…");
     ```

Tree-shakers can also import the named factories directly
(`fromUrl`, `fromAuthorizationRequest`, `fromCredentialOffer`) —
they delegate to the singleton.

***

### fromAuthorizationRequest

```ts
const fromAuthorizationRequest: QrClient["fromAuthorizationRequest"];
```

Defined in: @gramota/qr/dist/client.d.ts:55

`@gramota/qr` public API.

Two patterns work — pick whichever fits:

  1. **Default singleton** (zero config):
     ```ts
     import { qr } from "@gramota/qr";
     const code = qr.fromUrl("openid4vp://…");
     ```

  2. **Custom client** (custom renderer, default options):
     ```ts
     import { QrClient } from "@gramota/qr";
     const qr = new QrClient({ errorCorrection: "H", width: 512 });
     const code = qr.fromUrl("openid4vp://…");
     ```

Tree-shakers can also import the named factories directly
(`fromUrl`, `fromAuthorizationRequest`, `fromCredentialOffer`) —
they delegate to the singleton.

***

### fromCredentialOffer

```ts
const fromCredentialOffer: QrClient["fromCredentialOffer"];
```

Defined in: @gramota/qr/dist/client.d.ts:56

`@gramota/qr` public API.

Two patterns work — pick whichever fits:

  1. **Default singleton** (zero config):
     ```ts
     import { qr } from "@gramota/qr";
     const code = qr.fromUrl("openid4vp://…");
     ```

  2. **Custom client** (custom renderer, default options):
     ```ts
     import { QrClient } from "@gramota/qr";
     const qr = new QrClient({ errorCorrection: "H", width: 512 });
     const code = qr.fromUrl("openid4vp://…");
     ```

Tree-shakers can also import the named factories directly
(`fromUrl`, `fromAuthorizationRequest`, `fromCredentialOffer`) —
they delegate to the singleton.
