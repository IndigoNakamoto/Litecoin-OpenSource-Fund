---

title: 'LiteWallet Bounty: Resolve Core Update Issue'
summary: 'Enhancing the user experience of LiteWallet by tackling a critical issue related to address display in the transaction history.'
nym: 'Litecoin Foundation'
website: 'https://litewallet.org/'
coverImage: '/static/images/projects/litewallet3.png'
git: '[GitHub Issue #207](https://github.com/litecoin-foundation/litewallet-ios/pull/211)'
twitter: '@LiteWalletApp'
personalTwitter: '@litecoin'
type: 'Bounty'  # Replace with the appropriate type of the project if known.
contributor: 'SatoshiLite,bigkerrytweets,claudia14083392,Pat_McDermott17,ferencakIvan,josi_kie'
owner: 'bigkerrytweets'
---

## Embark on a Mission with LiteWallet

LiteWallet, powered by the Litecoin Foundation, is a user-friendly and secure crypto wallet enabling users to manage their Litecoin assets efficiently. However, a critical issue has been identified in our iOS application, related to the loafwallet-core module/library. When opening the transaction history, certain types of addresses are not being displayed due to a bug concerning UnsafeMutablePointer. We're inviting proficient developers to dive into this challenge, ensuring a seamless user experience for our global user base.

### Delving Into the Core Issue

The heart of the matter lies in the display of certain types of addresses within the transaction history. The regular addresses are shown as expected, but others (specifically those with ltc1, M or ltc1 prefixes) are not visible. The suspected root cause circles back to changes in the standard of handling UnsafeMutablePointers.

### Bounty Objectives:

**- Investigate and Understand**: Scrutinize the existing setup of loafwallet-core and its interaction with LiteWallet-iOS, particularly around Transaction.swift class line 174.
  
**- Identify and Fix**: Address the exact cause of the UnsafeMutablePointer failure, implement necessary changes to rectify the unwrapping of addresses, ensuring all types of addresses are displayed correctly in the app.

**- Validation and Verification**: Conduct thorough testing to ensure the problem is resolved with no regression issues, and the rest of the app functions as desired.

**- Documentation**: Create clear and comprehensive documentation outlining the changes made, ensuring future developers understand the modifications.

### Skills and Expertise Required:

- Proficiency in C, Swift, and SQLite.
- Familiarity with loafwallet-core library.
- Experience in iOS app development.

### Reward and Recognition:

- (Reward Amount to be decided by the project owner)
- Your contribution will significantly impact the LiteWallet user experience, making a direct positive impression on a global user base.

### The Road Ahead:

Is the idea of making a substantial difference in the cryptocurrency wallet space exciting? Are you up for the challenge to enhance LiteWallet's functionality and user experience? Review the detailed [GitHub Issue #207](https://github.com/litecoin-foundation/litewallet-ios/pull/211) to understand the problem fully and send in your application to (provide contact email or application portal).

Take a step towards contributing to a more robust and user-friendly LiteWallet. Your expertise could drive a pivotal solution, marking a significant stride in LiteWallet's journey towards excellence.

---

Make sure to specify the reward amount, the deadline for this bounty, and the contact method for applications as per your project requirements.