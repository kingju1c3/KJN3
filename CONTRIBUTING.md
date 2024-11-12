# Contributing to Decentralized Network

Thank you for your interest in contributing! This guide will help you get started with contributing to our decentralized network project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Troubleshooting](#troubleshooting)
- [Security Guidelines](#security-guidelines)
- [Documentation](#documentation)
- [Getting Help](#getting-help)

## Code of Conduct

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Our Responsibilities

Project maintainers are responsible for clarifying standards of acceptable behavior and will take appropriate and fair corrective action in response to any unacceptable behavior.

## Development Setup

### Prerequisites

1. Node.js 18+
2. npm 8+
3. Git
4. Code editor with TypeScript support (VS Code recommended)

### Local Development Environment

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/yourusername/decentralized-network.git
   cd decentralized-network
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your local settings
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- network

# Run tests in watch mode
npm test -- --watch
```

## Development Workflow

### Branching Strategy

We follow the GitFlow branching model:

- `main` - Production releases
- `develop` - Development branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes
- `release/*` - Release preparation

### Commit Messages

Format: `<type>(<scope>): <subject>`

Examples:
```
feat(auth): add multi-factor authentication
fix(network): resolve node connection timeout
docs(readme): update deployment instructions
```

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

## Troubleshooting

### Dependency Installation Issues

#### Common Problems and Solutions

1. **Infinite Installation Loop**
   ```bash
   # Clear npm cache and node_modules
   rm -rf node_modules
   npm cache clean --force
   
   # Install with exact versions
   npm install --save-exact
   ```

2. **Peer Dependency Conflicts**
   - Check package.json for conflicting peer dependencies
   - Use `npm ls` to identify dependency tree issues
   - Resolution:
     ```json
     {
       "overrides": {
         "react": "^18.2.0",
         "@types/react": "^18.2.0"
       }
     }
     ```

3. **Missing Dependencies**
   - Always update both dependencies and devDependencies:
     ```json
     {
       "dependencies": {
         "@chakra-ui/react": "^2.8.2",
         "@emotion/react": "^11.11.1",
         "@emotion/styled": "^11.11.0",
         "axios": "^1.6.2",
         "crypto-js": "^4.2.0",
         "framer-motion": "^10.16.5",
         "react": "^18.2.0",
         "react-dom": "^18.2.0",
         "react-router-dom": "^6.20.0",
         "winston": "^3.11.0",
         "zod": "^3.22.4"
       },
       "devDependencies": {
         "@types/crypto-js": "^4.2.1",
         "@types/node": "^20.10.0",
         "@types/react": "^18.2.37",
         "@types/react-dom": "^18.2.15",
         "@typescript-eslint/eslint-plugin": "^6.12.0",
         "@typescript-eslint/parser": "^6.12.0",
         "@vitejs/plugin-react": "^4.2.0",
         "eslint": "^8.54.0",
         "eslint-config-prettier": "^9.0.0",
         "prettier": "^3.1.0",
         "typescript": "^5.3.2",
         "vite": "^5.0.0"
       }
     }
     ```

4. **Version Mismatch**
   - Use npm-check-updates to safely upgrade:
     ```bash
     npx npm-check-updates
     npx npm-check-updates -u
     npm install
     ```

### Deployment Troubleshooting

1. **Build Failures**
   - Check for:
     - Missing build dependencies
     - Incorrect environment variables
     - TypeScript compilation errors
   - Resolution:
     ```bash
     # Clean build artifacts
     rm -rf dist
     
     # Verify TypeScript compilation
     npx tsc --noEmit
     
     # Build with detailed logs
     npm run build --verbose
     ```

2. **Runtime Errors**
   - Common causes:
     - Missing runtime dependencies
     - Environment variable issues
     - API endpoint configuration
   - Resolution:
     ```bash
     # Verify production dependencies
     npm ci --production
     
     # Check environment variables
     node -e 'console.log(process.env)'
     ```

3. **Performance Issues**
   - Monitor build size:
     ```bash
     # Analyze bundle size
     npx vite-bundle-analyzer
     ```
   - Use code splitting:
     ```javascript
     const Component = React.lazy(() => import('./Component'));
     ```

### Development Environment Issues

1. **Hot Reload Not Working**
   - Clear Vite cache:
     ```bash
     # Remove Vite cache
     rm -rf node_modules/.vite
     ```
   - Check file watchers limit (Linux):
     ```bash
     echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
     sudo sysctl -p
     ```

2. **TypeScript Errors**
   - Verify TypeScript configuration:
     ```bash
     # Check TypeScript version
     npx tsc --version
     
     # Verify configuration
     npx tsc --showConfig
     ```

## Pull Request Guidelines

[Previous PR Guidelines section remains the same...]

## Security Guidelines

[Previous Security Guidelines section remains the same...]

## Documentation

[Previous Documentation section remains the same...]

## Getting Help

[Previous Getting Help section remains the same...]

Thank you for contributing to our project!