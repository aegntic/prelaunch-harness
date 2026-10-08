const crypto = require("crypto");

const RULES = [
  { id: "C2-google-fonts", family: "identifier-leak", severity: "high", pattern: /fonts\.(googleapis|gstatic)\.com/i, note: "Remote font host." },
  { id: "C2-remote-font", family: "identifier-leak", severity: "medium", pattern: /fonts\.cdnfonts\.com|use\.typekit\.net|fast\.fonts\.net/i, note: "Third-party font host." },
  { id: "C2-analytics-pixel", family: "identifier-leak", severity: "medium", pattern: /googletagmanager\.com|google-analytics\.com|connect\.facebook\.net|cdn\.segment\.com/i, note: "Third-party tag." },
  { id: "C3-session-replay", family: "input-capture", severity: "high", pattern: /fullstory|logrocket|hotjar|mouseflow|smartlook|clarity\.ms|sessionReplay/i, note: "Session replay or input capture." },
  { id: "C1-capacity", family: "capacity", severity: "review", pattern: /sign[\s_-]?up|create[\s_-]?account|register\b/i, note: "Account surface. Capacity gate not proven." },
  { id: "C4-mail", family: "commercial-message", severity: "review", pattern: /newsletter|mailing[\s_-]?list|unsubscribe/i, note: "Commercial message surface." },
  { id: "C5-recurring", family: "recurring-assent", severity: "review", pattern: /subscription|auto[\s_-]?renew|recurring|per\s*\/\s*month/i, note: "Recurring charge surface." },
  { id: "C6-upload", family: "user-content", severity: "review", pattern: /type=["']file["']|multipart\/form-data|presigned/i, note: "User-content surface." }
];

const FAMILIES = ["capacity", "identifier-leak", "input-capture", "commercial-message", "recurring-assent", "user-content"];

function scanFiles(files) {
  const findings = [];
  const hashes = [];
  for (const file of files) {
    const path = String(file.path || "untitled").slice(0, 180);
    const text = String(file.content || "").slice(0, 200000);
    hashes.push(path + "\0" + text);
    const lines = text.split("\n");
    for (const rule of RULES) {
      lines.forEach((line, index) => {
        if (rule.pattern.test(line) && findings.length < 40) {
          findings.push({ rule: rule.id, family: rule.family, severity: rule.severity, path, line: index + 1, note: rule.note });
        }
      });
    }
  }
  const treeHash = crypto.createHash("sha256").update(hashes.join("\n")).digest("hex").slice(0, 16);
  return { findings, treeHash, fileCount: files.length };
}

function familyTable(findings) {
  return FAMILIES.map((family) => {
    const hits = findings.filter((item) => item.family === family);
    const high = hits.some((item) => item.severity === "high");
    return {
      family,
      status: hits.length === 0 ? "absent" : high ? "fail" : "review",
      evidence: hits.length ? hits[0].path + ":" + hits[0].line : "not in submitted files"
    };
  });
}

function receiptFor(body) {
  const files = Array.isArray(body.files) ? body.files.slice(0, 30) : [];
  const scanned = scanFiles(files);
  const issuedAt = new Date().toISOString();
  const id = crypto.createHash("sha256").update(scanned.treeHash + issuedAt).digest("hex").slice(0, 12);
  const receipt = {
    boundary: "Engineering signals only. Not a certification, not a verification, not legal advice. The operator remains responsible for launch.",
    id,
    treeHash: scanned.treeHash,
    issuedAt,
    subject: String(body.subject || "untitled").slice(0, 80),
    fileCount: scanned.fileCount,
    families: familyTable(scanned.findings),
    findings: scanned.findings,
    badge: "/badge/" + id + ".svg",
    forbiddenClaims: ["certified", "verified", "checked by", "compliant", "approved", "safe to launch"]
  };
  const secret = process.env.RECEIPT_SECRET || "prelaunch-dev-secret";
  receipt.sig = crypto.createHmac("sha256", secret).update(id + receipt.treeHash + issuedAt).digest("hex").slice(0, 16);
  return receipt;
}

module.exports = { receiptFor };
