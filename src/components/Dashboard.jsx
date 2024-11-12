import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Grid, 
  Heading, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText, 
  StatArrow,
  SimpleGrid,
  Progress,
  Text,
  useToast
} from '@chakra-ui/react';
import { networkAPI } from '../api/network';

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchMetrics = async () => {
    try {
      const response = await networkAPI.getNetworkMetrics();
      setMetrics(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching metrics',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading || !metrics) {
    return (
      <Box>
        <Heading mb={6}>Network Dashboard</Heading>
        <Progress size="xs" isIndeterminate />
      </Box>
    );
  }

  const calculateChange = (current, history) => {
    if (!history || history.length < 2) return 0;
    const previous = history[1].value;
    return ((current - previous) / previous) * 100;
  };

  return (
    <Box>
      <Heading mb={6}>Network Dashboard</Heading>
      
      {/* Main Metrics */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Stat p={4} bg="white" rounded="lg" shadow="sm">
          <StatLabel>Active Nodes</StatLabel>
          <StatNumber>{metrics.activeNodes}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            {Math.round(Math.random() * 10)}% from last hour
          </StatHelpText>
        </Stat>

        <Stat p={4} bg="white" rounded="lg" shadow="sm">
          <StatLabel>Network Throughput</StatLabel>
          <StatNumber>{metrics.metrics.throughput.current} Mb/s</StatNumber>
          <StatHelpText>
            <StatArrow 
              type={calculateChange(
                metrics.metrics.throughput.current, 
                metrics.metrics.throughput.history
              ) > 0 ? 'increase' : 'decrease'} 
            />
            {Math.abs(calculateChange(
              metrics.metrics.throughput.current, 
              metrics.metrics.throughput.history
            )).toFixed(1)}% from last hour
          </StatHelpText>
        </Stat>

        <Stat p={4} bg="white" rounded="lg" shadow="sm">
          <StatLabel>Network Reliability</StatLabel>
          <StatNumber>{metrics.metrics.reliability.current}%</StatNumber>
          <Progress 
            value={metrics.metrics.reliability.current} 
            colorScheme={metrics.metrics.reliability.current > 95 ? 'green' : 'yellow'}
            size="sm"
            mt={2}
          />
        </Stat>
      </SimpleGrid>

      {/* Security Stats */}
      <Box bg="white" p={6} rounded="lg" shadow="sm" mb={8}>
        <Heading size="md" mb={4}>Security Status</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Stat>
            <StatLabel>Encryption Strength</StatLabel>
            <StatNumber>{metrics.security.encryptionStrength} bit</StatNumber>
            <StatHelpText>AES Encryption</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Active Connections</StatLabel>
            <StatNumber>{metrics.security.activeConnections}</StatNumber>
            <StatHelpText>Threat Level: {metrics.security.threatLevel}</StatHelpText>
          </Stat>
        </SimpleGrid>
      </Box>

      {/* Network Performance */}
      <Box bg="white" p={6} rounded="lg" shadow="sm">
        <Heading size="md" mb={4}>Network Performance</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Box>
            <Text fontWeight="medium" mb={2}>Bandwidth Usage</Text>
            <Progress 
              value={(metrics.metrics.bandwidth.inbound + metrics.metrics.bandwidth.outbound) / 10}
              colorScheme="blue"
              size="sm"
              mb={2}
            />
            <Text fontSize="sm" color="gray.600">
              In: {metrics.metrics.bandwidth.inbound} Mb/s | 
              Out: {metrics.metrics.bandwidth.outbound} Mb/s
            </Text>
          </Box>
          <Box>
            <Text fontWeight="medium" mb={2}>Latency</Text>
            <Progress 
              value={100 - (metrics.metrics.latency.current / 2)}
              colorScheme={metrics.metrics.latency.current < 30 ? 'green' : 'yellow'}
              size="sm"
              mb={2}
            />
            <Text fontSize="sm" color="gray.600">
              Current: {metrics.metrics.latency.current}ms
            </Text>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
}

export default Dashboard;