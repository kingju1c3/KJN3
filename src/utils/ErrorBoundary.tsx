import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { logger } from './logger';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <Box role="alert" p={4} textAlign="center">
      <Heading size="lg" mb={4}>Something went wrong</Heading>
      <Text mb={4}>{error.message}</Text>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </Box>
  );
}

export function ErrorBoundary({ children }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        logger.error('Error caught by boundary:', { error, info });
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}