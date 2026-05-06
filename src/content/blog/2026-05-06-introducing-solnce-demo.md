---
title: Introducing Solnce — the live demo for Gramota
slug: 2026-05-06-introducing-solnce-demo
description: A pretend EU storefront that runs against our production verification API, with an in-browser simulator so anyone can try the flow without installing a wallet.
date: 2026-05-06
author: Petromil Pavlov
---

# Introducing Solnce — the live demo for Gramota

Reading a spec is a terrible way to evaluate an SDK. So before we asked
anyone to read ours, we built a small storefront — **Solnce** — that
sells products gated by EU rules, verifies the customer with a real
EU Digital Identity Wallet flow, and lets you walk through the whole
thing without installing anything.

It's live at <https://gramota-org.github.io/demo-store/>. This post is
a quick tour of what it does and why we built it.

## 1. The storefront

![Storefront mockup with three product cards — rakia, festival ticket, CBD oil — each badged with the verification checks they require.](/figures/01-storefront.svg)

Nine products across drinks, wellness, tickets, gaming, and finance —
each one gated by a real EU regulation:

- **Rakia, champagne, beer** — alcohol licensing, 18+
- **CBD tincture** — EU compliance, 18+, EU residency
- **Festival VIP pass** — age-gated event entry, identity required
- **Berghain night** — same, but with a sense of humour
- **Racing-game pre-order** — PEGI 16
- **Online poker buy-in** — gambling age (18) + EU jurisdiction + identity
- **Brokerage account** — KYC

The badges on each card aren't decoration. They map 1:1 to the checks
the verifier will run when you click "Buy now". The whole point of the
demo is to show that you don't need a separate identity-verification
SaaS, a 90-page integration guide, or a pile of compliance lawyers to
ship this.

## 2. Verifying the wallet

![Verification screen with a QR code on the right, a list of pulsing checks on the left, and a four-button simulator panel for screen-recording without a real wallet.](/figures/02-verifying.svg)

Click any product and the checkout switches to a verification screen.
Two paths from here:

- **Real wallet path** — scan the QR with the EU Digital Identity
  Wallet (or any OID4VP-compatible wallet). The verifier mints a
  session against our production API at
  `https://168-119-249-126.sslip.io`. Your phone shows the disclosure
  prompt. Tap "Share" and the order completes.

- **Simulator path** — the dashed-border panel below the QR has four
  buttons: *Approve all checks*, *Fail age*, *Fail residency*, *Fail
  all*. Each one drives the same backend pipeline a real wallet would,
  using synthesised credentials so you can see every outcome without
  needing a phone in front of you. We use it for screen-recordings,
  customer demos, and CI.

The session expires in 5 minutes. The countdown is real.

## 3. The result

![Result screen showing each check with a green check mark — age_over_18, residency_eu, identity_verified — and the disclosed claims footer.](/figures/03-verified.svg)

If the wallet shares what was asked for, every gate passes and the
order completes. The "check results" panel lists each check by name
and outcome — no surprises, no opaque scoring.

The thing worth pointing at is the footer:

> **CLAIMS DISCLOSED** — given_name: Greta · birth_date: 1990-04-15 ·
> nationality: BG

That's everything the merchant got. The wallet didn't share the
document number, the photo, the issuing authority, or the address.
Selective disclosure is the default — not a feature you have to
turn on.

## Why we built it

Three reasons:

1. **Reading is slow, clicking is fast.** A two-minute walkthrough
   tells you more than a 50-page README about whether this SDK fits
   your problem.

2. **Failure cases matter as much as the happy path.** The four
   simulator buttons let you see exactly what your code receives when
   a customer is too young, when they're outside the EU, when they
   don't have an identity credential. You don't have to imagine it.

3. **It pressure-tests the API.** Every customer demo runs against
   the same production endpoints we ship. If something is brittle,
   we find out before you do.

## What's under the hood

The storefront is React 18 + Vite, deployed to GitHub Pages. The
verification backend runs on a single Hetzner CAX11 ARM node in
Falkenstein for €5.39/mo. Caddy handles HTTPS via Let's Encrypt
against an sslip.io hostname (free, IP-encoded subdomain — `.eu` /
`.app` domain coming once we like the brand enough). The whole
thing is open-source and disposable.

`POST /demo/verifications` mints the session, `GET
/demo/verifications/:id` polls status, and `POST
/demo/verifications/:id/simulate` drives the simulator. No auth —
it's a public demo, rate-limited by IP.

The verifier itself is `@gramota/verifier`, the same package you'd
install. Twelve checks run on every successful flow. We're not
hiding anything behind a smart wrapper.

## Try it

- **Live demo:** <https://gramota-org.github.io/demo-store/>
- **Source:** <https://github.com/gramota-org/demo-store>
- **Backend source:** <https://github.com/gramota-org/saas>

If something is broken, [open an
issue](https://github.com/gramota-org/demo-store/issues) — the demo
is the canonical "is the API working?" check, so we'd rather hear
about it loudly.
