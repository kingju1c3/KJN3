import React from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';

function AdminDashboard() {
  const systemMetrics = [
    { name: 'CPU Usage', value: 45 },
    { name: 'Memory Usage', value: 62 },
    { name: 'Network Load', value: 78 },
    { name: 'Storage', value: 34 }
  ];

  return (
    <Box p={4}>
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5} mb={8}>
        <Stat p={4} shadow="md" borderRadius="lg" bg="white">
          <StatLabel>Total Users</StatLabel>
          <StatNumber>1,234</StatNumber>
          <StatHelpText>↑ 23% from last month</StatHelpText>
        </Stat>
        <Stat p={4} shadow="md" borderRadius="lg" bg="white">
          <StatLabel>Active Nodes</StatLabel>
          <StatNumber>56</StatNumber>
          <StatHelpText>All clearance levels</StatHelpText>
        </Stat>
        <Stat p={4} shadow="md" borderRadius="lg" bg="white">
          <StatLabel>System Load</StatLabel>
          <StatNumber>67%</StatNumber>
          <Progress value={67} colorScheme="green" size="sm" mt={2} />
        </Stat>
        <Stat p={4} shadow="md" borderRadius="lg" bg="white">
          <StatLabel>Security Status</StatLabel>
          <StatNumber>Optimal</StatNumber>
          <StatHelpText>No threats detected</StatHelpText>
        </Stat>
      </SimpleGrid>

      <Box bg="white" p={4} borderRadius="lg" shadow="md">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Metric</Th>
              <Th>Value</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {systemMetrics.map((metric) => (
              <Tr key={metric.name}>
                <Td>{metric.name}</Td>
                <Td>{metric.value}%</Td>
                <Td>
                  <Progress 
                    value={metric.value} 
                    colorScheme={metric.value < 60 ? 'green' : metric.value < 80 ? 'yellow' : 'red'} 
                    size="sm" 
                    width="200px"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}