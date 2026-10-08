---
name: prelaunch-harness
description: "Audit any app, site, or agent-built product before launch across six agnostic control families: capacity gates, third-party identifier leaks, input capture, commercial messaging, recurring-charge assent, and user-content safe harbor. Use when the user says pre-launch, launch audit, ship checklist, COPPA, GDPR fonts, session replay, CAN-SPAM, auto-renew, DMCA agent, or vibe-coded legal traps. Not legal advice."
license: MIT
compatibility: Any Agent Skills harness. Optional Python 3 for scripts/audit_surface.py. No network, no account, no jurisdiction assumed.
metadata:
  author: aegntic
  version: "1.0.0"
  families: "capacity,identifier-leak,input-capture,commercial-message,recurring-assent,user-content"
---

# Prelaunch Harness — ship the control, not the slogan

Audit a product surface before it is public. Map what exists to six control families. Patch only what is local and reversible. Never invent a filing, a postal address, or a legal conclusion.

This skill is an engineering checklist. It is not legal advice. Statutes, penalties, and safe harbors depend on who operates the product, where the visitor is, and what is actually collected.

## When to load more

- Control definitions, signals, fail states: `references/controls.md`
- What to inventory by surface: `references/surfaces.md`
- Output shape: `references/report-contract.md`
- Graph entry: `references/INDEX.md`

## Workflow

1. State the boundary in the first line of the report: engineering controls, not a legal opinion.
2. Inventory surfaces from the tree and from the user. Use `references/surfaces.md`. Missing surface is an unknown, not a pass.
3. Run the scanner when a tree is available:

```bash
python3 scripts/audit_surface.py <path>
```

Treat hits as signals. `high` means a remote disclosure or capture pattern. `review` means a surface exists and the control was not proven.

4. Map every signal onto one family in `references/controls.md`. Do not add a seventh family unless the user names a concrete obligation.
5. Ask only for facts that change a control: markets served, whether accounts exist, whether a human can be under the local capacity age, whether marketing mail is sent, whether charges recur, whether visitors upload files. If the tree already answers, do not ask.
6. Patch local controls only:
   - Stop remote font, tag, and replay requests, or self-host the asset.
   - Put a capacity attestation on the collection form if accounts or contact PII exist.
   - Put recurring terms on the assent control, not only in a footer.
   - Do not write a fake postal address, a fake DMCA registration, or a privacy policy that claims a filing.
7. Emit the report in `references/report-contract.md`. Lead with the family table. Put the scanner JSON after it. End with the smallest next patch.

## Hard rules

- Penalty figures from a social post are ceilings or anecdotes. Label them as such or omit them.
- A checkbox is not a children's-privacy program. Say what it does and what it does not do.
- A footer sentence is not a designated agent, a consent record, or an unsubscribe mechanism.
- Third-party CDN scripts are the same class of identifier leak as remote fonts. Flag them.
- Do not tell the user they are compliant.

## Common failures

| Failure | Fix |
|---|---|
| Scanner clean, product still collects mail | Inventory beats the scanner. Review the mail and billing surfaces by hand. |
| User wants a full privacy policy drafted as if filed | Write a skeleton and mark every blank the operator must complete. |
| Jurisdiction unknown | Apply the strictest local control that is reversible: no remote identifiers, no default capture, no list without an opt-out path. |
