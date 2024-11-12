# Testing Guidelines

## Overview

The project uses Vitest for testing, with React Testing Library for component testing.

## Test Types

### Unit Tests
- Located in `test/unit/`
- Test individual functions and utilities
- Focus on pure logic and data transformations

### Component Tests
- Located in `test/components/`
- Test React components in isolation
- Focus on user interactions and rendering

### Integration Tests
- Located in `test/integration/`
- Test multiple components working together
- Focus on feature workflows

### Hook Tests
- Located in `test/hooks/`
- Test custom React hooks
- Use `@testing-library/react-hooks`

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- NetworkView.test.tsx

# Run tests in watch mode
npm test -- --watch
```

## Writing Tests

### Component Test Example
```typescript
import { render, screen } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### Hook Test Example
```typescript
import { renderHook, act } from '@testing-library/react';
import { useCustomHook } from './useCustomHook';

describe('useCustomHook', () => {
  it('returns expected value', () => {
    const { result } = renderHook(() => useCustomHook());
    expect(result.current.value).toBe(expectedValue);
  });
});
```