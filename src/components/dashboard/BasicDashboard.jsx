import React from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';

function BasicDashboard() {
  return (
    <Box p={4}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
        <Stat p={4} shadow="md" borderRadius="lg" bg="white">
          <StatLabel>Network Status</StatLabel>
          <StatNumber>Online</StatNumber>
          <StatHelpText>Basic access enabled</StatHelpText>
        </Stat>
        <Stat p={4} shadow="md" borderRadius="lg" bg="white">
          <StatLabel>Available Nodes</StatLabel>
          <StatNumber>3</StatNumber>
          <StatHelpText>Public nodes</StatHelpText>
        </Stat>
      </SimpleGrid>
    </Box>
  );
}