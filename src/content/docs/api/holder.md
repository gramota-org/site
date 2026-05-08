---
title: "@gramota/holder"
slug: api/holder
description: "Headless wallet — credential store + import/present/refill operations."
section: API reference
order: 3
---

# @gramota/holder

> Headless wallet — credential store + import/present/refill operations.

Install: `pnpm add @gramota/holder`

Source: [github.com/gramota-org/gramota/tree/main/packages/holder](https://github.com/gramota-org/gramota/tree/main/packages/holder)

## Classes

### Holder

Defined in: @gramota/holder/dist/holder.d.ts:116

#### Constructors

##### Constructor

```ts
new Holder(config: HolderConfig): Holder;
```

Defined in: @gramota/holder/dist/holder.d.ts:129

###### Parameters

###### config

[`HolderConfig`](#holderconfig)

###### Returns

[`Holder`](#holder)

#### Properties

##### credentials

```ts
readonly credentials: CredentialsApi;
```

Defined in: @gramota/holder/dist/holder.d.ts:126

Credential CRUD. `holder.credentials.{receive, list, get, remove}(...)`.

##### offers

```ts
readonly offers: OffersApi;
```

Defined in: @gramota/holder/dist/holder.d.ts:128

OID4VCI offers. `holder.offers.{parse, accept, authorize, claim}(...)`.

#### Accessors

##### publicKey

###### Get Signature

```ts
get publicKey(): JsonWebKey;
```

Defined in: @gramota/holder/dist/holder.d.ts:133

Public key — useful to share with issuers so they can bind credentials.

###### Returns

`JsonWebKey`

#### Methods

##### present()

```ts
present(options: PresentOptions): Promise<string>;
```

Defined in: @gramota/holder/dist/holder.d.ts:131

Build a selective-disclosure presentation against a stored credential.

###### Parameters

###### options

[`PresentOptions`](#presentoptions)

###### Returns

`Promise`\<`string`\>

##### respond()

```ts
respond(requestUrl: string, options?: RespondOptions): Promise<RespondResult>;
```

Defined in: @gramota/holder/dist/holder.d.ts:145

Respond to an OID4VP Authorization Request URL.

The holder:
  1. Parses the URL.
  2. Runs DIF Presentation Exchange against stored credentials.
  3. Builds the presentation with selective disclosure.
  4. Builds the OID4VP authorization response form body.

Returns the body string ready to POST to `response_uri`, plus metadata.

###### Parameters

###### requestUrl

`string`

###### options?

[`RespondOptions`](#respondoptions)

###### Returns

`Promise`\<[`RespondResult`](#respondresult)\>

***

### InMemoryCredentialStore

Defined in: @gramota/holder/dist/store/memory.d.ts:4

Default in-process credential store. Loses data on process exit; use a
persistent implementation for production.

#### Implements

- [`CredentialStore`](#credentialstore)

#### Constructors

##### Constructor

```ts
new InMemoryCredentialStore(): InMemoryCredentialStore;
```

###### Returns

[`InMemoryCredentialStore`](#inmemorycredentialstore)

#### Methods

##### add()

```ts
add(credential: StoredCredential): Promise<void>;
```

Defined in: @gramota/holder/dist/store/memory.d.ts:6

###### Parameters

###### credential

[`StoredCredential`](#storedcredential)

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`CredentialStore`](#credentialstore).[`add`](#add-1)

##### get()

```ts
get(id: string): Promise<StoredCredential>;
```

Defined in: @gramota/holder/dist/store/memory.d.ts:7

###### Parameters

###### id

`string`

###### Returns

`Promise`\<[`StoredCredential`](#storedcredential)\>

###### Implementation of

[`CredentialStore`](#credentialstore).[`get`](#get-2)

##### list()

```ts
list(query?: CredentialQuery): Promise<readonly StoredCredential[]>;
```

Defined in: @gramota/holder/dist/store/memory.d.ts:8

###### Parameters

###### query?

[`CredentialQuery`](#credentialquery)

###### Returns

`Promise`\<readonly [`StoredCredential`](#storedcredential)[]\>

###### Implementation of

[`CredentialStore`](#credentialstore).[`list`](#list-2)

##### remove()

```ts
remove(id: string): Promise<boolean>;
```

Defined in: @gramota/holder/dist/store/memory.d.ts:9

###### Parameters

###### id

`string`

###### Returns

`Promise`\<`boolean`\>

###### Implementation of

[`CredentialStore`](#credentialstore).[`remove`](#remove-2)

***

### HolderError

Defined in: @gramota/holder/dist/types.d.ts:87

#### Extends

- `GramotaError`

#### Constructors

##### Constructor

```ts
new HolderError(
   code: HolderErrorCode, 
   message: string, 
   options?: {
  cause?: unknown;
}): HolderError;
```

Defined in: @gramota/holder/dist/types.d.ts:89

###### Parameters

###### code

[`HolderErrorCode`](#holdererrorcode)

###### message

`string`

###### options?

###### cause?

`unknown`

###### Returns

[`HolderError`](#holdererror)

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
readonly code: HolderErrorCode;
```

Defined in: @gramota/holder/dist/types.d.ts:88

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

### OffersApi

Defined in: @gramota/holder/dist/holder.d.ts:6

Stripe-style sub-API for OID4VCI credential offers. `holder.offers.X(...)`.

#### Methods

##### parse()

```ts
parse(url: string): CredentialOffer;
```

Defined in: @gramota/holder/dist/holder.d.ts:9

Parse a credential offer URL with no network I/O — preview an offer
before deciding to accept it.

###### Parameters

###### url

`string`

###### Returns

`CredentialOffer`

##### accept()

```ts
accept(url: string, options: AcceptOptions): Promise<StoredCredential>;
```

Defined in: @gramota/holder/dist/holder.d.ts:15

Accept a credential offer end-to-end via the pre-authorized code flow:
parse → fetch metadata → token → proof JWT → credential request →
validate → store. Returns the StoredCredential, same shape as
`holder.credentials.receive`. Throws if the offer doesn't include a
pre-authorized_code grant — use `authorize` + `claim` for auth-code.

###### Parameters

###### url

`string`

###### options

[`AcceptOptions`](#acceptoptions)

###### Returns

`Promise`\<[`StoredCredential`](#storedcredential)\>

##### authorize()

```ts
authorize(url: string, options: AuthorizeOptions): Promise<AuthorizeResult>;
```

Defined in: @gramota/holder/dist/holder.d.ts:23

Step 1 of the OID4VCI auth-code flow. Returns the URL the wallet must
navigate the user to, plus PKCE+state secrets to keep until step 2.
The Holder caches flow context (metadata, offer, redirect_uri,
client_id) keyed by `state`, so step 2 only needs the callback +
verifier + state.

###### Parameters

###### url

`string`

###### options

[`AuthorizeOptions`](#authorizeoptions)

###### Returns

`Promise`\<[`AuthorizeResult`](#authorizeresult)\>

##### claim()

```ts
claim(options: ClaimOptions): Promise<StoredCredential>;
```

Defined in: @gramota/holder/dist/holder.d.ts:27

Step 2: exchange the issuer's redirect-callback for a credential,
validate it against `trustedIssuers`, and store it. Looks up the
pending flow by `state` (same value passed to/from `authorize`).

###### Parameters

###### options

[`ClaimOptions`](#claimoptions)

###### Returns

`Promise`\<[`StoredCredential`](#storedcredential)\>

***

### AcceptOptions

Defined in: @gramota/holder/dist/holder.d.ts:31

Options for `holder.offers.accept()`. Extends OID4VCI's accept options
with trustedIssuers (same semantics as credentials.receive).

#### Extends

- `AcceptOfferOptions`

#### Properties

##### trustedIssuers

```ts
trustedIssuers: readonly JsonWebKey[];
```

Defined in: @gramota/holder/dist/holder.d.ts:34

Trusted issuer JWKs the received credential's signature must verify
against. The credential is rejected if it does not.

##### txCode?

```ts
optional txCode?: string;
```

Defined in: .pnpm/@gramota+oid4vci@0.3.0/node\_modules/@gramota/oid4vci/dist/client.d.ts:69

Transaction code (PIN) — supplied when the offer's tx_code requires it.

###### Inherited from

```ts
AcceptOfferOptions.txCode
```

##### credentialConfigurationId?

```ts
optional credentialConfigurationId?: string;
```

Defined in: .pnpm/@gramota+oid4vci@0.3.0/node\_modules/@gramota/oid4vci/dist/client.d.ts:71

Override which credential_configuration_id to request. Default: first.

###### Inherited from

```ts
AcceptOfferOptions.credentialConfigurationId
```

##### proofIat?

```ts
optional proofIat?: number;
```

Defined in: .pnpm/@gramota+oid4vci@0.3.0/node\_modules/@gramota/oid4vci/dist/client.d.ts:73

Override iat in the proof JWT — for tests.

###### Inherited from

```ts
AcceptOfferOptions.proofIat
```

##### fetcher?

```ts
optional fetcher?: Fetcher;
```

Defined in: .pnpm/@gramota+oid4vci@0.3.0/node\_modules/@gramota/oid4vci/dist/client.d.ts:75

Override fetcher per-call.

###### Inherited from

```ts
AcceptOfferOptions.fetcher
```

***

### AuthorizeOptions

Defined in: @gramota/holder/dist/holder.d.ts:37

Options for `holder.offers.authorize()`.

#### Properties

##### redirectUri

```ts
redirectUri: string;
```

Defined in: @gramota/holder/dist/holder.d.ts:40

Where the issuer should redirect the user after consent. Must match
a redirect URI registered with / accepted by the issuer.

##### clientId?

```ts
optional clientId?: string;
```

Defined in: @gramota/holder/dist/holder.d.ts:43

OAuth `client_id`. Defaults to `redirectUri` (a common public-client
pattern when the wallet has no separate registered identifier).

##### credentialConfigurationId?

```ts
optional credentialConfigurationId?: string;
```

Defined in: @gramota/holder/dist/holder.d.ts:45

Override which credential to request. Default: first id from the offer.

##### scope?

```ts
optional scope?: string;
```

Defined in: @gramota/holder/dist/holder.d.ts:47

Optional OAuth scope.

##### codeVerifier?

```ts
optional codeVerifier?: string;
```

Defined in: @gramota/holder/dist/holder.d.ts:49

Optional pre-existing PKCE verifier — for tests. Default: random.

##### state?

```ts
optional state?: string;
```

Defined in: @gramota/holder/dist/holder.d.ts:51

Optional pre-existing CSRF state — for tests. Default: random.

##### fetcher?

```ts
optional fetcher?: Fetcher;
```

Defined in: @gramota/holder/dist/holder.d.ts:53

Optional fetcher override.

***

### AuthorizeResult

Defined in: @gramota/holder/dist/holder.d.ts:56

Result of `holder.offers.authorize()`.

#### Properties

##### authorizationUrl

```ts
authorizationUrl: string;
```

Defined in: @gramota/holder/dist/holder.d.ts:58

Open this URL in the user's browser.

##### codeVerifier

```ts
codeVerifier: string;
```

Defined in: @gramota/holder/dist/holder.d.ts:60

Persist with the user's session — passed to `claim`.

##### state

```ts
state: string;
```

Defined in: @gramota/holder/dist/holder.d.ts:63

Persist and verify against `?state=` on the callback. Doubles as
the lookup key for the pending flow inside the Holder.

***

### ClaimOptions

Defined in: @gramota/holder/dist/holder.d.ts:66

Options for `holder.offers.claim()`.

#### Properties

##### callbackUrl

```ts
callbackUrl: string;
```

Defined in: @gramota/holder/dist/holder.d.ts:68

The full callback URL the issuer redirected to (with ?code=&state=).

##### codeVerifier

```ts
codeVerifier: string;
```

Defined in: @gramota/holder/dist/holder.d.ts:70

From `authorize`'s result.

##### state

```ts
state: string;
```

Defined in: @gramota/holder/dist/holder.d.ts:72

From `authorize`'s result. Used as lookup key for the pending flow.

##### trustedIssuers

```ts
trustedIssuers: readonly JsonWebKey[];
```

Defined in: @gramota/holder/dist/holder.d.ts:74

Trusted issuer JWKs the received credential must verify against.

##### fetcher?

```ts
optional fetcher?: Fetcher;
```

Defined in: @gramota/holder/dist/holder.d.ts:76

Optional fetcher override.

##### proofIat?

```ts
optional proofIat?: number;
```

Defined in: @gramota/holder/dist/holder.d.ts:78

Override iat in the proof JWT — for tests.

***

### RespondOptions

Defined in: @gramota/holder/dist/holder.d.ts:81

Options for `holder.respondTo()`.

#### Properties

##### now?

```ts
optional now?: () => number;
```

Defined in: @gramota/holder/dist/holder.d.ts:83

Override "now" — for tests.

###### Returns

`number`

##### pickCredential?

```ts
optional pickCredential?: (candidates: readonly {
  credential: StoredCredential;
  disclose: readonly string[];
}[]) => {
  credential: StoredCredential;
  disclose: readonly string[];
};
```

Defined in: @gramota/holder/dist/holder.d.ts:86

When the verifier supplies multiple compatible credentials and you want
to control which one is presented, pass a picker. Default: first match.

###### Parameters

###### candidates

readonly \{
  `credential`: [`StoredCredential`](#storedcredential);
  `disclose`: readonly `string`[];
\}[]

###### Returns

```ts
{
  credential: StoredCredential;
  disclose: readonly string[];
}
```

###### credential

```ts
credential: StoredCredential;
```

###### disclose

```ts
disclose: readonly string[];
```

***

### RespondResult

Defined in: @gramota/holder/dist/holder.d.ts:95

Result of `holder.respondTo()`.

#### Properties

##### body

```ts
body: string;
```

Defined in: @gramota/holder/dist/holder.d.ts:97

Form-encoded body to POST to the verifier's `response_uri`.

##### credential

```ts
credential: StoredCredential;
```

Defined in: @gramota/holder/dist/holder.d.ts:99

The matched credential (id + token + parsed).

##### disclosed

```ts
disclosed: readonly string[];
```

Defined in: @gramota/holder/dist/holder.d.ts:101

What was disclosed.

##### request

```ts
request: AuthorizationRequest;
```

Defined in: @gramota/holder/dist/holder.d.ts:103

The original parsed request, for caller logging.

***

### CredentialsApi

Defined in: @gramota/holder/dist/holder.d.ts:106

Stripe-style sub-API for credential CRUD. `holder.credentials.X(...)`.

#### Methods

##### receive()

```ts
receive(token: string, options: ReceiveOptions): Promise<StoredCredential>;
```

Defined in: @gramota/holder/dist/holder.d.ts:108

Validate and store an issued SD-JWT-VC.

###### Parameters

###### token

`string`

###### options

[`ReceiveOptions`](#receiveoptions)

###### Returns

`Promise`\<[`StoredCredential`](#storedcredential)\>

##### get()

```ts
get(id: string): Promise<StoredCredential>;
```

Defined in: @gramota/holder/dist/holder.d.ts:110

Get one stored credential by id.

###### Parameters

###### id

`string`

###### Returns

`Promise`\<[`StoredCredential`](#storedcredential)\>

##### list()

```ts
list(query?: CredentialQuery): Promise<readonly StoredCredential[]>;
```

Defined in: @gramota/holder/dist/holder.d.ts:112

List stored credentials, optionally filtered.

###### Parameters

###### query?

[`CredentialQuery`](#credentialquery)

###### Returns

`Promise`\<readonly [`StoredCredential`](#storedcredential)[]\>

##### remove()

```ts
remove(id: string): Promise<boolean>;
```

Defined in: @gramota/holder/dist/holder.d.ts:114

Remove a credential. Returns true if it existed.

###### Parameters

###### id

`string`

###### Returns

`Promise`\<`boolean`\>

***

### StoredCredential

Defined in: @gramota/holder/dist/types.d.ts:7

A credential the holder has received and validated.

#### Properties

##### id

```ts
id: string;
```

Defined in: @gramota/holder/dist/types.d.ts:8

##### token

```ts
token: string;
```

Defined in: @gramota/holder/dist/types.d.ts:10

The original compact-serialised SD-JWT-VC issuance token.

##### parsed

```ts
parsed: ParsedSdJwt;
```

Defined in: @gramota/holder/dist/types.d.ts:12

Pre-parsed view; pre-computed for faster queries.

##### issuer

```ts
issuer: string;
```

Defined in: @gramota/holder/dist/types.d.ts:14

Issuer identifier, copied out of `iss` for indexed access.

##### receivedAt

```ts
receivedAt: number;
```

Defined in: @gramota/holder/dist/types.d.ts:16

Unix seconds of when the holder accepted this credential.

***

### CredentialQuery

Defined in: @gramota/holder/dist/types.d.ts:19

Optional filter when listing stored credentials.

#### Properties

##### issuer?

```ts
optional issuer?: string;
```

Defined in: @gramota/holder/dist/types.d.ts:20

##### withClaim?

```ts
optional withClaim?: string;
```

Defined in: @gramota/holder/dist/types.d.ts:22

Match credentials that contain a given selectively-disclosable claim.

***

### CredentialStore

Defined in: @gramota/holder/dist/types.d.ts:33

Persistence boundary (Strategy + Repository pattern).

Implementations are interchangeable — `Holder` depends only on this
interface (Dependency Inversion). Default: `InMemoryCredentialStore`.

Future implementations: `FileCredentialStore`, `EncryptedCredentialStore`,
`IndexedDBCredentialStore` (browser).

#### Methods

##### add()

```ts
add(credential: StoredCredential): Promise<void>;
```

Defined in: @gramota/holder/dist/types.d.ts:34

###### Parameters

###### credential

[`StoredCredential`](#storedcredential)

###### Returns

`Promise`\<`void`\>

##### get()

```ts
get(id: string): Promise<StoredCredential>;
```

Defined in: @gramota/holder/dist/types.d.ts:35

###### Parameters

###### id

`string`

###### Returns

`Promise`\<[`StoredCredential`](#storedcredential)\>

##### list()

```ts
list(query?: CredentialQuery): Promise<readonly StoredCredential[]>;
```

Defined in: @gramota/holder/dist/types.d.ts:36

###### Parameters

###### query?

[`CredentialQuery`](#credentialquery)

###### Returns

`Promise`\<readonly [`StoredCredential`](#storedcredential)[]\>

##### remove()

```ts
remove(id: string): Promise<boolean>;
```

Defined in: @gramota/holder/dist/types.d.ts:37

###### Parameters

###### id

`string`

###### Returns

`Promise`\<`boolean`\>

***

### ReceiveOptions

Defined in: @gramota/holder/dist/types.d.ts:68

#### Properties

##### trustedIssuers

```ts
trustedIssuers: readonly JsonWebKey[];
```

Defined in: @gramota/holder/dist/types.d.ts:71

Public JWKs of issuers the holder trusts. The credential's signature
must verify against at least one.

***

### PresentOptions

Defined in: @gramota/holder/dist/types.d.ts:73

#### Properties

##### credentialId

```ts
credentialId: string;
```

Defined in: @gramota/holder/dist/types.d.ts:74

##### disclose

```ts
disclose: readonly string[];
```

Defined in: @gramota/holder/dist/types.d.ts:77

Names of object claims to selectively disclose. All must be available
in the credential. To disclose nothing, pass `[]`.

##### audience

```ts
audience: string;
```

Defined in: @gramota/holder/dist/types.d.ts:79

Verifier identifier — bound into the KB-JWT's `aud` claim.

##### nonce

```ts
nonce: string;
```

Defined in: @gramota/holder/dist/types.d.ts:81

Verifier challenge — bound into the KB-JWT's `nonce` claim.

##### now?

```ts
optional now?: () => number;
```

Defined in: @gramota/holder/dist/types.d.ts:83

Override "now" — for tests.

###### Returns

`number`

## Type Aliases

### CredentialId

```ts
type CredentialId = string;
```

Defined in: @gramota/holder/dist/types.d.ts:5

Identifier of a stored credential. UUID v4, generated at receive time.

***

### HolderConfig

```ts
type HolderConfig = HolderSignerInput & {
  store?: CredentialStore;
};
```

Defined in: @gramota/holder/dist/types.d.ts:64

Configuration for a Holder instance.

#### Type Declaration

##### store?

```ts
optional store?: CredentialStore;
```

Storage backend. Default: in-memory (lost on process exit).

***

### HolderErrorCode

```ts
type HolderErrorCode = 
  | "holder.invalid_input"
  | "holder.malformed_token"
  | "holder.no_trusted_issuers"
  | "holder.issuer_signature_invalid"
  | "holder.disclosure_forged"
  | "holder.cnf_missing"
  | "holder.cnf_mismatch"
  | "holder.credential_not_found"
  | "holder.disclosure_unavailable"
  | "holder.pd_unsatisfiable"
  | "holder.pd_required"
  | "holder.multi_credential_unsupported"
  | "holder.unknown_flow";
```

Defined in: @gramota/holder/dist/types.d.ts:86

Stable codes for `HolderError`.
