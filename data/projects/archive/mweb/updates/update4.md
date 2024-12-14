---
title: 'May 2023 Development Update: MWEB Integration Progress and Descriptor Wallet Exploration'
summary: 'In May 2023, progress continued on the v24 release, with successful integration of Litecoin code changes and resolution of pre-MWEB merge functional tests. Significant strides were made in merging MWEB code, though some wallet-side changes and tests remain. The descriptor wallet code was explored for MWEB support, and a task list for the v24 release was updated.'
date: '2022-05-31'
authorTwitterHandle: 'DavidBurkett38'
id: 4
---

## May 2023 Progress

### v24 Release

Progress continues with the integration of Litecoin code changes into the v24 Bitcoin codebase. The month of May saw a major milestone with the resolution of all remaining functional tests for the pre-MWEB merge task. The code has been submitted for review [here](https://example.com) (Task 23).

Furthermore, we've made significant strides in merging the previously-released MWEB code. The majority of this task is now complete, marking another key step forward. However, there are still a few changes needed on the wallet side and several tests that need to be fixed to finalize this phase.

I also took some time to work through bitcoin's descriptor wallet code, and have a decent understanding of how it all works, and how the data is stored in the wallet database. I've started experimenting with different ways of supporting MWEB keys and addresses using descriptors, but a lot more thought is needed before I commit to a design.

Here's our updated task list as we move closer to the v24 release:

- [x] Integrate pre-MWEB litecoin into bitcoin's v24 codebase (In review 23)
- [ ] Merge in the previously-released MWEB code (Majority merged, a few changes & tests left)
- [ ] P2P Support for Light Clients (Implemented, in need of merging & thorough review 11)
- [ ] Enable descriptor wallets w/ MWEB address support (Design in progress)
- [ ] Finish implementing PSBTs (Mostly implemented, needs testing and review)
- [ ] View key support (Rough design known, implementation started)
- [ ] Payment Proofs (Design outlined in LIP-0004, implementation not started)
- [ ] Release Notes (Not started)
- [ ] GUIX Build & Publish (Not started)
