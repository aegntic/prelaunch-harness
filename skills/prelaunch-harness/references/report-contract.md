---
description: "Required report shape. Read before writing the audit answer."
connections: [controls, surfaces]
---

# Report contract

Use this order.

1. Boundary. One sentence: engineering controls, not a legal opinion.
2. Surface inventory. Present / absent / unknown.
3. Family table. One row per family: status `fail`, `review`, `absent`, or `local-control-present`. Evidence column cites file and line or says not in tree.
4. Patches applied or proposed. Only local and reversible. Mark operator-owned blanks.
5. Do not ship yet. The shortest list of facts only the operator can supply.
6. Scanner JSON, if a tree was scanned.

Status words:

- `fail` — a high signal is in the tree and the control is missing.
- `review` — surface exists, control not proven.
- `absent` — surface not in the product.
- `local-control-present` — the reversible control is in the tree. This is not "compliant".
