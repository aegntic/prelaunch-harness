# Receipt service

`POST /scan` returns a receipt. `GET /badge/:id.svg` returns a mark.

The mark says scan receipt. It does not say certified, verified, checked, approved, or compliant. The operator who embeds it remains responsible for launch.

Set `PAY_TO` to a Base address to require 0.02 USDC before a receipt. Leave it unset to keep the scan open. A payment header is accepted as `X-Payment` or `Payment-Signature`. Settlement against a facilitator is the operator's next wire-up. This service does not claim the payment cleared on-chain unless that facilitator is added.

Embed:

```html
<a href="https://HOST/">
  <img alt="Scan receipt. Not a certification." src="https://HOST/badge/RECEIPTID.svg">
</a>
```
