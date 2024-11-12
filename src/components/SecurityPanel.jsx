import React from 'react';
import { Box, VStack, HStack, Text, Progress, Badge } from '@chakra-ui/react';

function SecurityPanel() {
  const securityMetrics = [
    { name: 'Encryption Strength', value: 98, status: 'optimal' },
    { name: 'Network Integrity', value: 95, status: 'good' },
    { name: 'Threat Detection', value: 100, status: 'active' },
    { name: 'Node Authentication', value: 97, status: 'secure' }
  ];

  return (
    <Box bg="white" p={6} borderRadius="lg" shadow="md">
      <VStack spacing={6} align="stretch">
        {securityMetrics.map((metric) => (
          <Box key={metric.name}>
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="medium">{metric.name}</Text>
              <Badge
                colorScheme={metric.value > 95 ? 'green' : 'yellow'}
              >
                {metric.status}
              </Badge>
            </HStack>
            <Progress
              value={metric.value}
              colorScheme={metric.value > 95 ? 'green' : 'yellow'}
              borderRadius="full"
              size="sm"
            />
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

export default SecurityPanel;