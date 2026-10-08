# prelaunch-harness

<p align="center">
  <img src="assets/mark.svg" alt="" width="88">
</p>

<p align="center">
  <strong>Six controls. Any harness. No jurisdiction baked in.</strong><br>
  A pre-launch skill for agent-built products.<br>
  Engineering checklist. Not a law firm.
</p>

<p align="center">
  <a href="https://agentskills.io/specification">Agent Skills</a>
  &nbsp;&middot;&nbsp;
  <a href="./SKILL.md">SKILL.md</a>
  &nbsp;&middot;&nbsp;
  <a href="./references/controls.md">Controls</a>
  &nbsp;&middot;&nbsp;
  MIT
</p>

---

An agent that can ship a site can also ship a remote font request, a recorder that starts on load, a list with no refusal path, a renewal buried in a footer, and an upload box with no notice path. Those are six different surfaces. They fail the same way: the control was never in the tree.

This repo is that control, packaged so Claude Code, Codex, Cursor, Gemini CLI, OpenCode, Grok, and any other Agent Skills runtime can load the same folder.

```
boundary → inventory → scan → map → patch only what is local → report
```

## Install

`SKILL.md` must sit directly inside the skill folder. One extra nesting level and the harness will not see it.

| Harness | Path |
|---|---|
| Claude Code, project | `.claude/skills/prelaunch-harness/` |
| Claude Code, user | `~/.claude/skills/prelaunch-harness/` |
| Codex, Cursor, Gemini CLI, OpenCode | `.agents/skills/prelaunch-harness/` or `~/.agents/skills/prelaunch-harness/` |
| Any Agent Skills runtime | the directory your runtime already reads |

```bash
git clone https://github.com/aegntic/prelaunch-harness.git
# project-local, Claude Code
mkdir -p .claude/skills
cp -R prelaunch-harness .claude/skills/prelaunch-harness
```

Start a new session after install. The description is the trigger. Phrases that should load it: pre-launch audit, ship checklist, remote fonts, session replay, marketing mail, auto-renew, designated agent.

## The six families

| ID | Family | Fail state | Local patch |
|---|---|---|---|
| C1 | capacity | Account or PII with no capacity signal | Attestation at the collection point |
| C2 | identifier-leak | Browser contacts a third party for an asset you can host | System stack, self-host, or delete the tag |
| C3 | input-capture | Recorder starts before a choice | Remove, or off until consent, inputs masked |
| C4 | commercial-message | Marketing send with no refusal path or postal identity | Transactional only, until both exist |
| C5 | recurring-assent | Price and cadence not beside the pay control | Render them on the control |
| C6 | user-content | Uploads live, notice path not filed | Uploads off until the operator confirms the filing |

Detail, signals, and forbidden claims: [references/controls.md](references/controls.md).

C2 is the one that is usually already true on a generated page. A regional court in Munich in January 2022 awarded a visitor €100 because a Google-hosted font disclosed an IP that local hosting would have avoided. The skill treats that as a reason to delete the request, not as a global fine schedule.

## Scan

```bash
python3 scripts/audit_surface.py path/to/app
```

JSON on stdout. `high` is a remote disclosure or capture pattern. `review` means the surface exists and the control was not proven. A clean scan is not a pass. Mail, billing, and filings are often outside the tree. The inventory in [references/surfaces.md](references/surfaces.md) is the other half.

## Report

Agents emit [references/report-contract.md](references/report-contract.md):

1. Boundary line. Not a legal opinion.
2. Surfaces: present, absent, or unknown.
3. One row per family.
4. Patches that are local and reversible.
5. Blanks only the operator can fill. No invented street address. No invented filing.

Template: [assets/findings.template.md](assets/findings.template.md).

## Layout

```
prelaunch-harness/
├── SKILL.md                 # harness entry
├── scripts/audit_surface.py # deterministic signals
├── references/
│   ├── INDEX.md
│   ├── controls.md
│   ├── surfaces.md
│   └── report-contract.md
├── assets/
│   ├── findings.template.md
│   └── mark.svg
└── evals/
```

## What this will not do

- Tell you the product is compliant.
- Pick a governing law.
- File a designated agent, write a real postal address, or register a list.
- Treat a social-post penalty figure as an expected loss.

Operator-owned facts stay operator-owned. The harness keeps the agent from papering over them.

## License

MIT. Use it, fork it, vendor it into a private harness. The disclaimer travels with the skill.
