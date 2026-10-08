const { receiptFor } = require("../scan");

const PRICE = {
  amount: "20000",
  network: "eip155:8453",
  asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
};

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST { subject, files: [{ path, content }] }" });
    return;
  }
  const payTo = process.env.PAY_TO;
  const paid = req.headers["x-payment"] || req.headers["payment-signature"];
  if (payTo && !paid) {
    res.status(402).json({
      error: "Payment required",
      x402Version: 2,
      accepts: [{
        scheme: "exact",
        network: PRICE.network,
        amount: PRICE.amount,
        asset: PRICE.asset,
        payTo,
        extra: { name: "USDC", version: "2" }
      }],
      note: "0.02 USDC for one scan receipt. A receipt is not a certification."
    });
    return;
  }
  res.status(200).json(receiptFor(req.body || {}));
};
