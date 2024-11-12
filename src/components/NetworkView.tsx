import React, { useEffect } from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Badge, Spinner } from '@chakra-ui/react';
import { useNetwork } from '@/hooks/useNetwork';

function NetworkView() {
  const { nodes, isLoading, fetchNodeStatus } = useNetwork();

  useEffect(() => {
    // Fetch status for demo nodes
    ['node1', 'node2', 'node3'].forEach(nodeId => {
      fetchNodeStatus(nodeId);
    });
  }, [fetchNodeStatus]);

  if (isLoading && nodes.size === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box>
      <Heading mb={6}>Network Nodes</Heading>
      <Box bg="white" rounded="lg" shadow="sm" overflow="hidden">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Node ID</Th>
              <Th>Status</Th>
              <Th>Clearance</Th>
              <Th>Last Seen</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.from(nodes.values()).map(node => (
              <Tr key={node.id}>
                <Td>{node.id}</Td>
                <Td>
                  <Badge colorScheme={
                    node.status === 'active' ? 'green' :
                    node.status === 'idle' ? 'yellow' : 'red'
                  }>
                    {node.status}
                  </Badge>
                </Td>
                <Td>{node.clearanceLevel}</Td>
                <Td>{new Date(node.lastSeen).toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}