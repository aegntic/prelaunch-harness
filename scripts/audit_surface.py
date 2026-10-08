#!/usr/bin/env python3
"""Static surface scanner for the prelaunch-harness control families.

Reads a file or directory and emits JSON findings. It does not decide
legality. It flags patterns that usually need a human control before launch.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

TEXT_SUFFIXES = {
    ".html", ".htm", ".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs",
    ".vue", ".svelte", ".css", ".scss", ".json", ".md", ".mdx",
    ".py", ".rb", ".go", ".php", ".env", ".yml", ".yaml", ".toml",
    ".xml", ".svg",
}

SKIP_DIRS = {
    ".git", "node_modules", "dist", "build", ".next", "vendor",
    "__pycache__", ".venv", "venv", "coverage",
}

RULES = [
    {
        "id": "C1-no-capacity-signal",
        "family": "capacity",
        "severity": "review",
        "pattern": r"(sign[\s_-]?up|create[\s_-]?account|register\b)",
        "note": "Account-creation surface. Confirm a capacity gate exists before collection.",
    },
    {
        "id": "C2-google-fonts",
        "family": "identifier-leak",
        "severity": "high",
        "pattern": r"fonts\.(googleapis|gstatic)\.com",
        "note": "Remote font host. A page can serve the same face without disclosing a network identifier.",
    },
    {
        "id": "C2-remote-font-css",
        "family": "identifier-leak",
        "severity": "medium",
        "pattern": r"fonts\.cdnfonts\.com|use\.typekit\.net|fast\.fonts\.net|cloud\.typography",
        "note": "Third-party font host. Prefer a file you serve.",
    },
    {
        "id": "C2-analytics-pixel",
        "family": "identifier-leak",
        "severity": "medium",
        "pattern": r"googletagmanager\.com|google-analytics\.com|connect\.facebook\.net|static\.ads-twitter\.com|snap\.licdn\.com|cdn\.segment\.com",
        "note": "Third-party tag. Loads an identifier to another controller before any choice.",
    },
    {
        "id": "C3-session-replay",
        "family": "input-capture",
        "severity": "high",
        "pattern": r"fullstory|logrocket|hotjar|mouseflow|smartlook|clarity\.ms|sessionReplay|recordCanvas|maskAllInputs",
        "note": "Session-replay or input-capture vendor. Default-on recording is the failure mode.",
    },
    {
        "id": "C4-marketing-mail",
        "family": "commercial-message",
        "severity": "review",
        "pattern": r"(newsletter|mailing[\s_-]?list|we launched|unsubscribe)",
        "note": "Commercial messaging surface. Confirm opt-out and a real postal identity on every marketing send.",
    },
    {
        "id": "C5-recurring-charge",
        "family": "recurring-assent",
        "severity": "review",
        "pattern": r"(subscription|auto[\s_-]?renew|recurring|per\s*/\s*month|price_)",
        "note": "Recurring-charge surface. Terms belong next to the assent control, not only in a footer.",
    },
    {
        "id": "C6-user-content",
        "family": "user-content",
        "severity": "review",
        "pattern": r"(type=[\"']file[\"']|upload|multipart/form-data|presigned)",
        "note": "User-content surface. Safe-harbor registration is a filing, not a footer line.",
    },
]


def iter_files(root: Path):
    if root.is_file():
        yield root
        return
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.suffix.lower() in TEXT_SUFFIXES or path.name in {".env", "Dockerfile"}:
            yield path


def scan(root: Path, limit: int = 40) -> dict:
    findings = []
    files_seen = 0
    for path in iter_files(root):
        files_seen += 1
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        for rule in RULES:
            for match in re.finditer(rule["pattern"], text, re.IGNORECASE):
                line = text.count("\n", 0, match.start()) + 1
                snippet = text[max(0, match.start() - 40): match.end() + 40].replace("\n", " ")
                findings.append({
                    "rule": rule["id"],
                    "family": rule["family"],
                    "severity": rule["severity"],
                    "path": str(path),
                    "line": line,
                    "note": rule["note"],
                    "snippet": snippet.strip()[:160],
                })
                if len(findings) >= limit:
                    return {
                        "root": str(root),
                        "files_seen": files_seen,
                        "truncated": True,
                        "findings": findings,
                    }
    return {
        "root": str(root),
        "files_seen": files_seen,
        "truncated": False,
        "findings": findings,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Scan a tree for pre-launch control signals.")
    parser.add_argument("path", nargs="?", default=".", help="File or directory to scan")
    parser.add_argument("--limit", type=int, default=40)
    args = parser.parse_args()
    root = Path(args.path)
    if not root.exists():
        print(json.dumps({"error": f"path not found: {root}"}))
        return 2
    json.dump(scan(root, args.limit), sys.stdout, indent=2)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
