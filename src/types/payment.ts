export interface PaymentRequirements {
  x402Version: number;
  scheme: string;
  network: string;
  maxAmountRequired: string;
  asset: string;
  payTo: string;
  resource: string;
  description?: string;
  mimeType?: string;
  outputSchema?: unknown;
  maxTimeoutSeconds?: number;
  extra?: Record<string, any>;
}

export interface XPayment {
  x402Version: number;
  scheme: string;
  network: string;
  payload: {
    transaction: string;
    [key: string]: any;
  };
}
