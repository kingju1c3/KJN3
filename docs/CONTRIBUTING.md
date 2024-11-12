# Contributing to Decentralized Network

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a new branch for your feature/fix
4. Make your changes
5. Write/update tests
6. Submit a pull request

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

## Testing

We use Vitest for testing. Please ensure all new code includes appropriate tests.

### Test Structure

- `test/unit/` - Unit tests for utilities and functions
- `test/components/` - React component tests
- `test/integration/` - Integration tests
- `test/hooks/` - Custom React hook tests

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- NetworkView.test.tsx
```

## Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Use ESLint and Prettier for formatting
- Keep files small and focused
- Write meaningful commit messages

## Pull Request Process

1. Update documentation for any new features
2. Add or update tests as needed
3. Ensure all tests pass
4. Update the README if needed
5. Submit the PR with a clear description

## Security

- Never commit sensitive data
- Report security vulnerabilities via email only
- Follow secure coding practices