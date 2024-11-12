import React from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
} from '@chakra-ui/react';

function PremiumDashboard() {
  return (
    <Box p={4}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
        <Stat p={4} shadow="md" borderRadius="lg" bg="white">
          <StatLabel>Network Status</StatLabel>
          <StatNumber>Premium</StatNumber>
          <StatHelpText>Enhanced access enabled</StatHelpText>
        </Stat>
        <Stat p={4} shadow="md" borderRadius="lg" bg="white">
          <StatLabel>Available Nodes</StatLabel>
          <StatNumber>12</StatNumber>
          <StatHelpText>Including premium nodes</StatHelpText>
        </Stat>
        <Stat p={4} shadow="md" borderRadius="lg" bg="white">
          <StatLabel>Network Speed</StatLabel>
          <StatNumber>1.2 Gb/s</StatNumber>
          <Progress value={80} colorScheme="green" size="sm" mt={2} />
        </Stat>
      </SimpleGrid>
    </Box>
  );
}