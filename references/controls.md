---
description: "Six agnostic control families, signals, fail states, and allowed claims. Read on every audit."
connections: [surfaces, report-contract]
---

# Controls

Names below are labels for a control, not citations of a statute. Local names in parentheses are reminders of why teams meet the control. They are not a choice of law.

| ID | Family | Control | Typical local names |
|---|---|---|---|
| C1 | capacity | Do not open an account or collect a child's data without a capacity gate matched to the market | COPPA, GDPR Art. 8, UK Age Appropriate Design, AU APP |
| C2 | identifier-leak | Do not disclose a network identifier to a third party for an asset you can serve yourself | GDPR / ePrivacy font and tag cases, APP 6, CCPA sale/share |
| C3 | input-capture | Do not record keystrokes, inputs, or sessions by default | CIPA and state wiretap theories, GDPR consent, workplace-monitoring rules |
| C4 | commercial-message | Every marketing send can be refused and identifies the sender's postal identity | CAN-SPAM, CASL, GDPR, AU Spam Act |
| C5 | recurring-assent | Renewal price, cadence, and cancellation sit next to the assent control | US auto-renewal state laws, EU consumer rules, AU unfair-contract rules |
| C6 | user-content | Hosting other people's files has a designated notice path before the upload exists | DMCA designated agent, EU notice-and-action, AU Online Safety |

## C1 capacity

Signals: signup, register, create-account, date-of-birth field absent, contact form collecting email from a general audience.

Fail: an account can be created with no age or capacity signal, and the product can be reached by a child.

Patch that is allowed: a required attestation at the collection point, a block under a stated age, a note that the attestation is not a full children's program.

Patch that is not allowed: claiming COPPA compliance because a checkbox exists.

## C2 identifier-leak

Signals: `fonts.googleapis.com`, `fonts.gstatic.com`, Typekit, tag managers, ad pixels, public CDNs for libraries the page does not need at runtime.

Fail: the browser contacts a third party before any choice, and the same result is available from a file you host.

Patch that is allowed: system font stack, self-hosted font files, vendored scripts, removal of the tag.

Patch that is not allowed: a banner that still loads the font before consent. Consent after the request does not undo the request.

A German regional court in January 2022 awarded a visitor €100 where a Google-hosted font disclosed an IP that local hosting would have avoided (LG München I, 3 O 17493/20). Treat that as one court's reason to delete the request, not as a global tariff.

## C3 input-capture

Signals: FullStory, LogRocket, Hotjar, Microsoft Clarity, Mouseflow, Smartlook, `sessionReplay`, canvas recording.

Fail: recording starts before consent, or inputs are not masked.

Patch that is allowed: vendor removed, or off until an affirmative choice, with inputs masked and a retention bound written down.

Patch that is not allowed: "we added a privacy policy" while the recorder still starts on load.

## C4 commercial-message

Signals: launch email, newsletter, drip, "subscribe for updates" that is not a product login.

Fail: a marketing message with no working refusal path, or no real postal identity of the sender.

Patch that is allowed: transactional reply only, copy that forbids list insertion, a blank marked `POSTAL ADDRESS — operator must fill`.

Patch that is not allowed: inventing a street address.

## C5 recurring-assent

Signals: subscription, auto-renew, per month, checkout price id.

Fail: the assent control does not show price, cadence, and how to cancel.

Patch that is allowed: those three facts rendered beside the button that takes payment.

Patch that is not allowed: a footer link as the only disclosure.

## C6 user-content

Signals: file input, presigned upload, user-generated image or comment store.

Fail: visitors can upload and no notice path is filed.

Patch that is allowed: uploads disabled until the operator confirms the filing. Footer text that says the filing does not exist yet.

Patch that is not allowed: "DMCA agent registered" without the operator confirming the registration.

## Severity

- `high` — remote disclosure or capture is in the tree.
- `review` — the surface exists; the control is not proven.
- `absent` — the surface is not in the product. Say absent, not passed.
