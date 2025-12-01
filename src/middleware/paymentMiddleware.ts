import { Request, Response, NextFunction } from "express";
import { PaymentRequirements } from "../types/payment";

// Extend Express Request interface to include payment requirements
declare global {
  namespace Express {
    interface Request {
      paymentRequirements?: PaymentRequirements;
    }
  }
}

/**
 * Payment middleware for x402 protection, extendable with custom configs.
 */
export function paymentMiddleware(requirements: PaymentRequirements) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const xPaymentB64 = req.headers["x-payment"];
    if (!xPaymentB64) {
      return res.status(402).json({ error: "Payment required", requirements });
    }
    // Add logic for verifying/settling x402 transaction here
    req.paymentRequirements = requirements;
    next();
  };
}
