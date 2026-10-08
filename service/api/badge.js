function badge(id) {
  const token = String(id || "receipt").replace(/[^a-z0-9]/gi, "").slice(0, 12) || "receipt";
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="248" height="48" viewBox="0 0 248 48" role="img" aria-label="Scan receipt ${token}. Not a certification.">
  <rect width="248" height="48" rx="6" fill="#0A0A0A"/>
  <rect x="1" y="1" width="246" height="46" rx="5" fill="none" stroke="#7DD3E0" stroke-width="1"/>
  <circle cx="24" cy="24" r="6" fill="#DC2626"/>
  <text x="40" y="20" fill="#F4F4F5" font-family="ui-sans-serif,system-ui,sans-serif" font-size="11" font-weight="700" letter-spacing="1.4">SCAN RECEIPT</text>
  <text x="40" y="35" fill="#A1A1AA" font-family="ui-monospace,monospace" font-size="10">${token} \u00b7 not a certification</text>
</svg>`;
}

module.exports = async function handler(req, res) {
  const raw = (req.query && req.query.id) || "";
  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300");
  res.status(200).send(badge(raw));
};
