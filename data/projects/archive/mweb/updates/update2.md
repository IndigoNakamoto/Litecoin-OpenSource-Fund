---
title: 'Litecoin Development Update: v0.21.2.2 Security Release and Progress on v24'
summary: "In February and March 2023, we released Litecoin Core v0.21.2.2 with essential security fixes. Additionally, work began on Litecoin Core v24, which will introduce significant features such as PSBTs, P2P support for light clients, view keys, payment proofs, and descriptor wallets, all aimed at enhancing functionality and security. The process is ongoing, with each step undergoing code review, and it's expected to continue into the summer. The new release will align Litecoin with Bitcoin Core and deliver long-awaited MWEB features."
date: '2022-04-31'
authorTwitterHandle: 'DavidBurkett38'
id: 2
---

## February & March 2023 Progress

### v0.21.2.2 Release

In February, we released a new minor version of Litecoin Core (v0.21.2.2) containing important security fixes. If you haven't upgraded yet, you can download it [here](https://example.com) (Release 21).

### v24 Release

I've started working on a new major release for Litecoin Core that will include the following features I've been working on over the past year:

- **PSBTs**: To encourage hardware support for MWEB.
- **P2P Support for Light Clients**: To enable mobile and user-friendly wallets.
- **View Keys**: To support "watch-only" wallets without the need for private spend keys.
- **Payment Proofs**: A complex proof mechanism for MWEB transactions, described [here](https://example.com) (Issue 18).
- **Descriptor Wallets**: A more extensible wallet backend to handle various script types, including MWEB addresses, improving on the existing wallet code. Learn more [here](https://example.com) (Issue 7).

I've already added the classic (pre-MWEB) Litecoin code changes to the v24 Bitcoin code and am working on fixing tests. Next, I'll merge the already-released MWEB code and incorporate the new features listed above. I will submit everything for code review after each step. This process will take us into the summer, but the end result will be an up-to-date Litecoin Core release with all the eagerly awaited MWEB features.
