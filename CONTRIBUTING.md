# 🤝 Contributing to x402 Cardano Facilitator Server

Thank you for your interest in contributing to the x402 Cardano Facilitator Server! This guide will help you get started with contributing to this project.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contributing Guidelines](#contributing-guidelines)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Review Process](#review-process)
- [Community](#community)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- TypeScript knowledge
- Basic understanding of Cardano blockchain
- Git

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/your-username/x402-facilitator-server.git
   cd x402-facilitator-server
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-owner/x402-facilitator-server.git
   ```

## 🛠️ Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit with your configuration
nano .env
```

Required environment variables:

- `BLOCKFROST_PROJECT_ID` - Your Blockfrost API key
- `NETWORK` - Cardano network (cardano-mainnet or cardano-preprod)
- `PAY_TO` - Payment receiving address
- `MAX_AMOUNT` - Maximum payment amount
- `ASSET_POLICY` - Asset policy ID (optional)
- `ASSET_NAME_HEX` - Asset name in hex (optional)

### 3. Development Server

```bash
# Start development server
npm run dev

# Or with nodemon
npm run dev:watch
```

The server will start on `http://localhost:5051`

## 📁 Project Structure

```
x402-facilitator-server/
├── src/
│   ├── controllers/          # Route handlers
│   │   └── facilitatorController.ts
│   ├── middleware/           # Express middleware
│   │   └── paymentMiddleware.ts
│   ├── routes/              # API routes
│   │   └── facilitatorRoutes.ts
│   ├── services/            # Business logic
│   │   └── blockfrostService.ts
│   ├── types/               # TypeScript type definitions
│   │   └── payment.ts
│   ├── app.ts               # Express app configuration
│   └── index.ts             # Application entry point
├── tests/                   # Test files
├── docs/                    # Documentation
├── .env.example             # Environment template
├── package.json             # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── nodemon.json            # Nodemon configuration
└── README.md               # Project documentation
```

## 📝 Contributing Guidelines

### Types of Contributions

We welcome the following types of contributions:

1. **Bug Fixes** - Fix issues in existing functionality
2. **New Features** - Add new capabilities
3. **Documentation** - Improve docs, guides, and comments
4. **Tests** - Add or improve test coverage
5. **Performance** - Optimize code for better performance
6. **Security** - Improve security measures

### Before You Start

1. **Check existing issues** - Look for related issues or PRs
2. **Create an issue** - For significant changes, create an issue first
3. **Discuss in comments** - Get feedback on your approach
4. **Follow the issue template** - Provide clear, detailed information

### Branch Naming

Use descriptive branch names:

```bash
# Bug fixes
bugfix/fix-payment-verification
bugfix/resolve-timeout-issue

# New features
feature/add-native-asset-support
feature/implement-webhook-notifications

# Documentation
docs/update-api-documentation
docs/add-testing-guide

# Refactoring
refactor/simplify-payment-flow
refactor/improve-error-handling
```

## 📐 Code Standards

### TypeScript Guidelines

- Use **strict TypeScript** configuration
- Provide **type annotations** for all function parameters and return values
- Use **interfaces** for object shapes
- Prefer **const** over **let** when possible
- Use **arrow functions** for callbacks
- Follow **PascalCase** for classes/interfaces
- Follow **camelCase** for variables/functions

### Code Style

```typescript
// ✅ Good
interface PaymentRequirements {
  x402Version: number;
  scheme: string;
  network: string;
}

export const verifyPayment = async (
  requirements: PaymentRequirements
): Promise<{ isValid: boolean; reason?: string }> => {
  // Implementation
};

// ❌ Avoid
function verifyPayment(req) {
  // Missing types
}
```

### Error Handling

- Use **try-catch blocks** for async operations
- Provide **meaningful error messages**
- Log errors appropriately
- Return **consistent error responses**

```typescript
export const settleHandler = async (req: Request, res: Response) => {
  try {
    // Implementation
  } catch (error: any) {
    console.error("Settlement error:", error);
    return res.status(500).json({
      success: false,
      errorReason: "internal_server_error",
      transaction: "",
    });
  }
};
```

### Comments and Documentation

- Add **JSDoc comments** for public functions
- Comment **complex logic**
- Update **README** for API changes
- Include **examples** in documentation

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- facilitatorController.test.ts

# Watch mode
npm run test:watch
```

### Writing Tests

- Write **unit tests** for all functions
- Include **integration tests** for API endpoints
- Use **descriptive test names**
- Test **error cases** and edge cases
- Mock external dependencies

```typescript
// Example test
import { verifyHandler } from "../controllers/facilitatorController";
import { Request, Response } from "express";

describe("verifyHandler", () => {
  it("should return isValid: true for valid payment", async () => {
    const mockReq = {
      body: {
        x_payment_b64: "valid_base64_payment",
        payment_requirements: validRequirements,
      },
    } as Request;

    const mockRes = {
      json: jest.fn(),
    } as unknown as Response;

    await verifyHandler(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({ isValid: true });
  });
});
```

### Test Coverage

- Maintain **80%+ test coverage**
- Focus on **critical paths** and error handling
- Add tests for **new features**
- Update tests for **refactored code**

## 📤 Submitting Changes

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
# Format
type(scope): description

# Examples
feat(payment): add native asset support
fix(api): resolve timeout issue
docs(readme): update installation guide
test(controller): add unit tests for verifyHandler
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style
- `refactor`: Refactoring
- `test`: Tests
- `chore`: Maintenance

### Pull Request Process

1. **Update your branch**:

   ```bash
   git checkout your-branch
   git pull upstream main
   npm install
   npm test
   ```

2. **Create Pull Request**:

   - Use **descriptive title**
   - Fill out **PR template** completely
   - Link **related issues**
   - Add **screenshots** if applicable

3. **PR Requirements**:
   - All tests pass
   - Code follows style guidelines
   - Documentation is updated
   - No merge conflicts

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] All tests pass
- [ ] New tests added
- [ ] Manual testing completed

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Environment variables documented
```

## 🔍 Review Process

### Review Guidelines

- **Be constructive** and respectful
- **Focus on code quality**, not personal preferences
- **Ask questions** if something is unclear
- **Suggest improvements** with specific examples
- **Test the changes** if possible

### Review Checklist

- [ ] Code is **well-structured** and readable
- [ ] **Error handling** is appropriate
- [ ] **Security** considerations are addressed
- [ ] **Performance** impact is acceptable
- [ ] **Tests** are comprehensive
- [ ] **Documentation** is accurate
- [ ] **Breaking changes** are documented

### Merge Process

1. **At least one approval** required
2. **All CI checks** must pass
3. **No merge conflicts**
4. **Squash and merge** for clean history
5. **Delete feature branch** after merge

## 🌐 Community

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Discord** - Real-time chat (if available)

### Code of Conduct

- Be **respectful** and inclusive
- **Welcome** newcomers and help them learn
- **Focus** on what's best for the community
- **Show empathy** toward other community members

### Getting Help

- Check **existing issues** and documentation
- Ask questions in **GitHub Discussions**
- Join our **Discord community**
- Reach out to **maintainers** directly

## 🏆 Recognition

### Contributors

All contributors are recognized in:

- **README.md** - Contributors section
- **Release notes** - Feature attributions
- **Annual report** - Top contributors

### Becoming a Maintainer

Active contributors may be invited to become maintainers:

- **Consistent quality** contributions
- **Community leadership**
- **Code review** participation
- **Documentation** improvements

## 📚 Resources

### Development Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [Cardano Documentation](https://docs.cardano.org/)
- [Blockfrost API](https://docs.blockfrost.io/)

### x402 Protocol

- [x402 Specification](https://github.com/x402/specification)
- [Protocol Examples](https://github.com/x402/examples)
- [Community Forum](https://forum.x402.org/)

### Tools and Libraries

- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting
- [Jest](https://jestjs.io/) - Testing framework
- [Husky](https://typicode.github.io/husky/) - Git hooks

## 🎉 Thank You!

Thank you for contributing to the x402 Cardano Facilitator Server! Your contributions help make blockchain payments more accessible and secure for everyone.

If you have any questions or need help getting started, don't hesitate to reach out to our community.

---

**Happy coding! 🚀**
