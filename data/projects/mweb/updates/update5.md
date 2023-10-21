---
title: "June 2023 Development Update: MWEB Integration and Wallet Code Challenges"
summary: "In June 2023, significant progress was made towards the v24 release, including the successful merging of the initial MWEB code into the codebase. However, challenges were encountered, especially with the wallet code, which required extensive merging due to recent Bitcoin wallet code refactoring. The task list outlines ongoing developments, with the goal for July being the implementation of MWEB address support for descriptor wallets."
date: "2022-06-31"
authorTwitterHandle: 'DavidBurkett38'
id: 5
---

## June 2023 Progress

### v24 Release

The initial MWEB code has been merged into the v24.x codebase, and will be submitted for review shortly. I encountered a couple of obstacles that slowed down momentum, particularly on the wallet side.

When MWEB was implemented, I was able to make its node logic very modular, making merging that relatively easy (with the exception of the mempool, which is still rather complex). I was not as lucky with the wallet code, however, which requires quite a bit of merging. And it turns out that Bitcoin’s wallet code has been refactored quite a bit over the past few releases, so this ended up being a much slower, more tedious process than I hoped.

### Updated Task List

- [x] Integrate pre-MWEB litecoin into bitcoin’s v24 codebase (In review 12)
- [x] Merge in the previously-released MWEB code (Will update with review link shortly)
- [ ] P2P Support for Light Clients (Implemented, in need of merging & thorough review 31)
- [ ] Enable descriptor wallets w/ MWEB address support (Design in progress)
- [ ] Finish implementing PSBTs (Mostly implemented, needs testing and review)
- [ ] View key support (Rough design known, implementation started)
- [ ] Payment Proofs (Design outlined in LIP-0004, implementation not started)
- [ ] Release Notes (Not started)
- [ ] Gitian Build & Publish (Not started)

My goal for July is to implement MWEB address support for descriptor wallets.
