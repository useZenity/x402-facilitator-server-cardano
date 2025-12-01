import { Request, Response } from "express";
import { PaymentRequirements, XPayment } from "../types/payment";
import {
  submitTxBlockfrost,
  checkTxOutput,
} from "../services/blockfrostService";
import base64 from "base-64";

const SUBMITTED: Record<string, string> = {};

export const verifyHandler = async (req: Request, res: Response) => {
  const { x_payment_b64, payment_requirements } = req.body;
  try {
    const xPayment: XPayment = JSON.parse(base64.decode(x_payment_b64));
    if (
      xPayment.x402Version !== 1 ||
      xPayment.scheme !== "exact" ||
      !["cardano", "cardano-mainnet"].includes(xPayment.network)
    ) {
      return res.json({
        isValid: false,
        invalidReason: "invalid_x402_version/scheme/network",
      });
    }
    const txB64 = xPayment.payload?.transaction;
    if (!txB64 || !base64.decode(txB64)) {
      return res.json({ isValid: false, invalidReason: "invalid_payload" });
    }
    return res.json({ isValid: true });
  } catch (err: any) {
    return res.json({ isValid: false, invalidReason: "invalid_payload" });
  }
};

export const settleHandler = async (req: Request, res: Response) => {
  const { x_payment_b64, payment_requirements } = req.body;
  try {
    const accepts = payment_requirements.accepts?.[0];
    if (!accepts)
      return res.json({
        success: false,
        errorReason: "invalid_payment_requirements",
        transaction: "",
      });

    const payTo = accepts.payTo;
    const unit =
      (accepts.asset || "") + ((accepts.extra || {}).assetNameHex || "");
    const minAmt = parseInt(accepts.maxAmountRequired || "0");

    const xPayment: XPayment = JSON.parse(base64.decode(x_payment_b64));
    const txB64 = xPayment.payload?.transaction;
    const rawCbor = Buffer.from(base64.decode(txB64), "binary");
    const key = require("crypto")
      .createHash("sha256")
      .update(rawCbor)
      .digest("hex");

    if (SUBMITTED[key]) {
      const txHash = SUBMITTED[key];
      const okNow = await checkTxOutput(txHash, payTo, unit, minAmt, 1);
      if (okNow)
        return res.json({
          success: true,
          transaction: txHash,
          network: process.env.NETWORK,
        });
      return res.status(202).json({
        success: false,
        errorReason: "invalid_transaction_state",
        transaction: txHash,
        pending: true,
      });
    }

    const result = await submitTxBlockfrost(rawCbor);
    if (!result.ok || !result.txHash) {
      return res.json({
        success: false,
        errorReason: result.error || "invalid_transaction_state",
        transaction: "",
      });
    }
    SUBMITTED[key] = result.txHash;
    return res.status(202).json({
      success: false,
      errorReason: "invalid_transaction_state",
      transaction: result.txHash,
      pending: true,
    });
  } catch (err: any) {
    return res.json({
      success: false,
      errorReason: "invalid_payload",
      transaction: "",
    });
  }
};

export const statusHandler = async (req: Request, res: Response) => {
  const { transaction, payment_requirements } = req.body;
  try {
    const accepts = payment_requirements.accepts?.[0];
    if (!transaction || !accepts) {
      return res.json({
        success: false,
        errorReason: "invalid_payment_requirements",
        transaction: "",
      });
    }
    const payTo = accepts.payTo;
    const unit =
      (accepts.asset || "") + ((accepts.extra || {}).assetNameHex || "");
    const minAmt = parseInt(accepts.maxAmountRequired || "0");

    const ok = await checkTxOutput(transaction, payTo, unit, minAmt, 1);
    if (ok)
      return res.json({
        success: true,
        transaction,
        network: process.env.NETWORK,
      });
    return res.status(202).json({
      success: false,
      errorReason: "invalid_transaction_state",
      transaction,
      pending: true,
    });
  } catch {
    return res.json({
      success: false,
      errorReason: "unexpected_settle_error",
      transaction,
    });
  }
};

export const supportedHandler = (req: Request, res: Response) => {
  res.json({
    kinds: [{ x402Version: 1, scheme: "exact", network: process.env.NETWORK }],
  });
};

export const healthHandler = (req: Request, res: Response) => {
  res.json({ ok: true });
};
