---
title: "Update 3"
summary: "In April 2023, progress was focused on integrating classic Litecoin code changes into the v24 Bitcoin code for the upcoming release. Most unit tests have been fixed, with just a few functional tests remaining. The task list outlines ongoing development efforts, including merging MWEB code and implementing various features, as the release approaches."
date: "2022-03-31"
AuthorTwitterHandle: 'DavidBurkett38'
id: 3
---

## April 2023 Progress

### v24 Release

Over the past couple of months, the focus has been primarily on integrating the classic (pre-MWEB) Litecoin code changes into the v24 Bitcoin code. This process is nearing its conclusion, with all unit-tests fixed, and just a few functional tests remaining to be fixed. Once the last few tests are resolved, I will submit the merged code for review as planned.

I'll be updating the following task list each month as we work toward the release:

- [ ] Integrate pre-MWEB litecoin into bitcoin’s v24 codebase (A few tests remaining, then review)
- [ ] Merge in the previously-released MWEB code (Not started, expected by end of May)
- [ ] P2P Support for Light Clients (Implemented, in need of merging & thorough review)
- [ ] Enable descriptor wallets w/ MWEB address support (Not started)
- [ ] Finish implementing PSBTs (Mostly implemented, needs testing and review)
- [ ] View key support (Rough design known, implementation started)
- [ ] Payment Proofs (Design outlined in LIP-0004, implementation not started)
- [ ] Release Notes (Not started)
- [ ] Gitian Build & Publish (Not started)
