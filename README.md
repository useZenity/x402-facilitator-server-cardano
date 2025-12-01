# x402 Facilitator Server

A Node.js/TypeScript server implementation for the x402 payment protocol on Cardano blockchain. This server acts as a facilitator that handles x402 payment verification and resource protection middleware.

## 🚀 Overview

The x402 Facilitator Server provides:

- **Payment Middleware**: Express.js middleware to protect resources with x402 payments
- **Transaction Verification**: Integration with Blockfrost API for Cardano transaction validation
- **Flexible Configuration**: Environment-based configuration for different networks and assets
- **Type Safety**: Full TypeScript implementation with comprehensive type definitions
- **Testing**: Vitest-based test suite with coverage reporting

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

## 🚦 Development

### Available Scripts

| Script             | Description                                 |
| ------------------ | ------------------------------------------- |
| `npm run dev`      | Start development server with hot reload    |
| `npm run build`    | Compile TypeScript to JavaScript            |
| `npm start`        | Start production server from compiled files |
| `npm test`         | Run test suite                              |
| `npm run coverage` | Run tests with coverage report              |

### Development Workflow

1. **Start development server**

   ```bash
   npm run dev
   ```

   The server will start on port 3000 (or your configured PORT) and automatically reload on file changes.

2. **Run tests**

   ```bash
   npm test
   ```

3. **Check coverage**
   ```bash
   npm run coverage
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

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run coverage

# Watch mode (if configured)
npm run test:watch
```

### Test Structure

Tests are located in `src/tests/` and use Vitest as the test runner. Example test:

```typescript
import { describe, it, expect } from "vitest";
import { submitTxBlockfrost } from "../services/blockfrostService";

it("returns error for invalid CBOR", async () => {
  const result = await submitTxBlockfrost(Buffer.from("deadbeef", "hex"));
  expect(result.ok).toBe(false);
  expect(result.error).toMatch(/invalid/i);
});
```

### Coverage Reports

Coverage reports are generated in the `coverage/` directory when running:

```bash
npm run coverage
```

## 🚀 Deployment

### Production Build

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

### Environment-Specific Configuration

For different deployment environments, create separate `.env` files:

```bash
# .env.production
NETWORK=cardano-mainnet
BLOCKFROST_PROJECT_ID=prod_key
PAY_TO=mainnet_address

# .env.staging
NETWORK=cardano-preprod
BLOCKFROST_PROJECT_ID=test_key
PAY_TO=testnet_address
```

### Docker Deployment (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 🔒 Security Considerations

- **Environment Variables**: Never commit `.env` files to version control
- **API Keys**: Keep Blockfrost project IDs secure
- **CORS**: Configure CORS appropriately for your use case
- **Rate Limiting**: Consider implementing rate limiting for payment endpoints
- **Input Validation**: All inputs are validated using Zod schemas

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and add tests
4. Ensure all tests pass: `npm test`
5. Commit your changes: `git commit -am 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Troubleshooting

### Common Issues

#### "Unknown file extension .ts" Error

If you encounter this error, ensure:

- `tsx` is installed as a dev dependency
- `nodemon.json` is configured to use `tsx`
- Your `package.json` has `"type": "module"`

#### Blockfrost API Errors

- Verify your `BLOCKFROST_PROJECT_ID` is correct
- Ensure the network matches your API key (mainnet vs preprod)
- Check your Blockfrost API quota

#### Payment Verification Failures

- Ensure the transaction is on the correct network
- Verify the asset policy ID matches
- Check that the payment amount meets requirements

### Getting Help

- Check the [Issues](../../issues) page for common problems
- Create a new issue with detailed error information
- Include your environment configuration (sans sensitive data)

## 📚 Related Resources

- [Blockfrost API Documentation](https://docs.blockfrost.io/)
- [Cardano Documentation](https://docs.cardano.org/)
- [Express.js Documentation](https://expressjs.com/)

---

**Built with ❤️ for the Cardano ecosystem**
