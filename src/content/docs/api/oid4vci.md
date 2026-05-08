---
title: "@gramota/oid4vci"
slug: api/oid4vci
description: "OID4VCI client + server — Draft 13/15 normalized, PAR, DPoP both sides."
section: API reference
order: 6
---

# @gramota/oid4vci

> OID4VCI client + server — Draft 13/15 normalized, PAR, DPoP both sides.

Install: `pnpm add @gramota/oid4vci`

Source: [github.com/gramota-org/gramota/tree/main/packages/oid4vci](https://github.com/gramota-org/gramota/tree/main/packages/oid4vci)

## Classes

### Oid4vciClient

Defined in: @gramota/oid4vci/dist/client.d.ts:98

High-level OID4VCI client. The Holder uses this to receive credentials
from issuers; advanced users can construct it directly.

Flow (pre-authorized code):
  1. parseCredentialOffer(url) → offer
  2. fetchIssuerMetadata(offer.credential_issuer) → metadata
  3. requestToken(metadata, offer, opts) → access_token + c_nonce
  4. buildProofJwt(holderKey, audience, c_nonce) → proof
  5. requestCredential(metadata, accessToken, proof) → credential string

#### Constructors

##### Constructor

```ts
new Oid4vciClient(config: Oid4vciClientConfig): Oid4vciClient;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:115

###### Parameters

###### config

[`Oid4vciClientConfig`](#oid4vciclientconfig)

###### Returns

[`Oid4vciClient`](#oid4vciclient)

#### Methods

##### parseOffer()

```ts
parseOffer(url: string): CredentialOffer;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:124

Pure: parse a credential offer URL without any network I/O.

###### Parameters

###### url

`string`

###### Returns

[`CredentialOffer`](#credentialoffer)

##### acceptOffer()

```ts
acceptOffer(url: string, options?: AcceptOfferOptions): Promise<AcceptOfferResult>;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:126

Run the full pre-authorized code flow against the issuer in the offer.

###### Parameters

###### url

`string`

###### options?

[`AcceptOfferOptions`](#acceptofferoptions)

###### Returns

`Promise`\<[`AcceptOfferResult`](#acceptofferresult)\>

##### authorize()

```ts
authorize(offerUrl: string, options: AuthorizeOfferOptions): Promise<AuthorizeOfferResult>;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:134

Step 1 of OID4VCI auth-code flow.

Parses the offer, fetches issuer metadata, generates PKCE + state,
builds the URL the wallet must navigate the user to. Returns the
URL plus secrets the wallet must keep until step 2.

###### Parameters

###### offerUrl

`string`

###### options

[`AuthorizeOfferOptions`](#authorizeofferoptions)

###### Returns

`Promise`\<[`AuthorizeOfferResult`](#authorizeofferresult)\>

##### claim()

```ts
claim(options: ClaimOfferOptions): Promise<AcceptOfferResult>;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:142

Step 2 of OID4VCI auth-code flow.

Given the issuer's redirect-callback URL plus the secrets returned by
`authorize`, exchange the code for a token, build a proof JWT, request
the credential, and return the credential string + metadata.

###### Parameters

###### options

[`ClaimOfferOptions`](#claimofferoptions)

###### Returns

`Promise`\<[`AcceptOfferResult`](#acceptofferresult)\>

***

### ParAuthorizationTransport

Defined in: @gramota/oid4vci/dist/transport.d.ts:64

Pushed Authorization Requests per RFC 9126.

Default for `Oid4vciClient`. Required by the EU dev issuer's
`wallet-dev` client. Refuses if the AS doesn't advertise a
`pushed_authorization_request_endpoint` — fail loudly, don't silently
leak parameters to a less-secure transport.

#### Implements

- [`AuthorizationTransport`](#authorizationtransport)

#### Constructors

##### Constructor

```ts
new ParAuthorizationTransport(): ParAuthorizationTransport;
```

###### Returns

[`ParAuthorizationTransport`](#parauthorizationtransport)

#### Methods

##### deliver()

```ts
deliver(input: DeliverInput): Promise<string>;
```

Defined in: @gramota/oid4vci/dist/transport.d.ts:65

Deliver the authorization request to the AS, return the URL the
wallet should navigate the user to.

###### Parameters

###### input

[`DeliverInput`](#deliverinput)

###### Returns

`Promise`\<`string`\>

###### Implementation of

[`AuthorizationTransport`](#authorizationtransport).[`deliver`](#deliver)

***

### DirectAuthorizationTransport

Defined in: @gramota/oid4vci/dist/transport.d.ts:84

Direct authorization-URL transport per RFC 6749 §4.1.1.

The classic OAuth path: every param is encoded on the authorization-
endpoint URL. Used by simpler issuers that don't support PAR.

NOT the default. Pass an instance via `Oid4vciClientConfig.authorizationTransport`
to opt in:

    new Oid4vciClient({
      ...,
      authorizationTransport: new DirectAuthorizationTransport(),
    });

Trade-off: parameters are visible in browser history, server logs, and
referer headers. Prefer PAR when the AS supports it.

#### Implements

- [`AuthorizationTransport`](#authorizationtransport)

#### Constructors

##### Constructor

```ts
new DirectAuthorizationTransport(): DirectAuthorizationTransport;
```

###### Returns

[`DirectAuthorizationTransport`](#directauthorizationtransport)

#### Methods

##### deliver()

```ts
deliver(input: DeliverInput): Promise<string>;
```

Defined in: @gramota/oid4vci/dist/transport.d.ts:85

Deliver the authorization request to the AS, return the URL the
wallet should navigate the user to.

###### Parameters

###### input

[`DeliverInput`](#deliverinput)

###### Returns

`Promise`\<`string`\>

###### Implementation of

[`AuthorizationTransport`](#authorizationtransport).[`deliver`](#deliver)

***

### Oid4vciError

Defined in: @gramota/oid4vci/dist/types.d.ts:154

#### Extends

- `GramotaError`

#### Constructors

##### Constructor

```ts
new Oid4vciError(
   code: Oid4vciErrorCode, 
   message: string, 
   options?: {
  cause?: unknown;
}): Oid4vciError;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:156

###### Parameters

###### code

[`Oid4vciErrorCode`](#oid4vcierrorcode)

###### message

`string`

###### options?

###### cause?

`unknown`

###### Returns

[`Oid4vciError`](#oid4vcierror)

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
readonly code: Oid4vciErrorCode;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:155

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

### FetcherResponse

Defined in: .pnpm/@gramota+core@0.2.0/node\_modules/@gramota/core/dist/fetcher.d.ts:35

Subset of the Web `Response` shape that Gramota libraries actually
consume.

Both `json()` and `text()` are required — every real-world `fetch`
impl (Web platform, undici, node-fetch) supplies both, and forcing
adapters to implement both keeps library call sites clean (no
`if (!response.text) throw` guards on the hot path). Test mocks
use the mockFetcherResponse helper to satisfy the contract
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

### BuildAuthorizationUrlOptions

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:6

#### Properties

##### authorizationEndpoint

```ts
authorizationEndpoint: string;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:9

Authorization server's `authorization_endpoint` — resolve via
`fetchAuthorizationServerMetadata` to handle delegated AS correctly.

##### clientId

```ts
clientId: string;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:11

OAuth `client_id`. Often the wallet's identifier or a registered ID.

##### redirectUri

```ts
redirectUri: string;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:13

Where the issuer should redirect after consent.

##### credentialConfigurationId

```ts
credentialConfigurationId: string;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:15

Credential configuration id from the offer / metadata.

##### codeVerifier?

```ts
optional codeVerifier?: string;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:17

Optional pre-existing PKCE verifier — useful for tests. Default: random.

##### state?

```ts
optional state?: string;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:19

Optional pre-existing CSRF state — useful for tests. Default: random.

##### scope?

```ts
optional scope?: string;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:21

OAuth scope (alternative/companion to authorization_details).

##### issuerState?

```ts
optional issuerState?: string;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:23

OID4VCI `issuer_state` parameter from the offer (optional).

***

### BuiltAuthorizationUrl

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:25

#### Properties

##### authorizationUrl

```ts
authorizationUrl: string;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:27

Send the user here.

##### codeVerifier

```ts
codeVerifier: string;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:29

Keep this — needed for `requestTokenAuthCode`. NEVER expose to issuer.

##### state

```ts
state: string;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:31

Verify against `?state=` on the callback to prevent CSRF.

***

### PushAuthorizationRequestOptions

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:59

#### Properties

##### parEndpoint

```ts
parEndpoint: string;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:61

AS's `pushed_authorization_request_endpoint` from its metadata.

##### params

```ts
params: Readonly<Record<string, string>>;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:64

Every authorization parameter, exactly as it would have appeared on
the auth URL. PAR is a transport substitution, not a content change.

##### fetcher?

```ts
optional fetcher?: Fetcher;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:66

Optional fetcher override.

***

### PushAuthorizationRequestResult

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:68

#### Properties

##### requestUri

```ts
requestUri: string;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:71

The opaque URN the AS bound our parameters to. The wallet redirects
the user with this in `?request_uri=` per RFC 9126 §4.

##### expiresIn?

```ts
optional expiresIn?: number;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:74

AS's recommended freshness window for `request_uri`. RFC 9126 §2.2
RECOMMENDS but doesn't require it.

***

### RequestTokenAuthCodeOptions

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:88

#### Properties

##### tokenEndpoint

```ts
tokenEndpoint: string;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:90

Token endpoint URL — typically `resolveTokenEndpoint(metadata)`.

##### code

```ts
code: string;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:92

Authorization code from the issuer's redirect.

##### codeVerifier

```ts
codeVerifier: string;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:94

PKCE verifier saved from `buildAuthorizationUrl`.

##### redirectUri

```ts
redirectUri: string;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:96

Same redirect_uri sent in the auth request — issuer enforces match.

##### clientId

```ts
clientId: string;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:98

Same client_id used in the auth request.

##### fetcher?

```ts
optional fetcher?: Fetcher;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:100

Optional fetcher override.

##### dpopSigner?

```ts
optional dpopSigner?: Signer;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:102

When set, attach a DPoP proof (RFC 9449) to the token request.

***

### ParsedAuthCallback

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:111

Parse a callback URL from the issuer's redirect: extract `code`, `state`,
and any error params. Throws on error responses.

#### Properties

##### code

```ts
code: string;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:112

##### state

```ts
state: string;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:113

##### issuerState?

```ts
optional issuerState?: string;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:115

OID4VCI may pass through this when the offer included issuer_state.

***

### AcceptOfferOptions

Defined in: @gramota/oid4vci/dist/client.d.ts:67

#### Properties

##### txCode?

```ts
optional txCode?: string;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:69

Transaction code (PIN) — supplied when the offer's tx_code requires it.

##### credentialConfigurationId?

```ts
optional credentialConfigurationId?: string;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:71

Override which credential_configuration_id to request. Default: first.

##### proofIat?

```ts
optional proofIat?: number;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:73

Override iat in the proof JWT — for tests.

##### fetcher?

```ts
optional fetcher?: Fetcher;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:75

Override fetcher per-call.

***

### AcceptOfferResult

Defined in: @gramota/oid4vci/dist/client.d.ts:77

#### Properties

##### credential

```ts
credential: string;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:79

The compact-serialised credential string the issuer returned.

##### credentialConfigurationId

```ts
credentialConfigurationId: string;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:81

The credential_configuration_id that was requested.

##### metadata

```ts
metadata: IssuerMetadata;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:83

Issuer metadata fetched during the flow.

##### offer

```ts
offer: CredentialOffer;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:85

Original parsed offer.

***

### AuthorizeOfferOptions

Defined in: @gramota/oid4vci/dist/client.d.ts:150

#### Properties

##### clientId

```ts
clientId: string;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:152

OAuth client_id — registered with the issuer or the wallet's identifier.

##### redirectUri

```ts
redirectUri: string;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:154

Where the issuer should redirect the user after consent.

##### credentialConfigurationId?

```ts
optional credentialConfigurationId?: string;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:156

Override which credential to request. Default: first id from the offer.

##### codeVerifier?

```ts
optional codeVerifier?: string;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:158

Optional pre-existing PKCE verifier — for tests. Default: random.

##### state?

```ts
optional state?: string;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:160

Optional pre-existing CSRF state — for tests. Default: random.

##### scope?

```ts
optional scope?: string;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:162

Optional OAuth scope.

##### fetcher?

```ts
optional fetcher?: Fetcher;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:164

Optional fetcher override per-call.

***

### AuthorizeOfferResult

Defined in: @gramota/oid4vci/dist/client.d.ts:166

#### Properties

##### authorizationUrl

```ts
authorizationUrl: string;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:168

Open this URL in the user's browser.

##### codeVerifier

```ts
codeVerifier: string;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:170

Persist this with the user's session — needed for `claim`.

##### state

```ts
state: string;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:172

Persist this and verify against `?state=` on the callback.

##### offer

```ts
offer: CredentialOffer;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:174

Carry these to step 2 unchanged.

##### metadata

```ts
metadata: IssuerMetadata;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:175

##### authorizationServerMetadata

```ts
authorizationServerMetadata: AuthorizationServerMetadata;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:178

Authorization server metadata resolved per OID4VCI §11.2.2. The token
endpoint here is what `claim` exchanges the code against.

##### credentialConfigurationId

```ts
credentialConfigurationId: string;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:179

***

### ClaimOfferOptions

Defined in: @gramota/oid4vci/dist/client.d.ts:181

#### Properties

##### callbackUrl

```ts
callbackUrl: string;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:183

The full callback URL the issuer redirected to (with ?code=&state=).

##### codeVerifier

```ts
codeVerifier: string;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:185

From step 1's AuthorizeOfferResult.

##### state

```ts
state: string;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:186

##### metadata

```ts
metadata: IssuerMetadata;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:187

##### authorizationServerMetadata

```ts
authorizationServerMetadata: AuthorizationServerMetadata;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:188

##### offer

```ts
offer: CredentialOffer;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:189

##### credentialConfigurationId

```ts
credentialConfigurationId: string;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:190

##### redirectUri

```ts
redirectUri: string;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:192

Same redirect_uri / client_id used at step 1 — issuer enforces match.

##### clientId

```ts
clientId: string;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:193

##### fetcher?

```ts
optional fetcher?: Fetcher;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:195

Optional fetcher override per-call.

##### proofIat?

```ts
optional proofIat?: number;
```

Defined in: @gramota/oid4vci/dist/client.d.ts:197

Override iat in the proof JWT — for tests.

***

### RequestCredentialOptions

Defined in: @gramota/oid4vci/dist/credential.d.ts:4

#### Properties

##### credentialEndpoint

```ts
credentialEndpoint: string;
```

Defined in: @gramota/oid4vci/dist/credential.d.ts:5

##### accessToken

```ts
accessToken: string;
```

Defined in: @gramota/oid4vci/dist/credential.d.ts:6

##### request

```ts
request: CredentialRequest;
```

Defined in: @gramota/oid4vci/dist/credential.d.ts:8

Either `credential_configuration_id` (preferred) or `format`+`vct`.

##### fetcher?

```ts
optional fetcher?: Fetcher;
```

Defined in: @gramota/oid4vci/dist/credential.d.ts:9

##### dpopSigner?

```ts
optional dpopSigner?: Signer;
```

Defined in: @gramota/oid4vci/dist/credential.d.ts:13

When set, the request is sent as `Authorization: DPoP <token>` with
a DPoP proof JWT (RFC 9449) bound to the access token via the `ath`
claim. The proof is signed by this signer.

***

### BuildDpopJwtOptions

Defined in: @gramota/oid4vci/dist/dpop.d.ts:26

#### Properties

##### signer

```ts
signer: Signer;
```

Defined in: @gramota/oid4vci/dist/dpop.d.ts:29

Wallet's signer — produces the proof signature. The signer's
publicKey is embedded in the JWS header so verifiers can match.

##### htm

```ts
htm: "GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "OPTIONS" | "PATCH";
```

Defined in: @gramota/oid4vci/dist/dpop.d.ts:31

HTTP method (must match the request being made).

##### htu

```ts
htu: string;
```

Defined in: @gramota/oid4vci/dist/dpop.d.ts:33

HTTP target URI. Query + fragment are stripped per RFC 9449 §4.2.

##### iat?

```ts
optional iat?: number;
```

Defined in: @gramota/oid4vci/dist/dpop.d.ts:35

Override iat — for tests. Default: now.

##### jti?

```ts
optional jti?: string;
```

Defined in: @gramota/oid4vci/dist/dpop.d.ts:37

Override jti — for tests. Default: random.

##### accessToken?

```ts
optional accessToken?: string;
```

Defined in: @gramota/oid4vci/dist/dpop.d.ts:41

When set, payload includes `ath = base64url(sha256(accessToken))`
per RFC 9449 §6.1. Only used on resource-server requests, not on
the initial token-endpoint request.

##### nonce?

```ts
optional nonce?: string;
```

Defined in: @gramota/oid4vci/dist/dpop.d.ts:44

Server-supplied nonce (RFC 9449 §8). When the AS/RS returns
`DPoP-Nonce: <value>`, retry with the value here.

***

### VerifyDpopJwtOptions

Defined in: @gramota/oid4vci/dist/dpop.d.ts:59

#### Properties

##### jwt

```ts
jwt: string;
```

Defined in: @gramota/oid4vci/dist/dpop.d.ts:61

Compact-serialized DPoP JWT from the inbound `DPoP:` header.

##### htm

```ts
htm: string;
```

Defined in: @gramota/oid4vci/dist/dpop.d.ts:63

HTTP method of the request being authenticated (must equal `htm`).

##### htu

```ts
htu: string;
```

Defined in: @gramota/oid4vci/dist/dpop.d.ts:66

HTTP URL of the request, including scheme + host + path. Query and
fragment are stripped before comparing against `htu` per RFC 9449 §4.2.

##### accessToken?

```ts
optional accessToken?: string;
```

Defined in: @gramota/oid4vci/dist/dpop.d.ts:71

When verifying a resource-server request, the access token whose
sha256 (base64url) must equal the proof's `ath`. Omit on
authorization-server (`/token`) verification — the proof's `ath`
MUST then be absent (§6.1).

##### nonce?

```ts
optional nonce?: string;
```

Defined in: @gramota/oid4vci/dist/dpop.d.ts:74

When the server demands a nonce (RFC 9449 §8), the proof must echo
this exact value in its `nonce` claim.

##### maxAgeSeconds?

```ts
optional maxAgeSeconds?: number;
```

Defined in: @gramota/oid4vci/dist/dpop.d.ts:76

Allowed iat skew in seconds. Default 60.

##### hasSeenJti?

```ts
optional hasSeenJti?: (jti: string) => boolean | Promise<boolean>;
```

Defined in: @gramota/oid4vci/dist/dpop.d.ts:79

Replay-protection callback. Return `true` if the `jti` has been
seen before. Omit to skip replay checks entirely (e.g. tests).

###### Parameters

###### jti

`string`

###### Returns

`boolean` \| `Promise`\<`boolean`\>

##### recordJti?

```ts
optional recordJti?: (jti: string) => void | Promise<void>;
```

Defined in: @gramota/oid4vci/dist/dpop.d.ts:82

Record a successfully-verified `jti` so future calls reject it.
Called only after all other checks pass — never on failure.

###### Parameters

###### jti

`string`

###### Returns

`void` \| `Promise`\<`void`\>

##### now?

```ts
optional now?: number;
```

Defined in: @gramota/oid4vci/dist/dpop.d.ts:84

Clock override for tests, in seconds-since-epoch. Default `Date.now()`.

***

### VerifyDpopJwtResult

Defined in: @gramota/oid4vci/dist/dpop.d.ts:86

#### Properties

##### publicJwk

```ts
publicJwk: JsonWebKey;
```

Defined in: @gramota/oid4vci/dist/dpop.d.ts:89

Public JWK extracted from the proof's JWS header. Caller can use
this to identify the wallet's binding key.

##### jkt

```ts
jkt: string;
```

Defined in: @gramota/oid4vci/dist/dpop.d.ts:93

RFC 7638 thumbprint of `publicJwk`. Used as the `jkt` value when
binding access tokens — issuers store this with the token, then on
resource-server access compare against the next proof's thumbprint.

##### payload

```ts
payload: Readonly<Record<string, unknown>>;
```

Defined in: @gramota/oid4vci/dist/dpop.d.ts:96

Verified payload of the proof. Includes at minimum `jti`, `htm`,
`htu`, `iat`. May include `ath`, `nonce` per the request type.

***

### AuthorizationServerMetadata

Defined in: @gramota/oid4vci/dist/metadata.d.ts:21

Authorization Server metadata. Combines the relevant fields from RFC 8414
(oauth-authorization-server) and OpenID Connect Discovery — both formats
publish the same `authorization_endpoint` / `token_endpoint` we need.

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### issuer

```ts
issuer: string;
```

Defined in: @gramota/oid4vci/dist/metadata.d.ts:22

##### authorization\_endpoint

```ts
authorization_endpoint: string;
```

Defined in: @gramota/oid4vci/dist/metadata.d.ts:23

##### token\_endpoint

```ts
token_endpoint: string;
```

Defined in: @gramota/oid4vci/dist/metadata.d.ts:24

##### pushed\_authorization\_request\_endpoint?

```ts
optional pushed_authorization_request_endpoint?: string;
```

Defined in: @gramota/oid4vci/dist/metadata.d.ts:29

RFC 9126 — when present, the wallet must POST auth params here to
receive a `request_uri`, then redirect with just client_id+request_uri.
Some clients (notably the EU's `wallet-dev`) require PAR per-client
even when the AS-wide policy doesn't enforce it.

##### require\_pushed\_authorization\_requests?

```ts
optional require_pushed_authorization_requests?: boolean;
```

Defined in: @gramota/oid4vci/dist/metadata.d.ts:31

RFC 9126 — when true, the AS rejects auth requests not pushed via PAR.

##### dpop\_signing\_alg\_values\_supported?

```ts
optional dpop_signing_alg_values_supported?: readonly string[];
```

Defined in: @gramota/oid4vci/dist/metadata.d.ts:35

RFC 9449 §5.1 — algorithms the AS accepts for DPoP proofs. When
present and the wallet's signing alg is in the list, our SDK
auto-attaches DPoP proofs to token + credential requests.

##### code\_challenge\_methods\_supported?

```ts
optional code_challenge_methods_supported?: readonly string[];
```

Defined in: @gramota/oid4vci/dist/metadata.d.ts:37

RFC 7636 — must include "S256" for our PKCE-only flow to work.

##### grant\_types\_supported?

```ts
optional grant_types_supported?: readonly string[];
```

Defined in: @gramota/oid4vci/dist/metadata.d.ts:39

Useful for diagnostics — should include "authorization_code".

***

### BuildProofOptions

Defined in: @gramota/oid4vci/dist/proof.d.ts:22

Build a Proof of Possession JWT per OID4VCI §7.2.1.

The wallet signs this JWT with its holder-binding signer. The issuer
uses the embedded `jwk` to bind the issued credential to the holder.

Header:
  - alg: matches the signer
  - typ: "openid4vci-proof+jwt"
  - jwk: the holder's public JWK (the issuer puts this in cnf.jwk)

Payload:
  - aud: the credential_issuer URL (audience binding)
  - iat: now
  - nonce: c_nonce from the issuer's token response (replay protection)

Takes a Signer rather than a raw private JWK so production
wallets can plug in WebAuthn / iOS Secure Enclave / HSM backed signers
that never materialize the private key in JS heap.

#### Properties

##### audience

```ts
audience: string;
```

Defined in: @gramota/oid4vci/dist/proof.d.ts:24

The audience — typically `credentialIssuer` from the metadata.

##### signer

```ts
signer: Signer;
```

Defined in: @gramota/oid4vci/dist/proof.d.ts:27

Holder's signer — produces the proof JWT signature. The signer's
`publicKey` is embedded as the JOSE header `jwk` parameter.

##### nonce?

```ts
optional nonce?: string;
```

Defined in: @gramota/oid4vci/dist/proof.d.ts:30

Optional issuer-supplied nonce (`c_nonce`). Recommended; many
issuers require it.

##### iat?

```ts
optional iat?: number;
```

Defined in: @gramota/oid4vci/dist/proof.d.ts:32

Override iat — for tests.

##### iss?

```ts
optional iss?: string;
```

Defined in: @gramota/oid4vci/dist/proof.d.ts:34

Optional client_id of the wallet — `iss` claim of the proof.

***

### ParseCredentialRequestOptions

Defined in: @gramota/oid4vci/dist/server.d.ts:24

#### Properties

##### body

```ts
body: unknown;
```

Defined in: @gramota/oid4vci/dist/server.d.ts:26

Raw request body (already JSON-parsed).

##### issuerMetadata?

```ts
optional issuerMetadata?: IssuerMetadata;
```

Defined in: @gramota/oid4vci/dist/server.d.ts:31

Issuer metadata — used to look up the format from a
`credential_configuration_id` when the wallet uses Draft 14/15
shape. Optional: if omitted, we accept the request without
format validation as long as the configuration id is set.

***

### RequestTokenOptions

Defined in: @gramota/oid4vci/dist/token.d.ts:6

#### Properties

##### tokenEndpoint

```ts
tokenEndpoint: string;
```

Defined in: @gramota/oid4vci/dist/token.d.ts:7

##### preAuthorizedCode

```ts
preAuthorizedCode: string;
```

Defined in: @gramota/oid4vci/dist/token.d.ts:8

##### txCode?

```ts
optional txCode?: string;
```

Defined in: @gramota/oid4vci/dist/token.d.ts:10

Transaction code (PIN) when the offer requires one.

##### fetcher?

```ts
optional fetcher?: Fetcher;
```

Defined in: @gramota/oid4vci/dist/token.d.ts:11

##### dpopSigner?

```ts
optional dpopSigner?: Signer;
```

Defined in: @gramota/oid4vci/dist/token.d.ts:14

When set, attach a DPoP proof (RFC 9449) to the token request.
The signer is the wallet's holder-binding key.

***

### DeliverInput

Defined in: @gramota/oid4vci/dist/transport.d.ts:30

Inputs every transport needs to deliver an authorization request.

#### Properties

##### authorizationServerMetadata

```ts
authorizationServerMetadata: AuthorizationServerMetadata;
```

Defined in: @gramota/oid4vci/dist/transport.d.ts:32

AS metadata, already resolved (handles §11.2.2 delegation).

##### params

```ts
params: Readonly<Record<string, string>>;
```

Defined in: @gramota/oid4vci/dist/transport.d.ts:35

Canonical authorization parameters — same shape regardless of
transport. The strategy decides how to ship them to the AS.

##### clientId

```ts
clientId: string;
```

Defined in: @gramota/oid4vci/dist/transport.d.ts:38

Caller's client_id. Some transports (PAR) need it for the post-PAR
URL even though it's already in `params`.

##### fetcher?

```ts
optional fetcher?: Fetcher;
```

Defined in: @gramota/oid4vci/dist/transport.d.ts:40

Optional fetcher override.

***

### AuthorizationTransport

Defined in: @gramota/oid4vci/dist/transport.d.ts:51

Strategy interface for delivering authorization requests to the AS.

Implementations decide HOW the params reach the AS; the orchestrator
just calls `deliver()` and gets back the URL to redirect the user to.

Pure: a strategy holds no per-flow state. Multiple flows can share one
instance. Stateless implementations are trivially thread-safe.

#### Methods

##### deliver()

```ts
deliver(input: DeliverInput): Promise<string>;
```

Defined in: @gramota/oid4vci/dist/transport.d.ts:54

Deliver the authorization request to the AS, return the URL the
wallet should navigate the user to.

###### Parameters

###### input

[`DeliverInput`](#deliverinput)

###### Returns

`Promise`\<`string`\>

***

### CredentialOffer

Defined in: @gramota/oid4vci/dist/types.d.ts:19

A Credential Offer the issuer hands to the wallet, typically as a URL
the wallet scans or follows. Per OID4VCI §4.1.

#### Properties

##### credential\_issuer

```ts
credential_issuer: string;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:21

Issuer base URL (used as the audience for proofs).

##### credential\_configuration\_ids

```ts
credential_configuration_ids: readonly string[];
```

Defined in: @gramota/oid4vci/dist/types.d.ts:23

Identifiers of the credential configurations the issuer is offering.

##### grants?

```ts
optional grants?: {
  authorization_code?: {
     issuer_state?: string;
     authorization_server?: string;
  };
  urn:ietf:params:oauth:grant-type:pre-authorized_code?: {
     pre-authorized_code: string;
     tx_code?: TxCodeRequirement;
     authorization_server?: string;
  };
};
```

Defined in: @gramota/oid4vci/dist/types.d.ts:25

Which grant types are available. We support pre-authorized_code only.

###### authorization\_code?

```ts
optional authorization_code?: {
  issuer_state?: string;
  authorization_server?: string;
};
```

###### authorization\_code.issuer\_state?

```ts
optional issuer_state?: string;
```

###### authorization\_code.authorization\_server?

```ts
optional authorization_server?: string;
```

###### urn:ietf:params:oauth:grant-type:pre-authorized\_code?

```ts
optional urn:ietf:params:oauth:grant-type:pre-authorized_code?: {
  pre-authorized_code: string;
  tx_code?: TxCodeRequirement;
  authorization_server?: string;
};
```

###### urn:ietf:params:oauth:grant-type:pre-authorized\_code.pre-authorized\_code

```ts
pre-authorized_code: string;
```

###### urn:ietf:params:oauth:grant-type:pre-authorized\_code.tx\_code?

```ts
optional tx_code?: TxCodeRequirement;
```

###### urn:ietf:params:oauth:grant-type:pre-authorized\_code.authorization\_server?

```ts
optional authorization_server?: string;
```

***

### TxCodeRequirement

Defined in: @gramota/oid4vci/dist/types.d.ts:39

When the issuer requires a transaction code (e.g. PIN), this describes
how the wallet should collect it from the user.

#### Properties

##### input\_mode?

```ts
optional input_mode?: "numeric" | "text";
```

Defined in: @gramota/oid4vci/dist/types.d.ts:40

##### length?

```ts
optional length?: number;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:41

##### description?

```ts
optional description?: string;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:42

***

### IssuerMetadata

Defined in: @gramota/oid4vci/dist/types.d.ts:45

Issuer metadata published at `<issuer>/.well-known/openid-credential-issuer`.

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### credential\_issuer

```ts
credential_issuer: string;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:46

##### credential\_endpoint

```ts
credential_endpoint: string;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:47

##### token\_endpoint?

```ts
optional token_endpoint?: string;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:49

OAuth 2.0 token endpoint. May live on a separate authorization_server.

##### authorization\_servers?

```ts
optional authorization_servers?: readonly string[];
```

Defined in: @gramota/oid4vci/dist/types.d.ts:51

Authorization servers — when token_endpoint isn't on the issuer itself.

##### credential\_configurations\_supported

```ts
credential_configurations_supported: Readonly<Record<string, CredentialConfiguration>>;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:53

Map of configuration id → details. The wallet picks one to request.

##### display?

```ts
optional display?: readonly Readonly<Record<string, unknown>>[];
```

Defined in: @gramota/oid4vci/dist/types.d.ts:55

Display info for the issuer (name, logo, locale).

***

### CredentialConfiguration

Defined in: @gramota/oid4vci/dist/types.d.ts:58

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### format

```ts
format: string;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:60

"vc+sd-jwt" or similar. Must match what we can handle.

##### scope?

```ts
optional scope?: string;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:62

OAuth scope for this credential, when using auth-code flow.

##### cryptographic\_binding\_methods\_supported?

```ts
optional cryptographic_binding_methods_supported?: readonly string[];
```

Defined in: @gramota/oid4vci/dist/types.d.ts:64

"jwk" / "did:..." — for SD-JWT-VC, "jwk" is standard.

##### credential\_signing\_alg\_values\_supported?

```ts
optional credential_signing_alg_values_supported?: readonly string[];
```

Defined in: @gramota/oid4vci/dist/types.d.ts:66

Algorithms the issuer can sign credentials with.

##### proof\_types\_supported?

```ts
optional proof_types_supported?: Readonly<Record<string, {
  proof_signing_alg_values_supported: readonly string[];
}>>;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:68

Proof types the issuer accepts (we use jwt).

##### vct?

```ts
optional vct?: string;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:72

vc+sd-jwt-specific: the credential type identifier.

##### display?

```ts
optional display?: readonly Readonly<Record<string, unknown>>[];
```

Defined in: @gramota/oid4vci/dist/types.d.ts:73

***

### TokenResponse

Defined in: @gramota/oid4vci/dist/types.d.ts:77

Token endpoint response per RFC 6749 + OID4VCI extensions.

#### Properties

##### access\_token

```ts
access_token: string;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:78

##### token\_type

```ts
token_type: 
  | "Bearer"
  | string & {
};
```

Defined in: @gramota/oid4vci/dist/types.d.ts:79

##### expires\_in?

```ts
optional expires_in?: number;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:80

##### c\_nonce?

```ts
optional c_nonce?: string;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:82

Issuer-supplied nonce — bound into the proof JWT.

##### c\_nonce\_expires\_in?

```ts
optional c_nonce_expires_in?: number;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:83

##### scope?

```ts
optional scope?: string;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:84

***

### CredentialRequest

Defined in: @gramota/oid4vci/dist/types.d.ts:97

Credential request payload per OID4VCI §7.2.

The wire format evolved across drafts. We accept any of these shapes
and `parseCredentialRequest` normalises them into a single canonical
form for issuers to consume:

  - **Draft 13 (legacy)**: top-level `format`/`vct`, single `proof`.
  - **Draft 14/15**: `credential_configuration_id` (preferred) or
    `credential_identifier` (Draft 15+ deferred-credential flow), with
    either single `proof` or batch `proofs.jwt[]`.

#### Properties

##### credential\_configuration\_id?

```ts
optional credential_configuration_id?: string;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:99

Draft 14+: identifies a row in `credential_configurations_supported`.

##### credential\_identifier?

```ts
optional credential_identifier?: string;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:101

Draft 15+: server-issued credential identifier (deferred / per-token).

##### format?

```ts
optional format?: string;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:103

Draft 13 (legacy): explicit format string.

##### vct?

```ts
optional vct?: string;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:105

Draft 13 (legacy): vc+sd-jwt type.

##### proof?

```ts
optional proof?: {
  proof_type: "jwt";
  jwt: string;
};
```

Defined in: @gramota/oid4vci/dist/types.d.ts:108

Single proof of possession — Draft 13 form. Wallet signs a JWT
with the cnf-bound key.

###### proof\_type

```ts
proof_type: "jwt";
```

###### jwt

```ts
jwt: string;
```

##### proofs?

```ts
optional proofs?: {
  jwt?: readonly string[];
};
```

Defined in: @gramota/oid4vci/dist/types.d.ts:116

Batch proofs of possession — Draft 14/15 form. The EU wallet
(eudi-lib-jvm-openid4vci-kt 0.9+) sends this. Each entry is a
separate proof JWT for one credential in the batch; for non-batch
issuance the array has length 1.

###### jwt?

```ts
optional jwt?: readonly string[];
```

***

### CredentialResponse

Defined in: @gramota/oid4vci/dist/types.d.ts:139

Credential response per OID4VCI §7.3.

#### Properties

##### credential?

```ts
optional credential?: string;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:141

The credential, format-specific. For vc+sd-jwt this is the SD-JWT-VC string.

##### credentials?

```ts
optional credentials?: readonly {
[key: string]: unknown;
  credential: string;
}[];
```

Defined in: @gramota/oid4vci/dist/types.d.ts:142

##### c\_nonce?

```ts
optional c_nonce?: string;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:147

Fresh nonce for the next request, if any.

##### c\_nonce\_expires\_in?

```ts
optional c_nonce_expires_in?: number;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:148

##### notification\_id?

```ts
optional notification_id?: string;
```

Defined in: @gramota/oid4vci/dist/types.d.ts:150

Optional notification id for the wallet to acknowledge issuance.

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

***

### Oid4vciClientConfig

```ts
type Oid4vciClientConfig = Oid4vciClientSignerInput & {
  fetcher?: Fetcher;
  authorizationTransport?: AuthorizationTransport;
  credentialFormats?: CredentialFormatRegistry;
  dpop?: boolean | "auto";
};
```

Defined in: @gramota/oid4vci/dist/client.d.ts:28

#### Type Declaration

##### fetcher?

```ts
optional fetcher?: Fetcher;
```

Override fetch — for tests.

##### authorizationTransport?

```ts
optional authorizationTransport?: AuthorizationTransport;
```

How authorization parameters reach the AS during `authorize()`.
Default: [ParAuthorizationTransport](#parauthorizationtransport) (RFC 9126 PAR).

Pass a different strategy to opt into another transport — e.g.
`new DirectAuthorizationTransport()` for classic-OAuth issuers
that don't support PAR. Custom transports (e.g. JAR/RFC 9101)
implement [AuthorizationTransport](#authorizationtransport) and plug in here.

Strategy pattern: this is the abstraction `authorize()` depends
on, so adding a new transport doesn't require touching the
orchestrator (Open/Closed Principle).

##### credentialFormats?

```ts
optional credentialFormats?: CredentialFormatRegistry;
```

Pluggable credential-format registry.

`acceptOffer()` and `authorize()` consult this registry to gate
which formats they're willing to drive — instead of hardcoding
`if format === "vc+sd-jwt"`. Add an `MDocFormatHandler` to the
registry and the client suddenly handles mDoc credentials.

Default: a registry with `SdJwtVcFormatHandler` pre-registered.

##### dpop?

```ts
optional dpop?: boolean | "auto";
```

DPoP (RFC 9449) policy. Default: `"auto"` — attach DPoP proofs
when the AS metadata advertises `dpop_signing_alg_values_supported`
including the wallet's signing alg.

Set `false` to disable DPoP entirely (Bearer tokens only). Set
`true` to force DPoP regardless of metadata — useful when an AS
supports DPoP but doesn't advertise it (rare but spec-allowed).

***

### Oid4vciErrorCode

```ts
type Oid4vciErrorCode = 
  | "oid4vci.invalid_url"
  | "oid4vci.invalid_offer"
  | "oid4vci.unsupported_grant"
  | "oid4vci.unsupported_format"
  | "oid4vci.unsupported_proof_type"
  | "oid4vci.metadata_fetch_failed"
  | "oid4vci.metadata_invalid"
  | "oid4vci.token_request_failed"
  | "oid4vci.token_response_invalid"
  | "oid4vci.credential_request_failed"
  | "oid4vci.credential_response_invalid"
  | "oid4vci.config_not_found"
  | "oid4vci.tx_code_required"
  | "oid4vci.invalid_input"
  | "oid4vci.par_request_failed"
  | "oid4vci.par_response_invalid"
  | "oid4vci.par_endpoint_missing";
```

Defined in: @gramota/oid4vci/dist/types.d.ts:153

Stable codes for `Oid4vciError`.

## Variables

### AUTHORIZATION\_CODE\_GRANT

```ts
const AUTHORIZATION_CODE_GRANT: "authorization_code" = "authorization_code";
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:5

OAuth authorization-code grant identifier.

***

### PRE\_AUTHORIZED\_CODE\_GRANT

```ts
const PRE_AUTHORIZED_CODE_GRANT: "urn:ietf:params:oauth:grant-type:pre-authorized_code" = "urn:ietf:params:oauth:grant-type:pre-authorized_code";
```

Defined in: @gramota/oid4vci/dist/token.d.ts:5

Pre-authorized code grant identifier per OID4VCI §4.1.1.

## Functions

### buildAuthorizationParams()

```ts
function buildAuthorizationParams(options: BuildAuthorizationUrlOptions): {
  params: Record<string, string>;
  codeVerifier: string;
  state: string;
};
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:38

Build the canonical authorization parameters (OAuth + PKCE + OID4VCI
`authorization_details`). Shared between the direct auth-URL path and
the PAR (RFC 9126) path so they're guaranteed identical.

#### Parameters

##### options

[`BuildAuthorizationUrlOptions`](#buildauthorizationurloptions)

#### Returns

```ts
{
  params: Record<string, string>;
  codeVerifier: string;
  state: string;
}
```

##### params

```ts
params: Record<string, string>;
```

##### codeVerifier

```ts
codeVerifier: string;
```

##### state

```ts
state: string;
```

***

### buildAuthorizationUrl()

```ts
function buildAuthorizationUrl(options: BuildAuthorizationUrlOptions): BuiltAuthorizationUrl;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:51

Build the authorization URL for OID4VCI auth-code flow + PKCE per
OID4VCI §4 + RFC 7636.

The wallet redirects the user to this URL. The user authenticates at
the issuer, consents to credential issuance, and the issuer redirects
back to `redirectUri` with `?code=...&state=...`.

#### Parameters

##### options

[`BuildAuthorizationUrlOptions`](#buildauthorizationurloptions)

#### Returns

[`BuiltAuthorizationUrl`](#builtauthorizationurl)

***

### buildPostParAuthorizationUrl()

```ts
function buildPostParAuthorizationUrl(
   authorizationEndpoint: string, 
   clientId: string, 
   requestUri: string): string;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:58

Build the post-PAR authorization URL (RFC 9126 §4): once the wallet has
pushed its parameters and received a `request_uri`, the redirect URL
carries only `client_id` + `request_uri`. No PKCE, no `redirect_uri`,
no `state` — the AS already has them, bound to the URN.

#### Parameters

##### authorizationEndpoint

`string`

##### clientId

`string`

##### requestUri

`string`

#### Returns

`string`

***

### pushAuthorizationRequest()

```ts
function pushAuthorizationRequest(options: PushAuthorizationRequestOptions): Promise<PushAuthorizationRequestResult>;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:87

Push authorization parameters to the AS's PAR endpoint per RFC 9126.

The AS validates the parameters, mints a `request_uri` URN bound to
them, and returns it. The wallet then redirects the user to the
authorization endpoint with just `client_id` + `request_uri`.

Why this exists: the EU dev issuer's `wallet-dev` client requires PAR
(per-client policy). Without it, the EU AS rejects with
"Pushed Authorization Request is only allowed".

#### Parameters

##### options

[`PushAuthorizationRequestOptions`](#pushauthorizationrequestoptions)

#### Returns

`Promise`\<[`PushAuthorizationRequestResult`](#pushauthorizationrequestresult)\>

***

### requestTokenAuthCode()

```ts
function requestTokenAuthCode(options: RequestTokenAuthCodeOptions): Promise<TokenResponse>;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:108

Exchange the authorization code for an access token per RFC 6749 §4.1.3
+ RFC 7636 §4.5.

#### Parameters

##### options

[`RequestTokenAuthCodeOptions`](#requesttokenauthcodeoptions)

#### Returns

`Promise`\<[`TokenResponse`](#tokenresponse)\>

***

### parseAuthCallback()

```ts
function parseAuthCallback(callbackUrl: string): ParsedAuthCallback;
```

Defined in: @gramota/oid4vci/dist/auth-code.d.ts:117

#### Parameters

##### callbackUrl

`string`

#### Returns

[`ParsedAuthCallback`](#parsedauthcallback)

***

### requestCredential()

```ts
function requestCredential(options: RequestCredentialOptions): Promise<CredentialResponse>;
```

Defined in: @gramota/oid4vci/dist/credential.d.ts:25

Send a Credential Request to the issuer's credential endpoint per
OID4VCI §7. The request must include a proof JWT — see `buildProofJwt`.

When `dpopSigner` is supplied, the request is sender-constrained per
RFC 9449: the access token is presented under the `DPoP` scheme and a
`DPoP:` proof header binds the request to the holder's signing key.
The proof's `ath` claim is the SHA-256 of the access token, so a
stolen token can't be replayed by a different key.

#### Parameters

##### options

[`RequestCredentialOptions`](#requestcredentialoptions)

#### Returns

`Promise`\<[`CredentialResponse`](#credentialresponse)\>

***

### buildDpopJwt()

```ts
function buildDpopJwt(options: BuildDpopJwtOptions): Promise<string>;
```

Defined in: @gramota/oid4vci/dist/dpop.d.ts:51

Build a DPoP proof JWT per RFC 9449 §4.2.

Returns a compact-serialized JWS suitable for the `DPoP:` header.

#### Parameters

##### options

[`BuildDpopJwtOptions`](#builddpopjwtoptions)

#### Returns

`Promise`\<`string`\>

***

### computeAccessTokenHash()

```ts
function computeAccessTokenHash(accessToken: string): string;
```

Defined in: @gramota/oid4vci/dist/dpop.d.ts:58

Compute the `ath` claim per RFC 9449 §6.1: base64url(sha256(token)).

Exposed standalone so resource servers (verifiers) can compute the
expected `ath` independently when verifying inbound DPoP proofs.

#### Parameters

##### accessToken

`string`

#### Returns

`string`

***

### verifyDpopJwt()

```ts
function verifyDpopJwt(options: VerifyDpopJwtOptions): Promise<VerifyDpopJwtResult>;
```

Defined in: @gramota/oid4vci/dist/dpop.d.ts:116

Verify an inbound DPoP proof JWT and return the JWK thumbprint binding.

The verifier:
  1. Parses the JWS header — checks `typ: "dpop+jwt"` and reads `jwk`.
  2. Verifies the JWS signature against the embedded `jwk` (no
     external key resolution — DPoP proofs are self-attesting).
  3. Validates payload claims: `htm` matches request method, `htu`
     matches request URL (after stripping query/fragment), `iat`
     is within `maxAgeSeconds`, `jti` is present and not replayed,
     and (for resource-server access) `ath` matches the access token.
  4. Returns the verifier-relevant outputs: the public JWK, its
     RFC 7638 thumbprint (use as token binding), and the verified
     payload for any caller-specific claim inspection.

Throws [Oid4vciError](#oid4vcierror) with `oid4vci.invalid_input` (malformed) or
`oid4vci.token_response_invalid` (semantic violation) on rejection.

#### Parameters

##### options

[`VerifyDpopJwtOptions`](#verifydpopjwtoptions)

#### Returns

`Promise`\<[`VerifyDpopJwtResult`](#verifydpopjwtresult)\>

***

### fetchIssuerMetadata()

```ts
function fetchIssuerMetadata(credentialIssuer: string, options?: {
  fetcher?: Fetcher;
}): Promise<IssuerMetadata>;
```

Defined in: @gramota/oid4vci/dist/metadata.d.ts:8

Fetch + validate Issuer Metadata from
`<credential_issuer>/.well-known/openid-credential-issuer`.

#### Parameters

##### credentialIssuer

`string`

##### options?

###### fetcher?

[`Fetcher`](#fetcher)

#### Returns

`Promise`\<[`IssuerMetadata`](#issuermetadata-1)\>

***

### validateMetadata()

```ts
function validateMetadata(body: unknown, source?: string): IssuerMetadata;
```

Defined in: @gramota/oid4vci/dist/metadata.d.ts:12

Validate already-loaded metadata JSON (e.g. for tests or pre-fetched data).

#### Parameters

##### body

`unknown`

##### source?

`string`

#### Returns

[`IssuerMetadata`](#issuermetadata-1)

***

### resolveTokenEndpoint()

```ts
function resolveTokenEndpoint(metadata: IssuerMetadata): string;
```

Defined in: @gramota/oid4vci/dist/metadata.d.ts:15

Resolve which token endpoint to use for an issuer. Per OID4VCI §11.2,
the metadata may delegate to a separate authorization server.

#### Parameters

##### metadata

[`IssuerMetadata`](#issuermetadata-1)

#### Returns

`string`

***

### fetchAuthorizationServerMetadata()

```ts
function fetchAuthorizationServerMetadata(issuerMetadata: IssuerMetadata, options?: {
  fetcher?: Fetcher;
}): Promise<AuthorizationServerMetadata>;
```

Defined in: @gramota/oid4vci/dist/metadata.d.ts:56

Resolve the authorization server for an issuer per OID4VCI §11.2.2.

  1. If the issuer publishes `authorization_endpoint` + `token_endpoint`
     directly on its credential-issuer metadata, treat the issuer as its
     own AS — return a synthetic metadata object.
  2. Else if `authorization_servers` is set, fetch metadata from the
     first entry. Tries OIDC discovery first (`openid-configuration`)
     then RFC 8414 (`oauth-authorization-server`).
  3. Else fall back to `<credential_issuer>/{authorize,token}`.

The wallet must use the AS's endpoints — not the issuer's — for the
auth-code flow, otherwise the EU Keycloak-backed dev issuer will 404.

#### Parameters

##### issuerMetadata

[`IssuerMetadata`](#issuermetadata-1)

##### options?

###### fetcher?

[`Fetcher`](#fetcher)

#### Returns

`Promise`\<[`AuthorizationServerMetadata`](#authorizationservermetadata-2)\>

***

### parseCredentialOffer()

```ts
function parseCredentialOffer(url: string): CredentialOffer;
```

Defined in: @gramota/oid4vci/dist/offer.d.ts:35

Parse a Credential Offer URL per OID4VCI §4.1.

Two URL forms are accepted:

  1. **By value** — `openid-credential-offer://?credential_offer=<url-encoded JSON>`
     The offer is inline; this function returns it parsed.
  2. **By reference** — `openid-credential-offer://?credential_offer_uri=<URL>`
     The wallet must fetch the offer JSON from the URL itself. This
     function does NOT make HTTP calls; it surfaces a structured error
     so callers can branch on the code and run their fetcher.

Custom schemes are common (`openid-credential-offer://`, `haip://`,
`eudi-openid4vci://`) — we don't enforce a specific scheme, just parse
the query string. The offer's own `credential_issuer` URL is what
grounds the wallet, not the deep-link scheme.

#### Parameters

##### url

`string`

#### Returns

[`CredentialOffer`](#credentialoffer)

#### Example

```ts
const offer = parseCredentialOffer(
  "openid-credential-offer://?credential_offer=" +
  encodeURIComponent(JSON.stringify({
    credential_issuer: "https://acme.gramota.dev",
    credential_configuration_ids: ["urn:eudi:pid:1_sd_jwt_vc"],
    grants: { "urn:ietf:params:oauth:grant-type:pre-authorized_code": { "pre-authorized_code": "..." } },
  })),
);
```

#### Throws

[Oid4vciError](#oid4vcierror) with `oid4vci.invalid_input` (empty/non-string),
  `oid4vci.invalid_url` (malformed URL), or `oid4vci.invalid_offer`
  (mutually-exclusive params, missing params, by-reference form).

***

### parseOfferJson()

```ts
function parseOfferJson(json: string): CredentialOffer;
```

Defined in: @gramota/oid4vci/dist/offer.d.ts:46

Parse the JSON body of a credential offer.

Use this when you've already fetched the offer body (e.g. you handled
the `credential_offer_uri` HTTP call in your own code). The validation
matches `parseCredentialOffer` for consistency.

#### Parameters

##### json

`string`

#### Returns

[`CredentialOffer`](#credentialoffer)

#### Throws

[Oid4vciError](#oid4vcierror) with `oid4vci.invalid_offer` if the JSON
  is malformed, not an object, or missing required fields.

***

### extractPreAuthorizedCode()

```ts
function extractPreAuthorizedCode(offer: CredentialOffer): string;
```

Defined in: @gramota/oid4vci/dist/offer.d.ts:54

Extract the pre-authorized code from a parsed offer.

#### Parameters

##### offer

[`CredentialOffer`](#credentialoffer)

#### Returns

`string`

the code string when the offer carries the pre-authorized
  code grant (OID4VCI §4.1.1), or `null` when only authorization-code
  flow is available.

***

### extractTxCodeRequirement()

```ts
function extractTxCodeRequirement(offer: CredentialOffer): {
  input_mode?: "numeric" | "text";
  length?: number;
  description?: string;
};
```

Defined in: @gramota/oid4vci/dist/offer.d.ts:65

Extract the `tx_code` requirement from a parsed offer.

`tx_code` (transaction code) is the in-band PIN/OTP some issuers
require alongside the pre-auth code — the wallet must collect it from
the user and submit it with the token request.

#### Parameters

##### offer

[`CredentialOffer`](#credentialoffer)

#### Returns

```ts
{
  input_mode?: "numeric" | "text";
  length?: number;
  description?: string;
}
```

the requirement object (input mode, length, description) or
  `null` when no tx_code is required (the common case).

##### input\_mode?

```ts
optional input_mode?: "numeric" | "text";
```

##### length?

```ts
optional length?: number;
```

##### description?

```ts
optional description?: string;
```

***

### buildCredentialOfferUrl()

```ts
function buildCredentialOfferUrl(offer: CredentialOffer, options?: {
  scheme?: string;
}): string;
```

Defined in: @gramota/oid4vci/dist/offer.d.ts:102

Build a Credential Offer URL — the inverse of [parseCredentialOffer](#parsecredentialoffer).

Produces the by-value form (`?credential_offer=<encoded JSON>`).
For the by-reference form (`?credential_offer_uri=<URL>`), build it
yourself — it's a one-line `URLSearchParams` call and the choice of
whether to host the offer JSON behind a URL is yours, not the
library's.

The `scheme` defaults to `openid-credential-offer://` per OID4VCI §4.1
but custom schemes (`haip://`, `eudi-openid4vci://`, etc.) are common
— pass any URI scheme that includes `://` and the wallet's preferred
authority.

#### Parameters

##### offer

[`CredentialOffer`](#credentialoffer)

##### options?

###### scheme?

`string`

#### Returns

`string`

#### Example

```ts
const url = buildCredentialOfferUrl({
  credential_issuer: "https://acme.gramota.dev",
  credential_configuration_ids: ["urn:eudi:pid:1_sd_jwt_vc"],
  grants: {
    "urn:ietf:params:oauth:grant-type:pre-authorized_code": {
      "pre-authorized_code": "abc123",
    },
  },
});
// → openid-credential-offer://?credential_offer=%7B%22credential_issuer%22%3A...
```

#### Throws

[Oid4vciError](#oid4vcierror) with `oid4vci.invalid_input` if the offer
  is missing required fields, or `oid4vci.invalid_url` if `scheme`
  is not a valid URI authority.

***

### generateCodeVerifier()

```ts
function generateCodeVerifier(byteLength?: number): string;
```

Defined in: @gramota/oid4vci/dist/pkce.d.ts:14

Generate a code verifier per RFC 7636 §4.1.
Length: 43–128 chars; charset: [A-Za-z0-9_~.-] (unreserved per RFC 3986).

#### Parameters

##### byteLength?

`number`

#### Returns

`string`

***

### codeChallenge()

```ts
function codeChallenge(verifier: string): string;
```

Defined in: @gramota/oid4vci/dist/pkce.d.ts:16

Compute the S256 code challenge from a verifier per RFC 7636 §4.2.

#### Parameters

##### verifier

`string`

#### Returns

`string`

***

### generateState()

```ts
function generateState(byteLength?: number): string;
```

Defined in: @gramota/oid4vci/dist/pkce.d.ts:18

Generate a CSRF state parameter — unique per auth flow.

#### Parameters

##### byteLength?

`number`

#### Returns

`string`

***

### buildProofJwt()

```ts
function buildProofJwt(options: BuildProofOptions): Promise<string>;
```

Defined in: @gramota/oid4vci/dist/proof.d.ts:36

#### Parameters

##### options

[`BuildProofOptions`](#buildproofoptions)

#### Returns

`Promise`\<`string`\>

***

### parseCredentialRequest()

```ts
function parseCredentialRequest(options: ParseCredentialRequestOptions): ParsedCredentialRequest;
```

Defined in: @gramota/oid4vci/dist/server.d.ts:42

Parse + normalise a credential-request body into the canonical shape.

Throws [Oid4vciError](#oid4vcierror) with a stable error code on:
  - body is not an object → `oid4vci.invalid_input`
  - both Draft 13 and Draft 14/15 shapes missing → `oid4vci.invalid_input`
  - configuration id present but not in metadata → `oid4vci.config_not_found`
  - proof missing entirely → `oid4vci.invalid_input`

#### Parameters

##### options

[`ParseCredentialRequestOptions`](#parsecredentialrequestoptions)

#### Returns

`ParsedCredentialRequest`

***

### buildSubdomainIssuerUrl()

```ts
function buildSubdomainIssuerUrl(baseUrl: string, subdomain: string): string;
```

Defined in: @gramota/oid4vci/dist/server.d.ts:60

Compose a per-tenant Credential Issuer URL by injecting `subdomain` as
the leftmost DNS label of `baseUrl`'s host.

  buildSubdomainIssuerUrl("https://gramota.dev", "acme")
    → "https://acme.gramota.dev"
  buildSubdomainIssuerUrl("https://localtest.me:4444", "demo")
    → "https://demo.localtest.me:4444"

The trailing slash that `URL.toString()` adds is stripped — issuer
identifiers are commonly compared byte-for-byte (RFC 8414 §2 ties the
`iss` claim to the metadata-fetch URL) and a stray `/` is a footgun.

#### Parameters

##### baseUrl

`string`

##### subdomain

`string`

#### Returns

`string`

#### Throws

if `baseUrl` is not a valid URL or `subdomain` is empty / not
  a valid DNS label (RFC 1035: lowercase alphanumeric + hyphen, no
  leading/trailing hyphen, ≤ 63 chars).

***

### requestToken()

```ts
function requestToken(options: RequestTokenOptions): Promise<TokenResponse>;
```

Defined in: @gramota/oid4vci/dist/token.d.ts:23

Exchange a pre-authorized code for an access token at the issuer's
authorization-server token endpoint.

On success, returns the TokenResponse including any `c_nonce` the issuer
requires the wallet to embed in the next proof JWT.

#### Parameters

##### options

[`RequestTokenOptions`](#requesttokenoptions)

#### Returns

`Promise`\<[`TokenResponse`](#tokenresponse)\>
