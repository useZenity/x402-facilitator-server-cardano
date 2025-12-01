# x402 Facilitator Server

A Node.js/TypeScript server implementation for the x402 payment protocol on Cardano blockchain. This server acts as a facilitator that handles x402 payment verification and resource protection middleware.

## 🚀 Overview

The x402 Facilitator Server provides:

- **Payment Middleware**: Express.js middleware to protect resources with x402 payments
- **Transaction Verification**: Integration with Blockfrost API for Cardano transaction validation
- **Flexible Configuration**: Environment-based configuration for different networks and assets
- **Type Safety**: Full TypeScript implementation with comprehensive type definitions
- **Testing**: Vitest-based test suite with coverage reporting
- **API Testing Guide**: Refer to the [API Testing Guide](https://example.com/api-testing-guide) for detailed instructions on testing the API endpoints.

## 📋 Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher
- **Blockfrost API Key**: Get one from [blockfrost.io](https://blockfrost.io)
- **Cardano Address**: For receiving payments
- **Environment**: Support for both Cardano mainnet and preprod testnet

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd x402-facilitator-server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
########################################
# Core server config
########################################

# Network for the facilitator
# Allowed: cardano-mainnet | cardano-preprod
NETWORK=cardano-mainnet

# HTTP port your Node.js facilitator listens on
PORT=3000

########################################
# Blockfrost configuration
########################################

# Blockfrost project ID for the selected NETWORK
BLOCKFROST_PROJECT_ID=your_blockfrost_project_id_here

########################################
# Payment recipient configuration
########################################

# Cardano address that will receive the payment
PAY_TO=addr1q...

########################################
# Asset configuration
########################################

# Native asset policy ID
ASSET_POLICY=c48cbb3d5e57ed56e276bc45f99ab39abe94e6cd7ac39fb402da47ad

# Asset name in hex (USDM -> 0014df105553444d)
ASSET_NAME_HEX=0014df105553444d

# Amount in base units (depends on token decimals)
MAX_AMOUNT=10000   # 0.01 USDM for 6 decimal tokens
```

### Network Configuration

#### For Mainnet Deployment:

```bash
NETWORK=cardano-mainnet
BLOCKFROST_PROJECT_ID=<your mainnet key>
PAY_TO=<your mainnet address>
```

#### For Testnet (Preprod) Deployment:

```bash
NETWORK=cardano-preprod
BLOCKFROST_PROJECT_ID=<your preprod key>
PAY_TO=<your preprod test address>
```

## 🏗️ Project Structure

```
x402-facilitator-server/
├── src/
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Express middleware
│   │   └── paymentMiddleware.ts  # x402 payment protection
│   ├── routes/              # API route definitions
│   ├── services/            # External service integrations
│   │   └── blockfrostService.ts  # Blockfrost API client
│   ├── types/               # TypeScript type definitions
│   │   └── payment.ts       # Payment-related types
│   ├── app.ts               # Express app configuration
│   └── index.ts             # Application entry point
├── src/tests/               # Test files
├── .env.example             # Environment template
├── nodemon.json            # Nodemon configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vitest.config.js        # Test configuration
└── README.md               # This file
```

## 🔌 API Endpoints

### Protected Resource Example

The server includes an example protected endpoint at `/secret`:

```typescript
app.use("/secret", paymentMiddleware(requirements), (req, res) => {
  return res.json({
    message: "You've unlocked the protected resource via x402.",
  });
});
```

### Request Flow

1. Client makes request to protected resource
2. `paymentMiddleware` checks for `x-payment` header
3. If missing, returns 402 with payment requirements
4. If present, validates the payment transaction
5. On successful validation, grants access to resource

### Response Format

#### Payment Required (402)

```json
{
  "error": "Payment required",
  "requirements": {
    "x402Version": 1,
    "scheme": "exact",
    "network": "cardano-mainnet",
    "maxAmountRequired": "10000",
    "asset": "c48cbb3d5e57ed56e276bc45f99ab39abe94e6cd7ac39fb402da47ad",
    "payTo": "addr1q...",
    "resource": "/secret",
    "description": "Access to premium resource",
    "mimeType": "application/json",
    "maxTimeoutSeconds": 600,
    "extra": {
      "assetNameHex": "0014df105553444d"
    }
  }
}
```

#### Success (200)

```json
{
  "message": "You've unlocked the protected resource via x402."
}
```

## 🔧 Middleware Usage

### Basic Usage

```typescript
import { paymentMiddleware } from "./middleware/paymentMiddleware";
import { PaymentRequirements } from "./types/payment";

const requirements: PaymentRequirements = {
  x402Version: 1,
  scheme: "exact",
  network: "cardano-mainnet",
  maxAmountRequired: "10000",
  asset: "your-asset-policy",
  payTo: "your-address",
  resource: "/your-resource",
  description: "Access to premium resource",
  mimeType: "application/json",
  maxTimeoutSeconds: 600,
};

app.use("/your-resource", paymentMiddleware(requirements), yourHandler);
```

### Custom Requirements

You can define different payment requirements for different resources:

```typescript
const premiumRequirements: PaymentRequirements = {
  // ... premium pricing
  maxAmountRequired: "100000", // Higher amount
};

const basicRequirements: PaymentRequirements = {
  // ... basic pricing
  maxAmountRequired: "10000", // Lower amount
};

app.use("/premium", paymentMiddleware(premiumRequirements), premiumHandler);
app.use("/basic", paymentMiddleware(basicRequirements), basicHandler);
```

## 🧪 Testing

For detailed testing instructions, see our [API Testing Guide](./TESTING.md) and [Contributing Guide](./CONTRIBUTING.md#testing).

## 🚀 Deployment

For detailed deployment instructions, see our [Contributing Guide](./CONTRIBUTING.md#deployment).

## 🔒 Security

- **Environment Variables**: Never commit `.env` files to version control
- **API Keys**: Keep Blockfrost project IDs secure
- **CORS**: Configure CORS appropriately for your use case
- **Rate Limiting**: Consider implementing rate limiting for payment endpoints
- **Input Validation**: All inputs are validated using Zod schemas

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](./CONTRIBUTING.md) for detailed instructions on development setup, code standards, testing requirements, and submitting pull requests.

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

For detailed troubleshooting guides, see our [Contributing Guide](./CONTRIBUTING.md#troubleshooting).

## 📚 Related Resources

- [Blockfrost API Documentation](https://docs.blockfrost.io/)
- [Cardano Documentation](https://docs.cardano.org/)
- [Express.js Documentation](https://expressjs.com/)

---

**Built with ❤️ for the Cardano ecosystem**
