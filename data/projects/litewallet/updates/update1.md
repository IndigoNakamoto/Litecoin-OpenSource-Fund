---
title: '<Litewallet-iOS: Resolve core update issue missing labels>'
summary: '<Critical bug blocked any new submissions to the App Store>'
date: '2023-12-31'
authorTwitterHandle: 'Litewallet_App'
id: 1
---

## Retro

This bug was blocking submission of new versions of the app and it was labeled `critical`. In fact, the problem took 158 days to resolve. In the history of Litewallet, this has been the biggest blockage in the release lifecycle. The problem was resolved [here](https://github.com/litecoin-foundation/litewallet-ios/pull/211/commits/f200ecc3a8c36eb4a98a2cc126745c6eaf5f8445).

### Problem

When updating the loafwallet-core module / library the address is failing a UnsafeUnmutablePointer when the opening the history of transactions.

As a result, the sent and receive addresses are showing as normal if they are `LNgqTxjWxmjsULeugZd7ee6wwVFsVGkz4js` **but** `ltc1qrledc2grd0lvluvcn388szkjhxllqmtyzr37rxn` or `M` or ltc1 addresses are not showing.

The issue is the standard of UnsafeUnmutablePointers has changed over the few years so the way to properly handle has changed.

### Positives

- The data is there in the database (SQLite) and the ltc1 addresses are present.
- The rest of the app is behaving normally

### Snapshot

![Simulator Screenshot - iPhone 14 Pro - 2023-05-30 at 08 56 49](https://github.com/litecoin-foundation/litewallet-ios/assets/2899463/873fa4a1-a8c3-48d5-8051-32d819f9ea70)

Correct Addresses:
![test-addresses](https://github.com/litecoin-foundation/litewallet-ios/assets/2899463/f50cd2d6-9ef2-48df-a0b4-9e0b65ab0edf)

## Bounty Distribution

Thanks for the bounty _21Ł_ Thanks to the Lite.Space and Indigo Nakamoto. Please visit [Lite.Space](https://www.lite.space/missions/litewallet) to learn more about other bounties!

**Note on Distribution:**

- Lead Developer: 75% (Amount: 15.75Ł) twitter.com/bigkerrytweets
- PR Code Review: 20% (Amount: 4.2Ł) twitter.com/josi_kie
- Litewallet Operations: 5% (Amount: 1.05Ł)
