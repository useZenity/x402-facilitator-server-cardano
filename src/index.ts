import app from "./app";
import facilitatorRoutes from "./routes/facilitatorRoutes";
import { paymentMiddleware } from "./middleware/paymentMiddleware";
import { PaymentRequirements } from "./types/payment";

const requirements: PaymentRequirements = {
  x402Version: 1,
  scheme: "exact",
  network: process.env.NETWORK || "cardano-mainnet",
  maxAmountRequired: process.env.MAX_AMOUNT || "10000",
  asset: process.env.ASSET_POLICY || "",
  payTo: process.env.PAY_TO || "",
  resource: "/secret",
  description: "Access to premium resource",
  mimeType: "application/json",
  maxTimeoutSeconds: 600,
  extra: { assetNameHex: process.env.ASSET_NAME_HEX || "" },
};

app.use("/secret", paymentMiddleware(requirements), (req, res) => {
  return res.json({
    message: "You’ve unlocked the protected resource via x402.",
  });
});
app.use("/", facilitatorRoutes);

const port = parseInt(process.env.PORT || "5051");
app.listen(port, () => {
  console.log(`Facilitator server running on port ${port}`);
});
