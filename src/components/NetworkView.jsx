import React from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

function NetworkView() {
  const nodes = [
    { id: '1', type: 'Master', status: 'Active', clearance: 'Master' },
    { id: '2', type: 'Subordinate', status: 'Active', clearance: 'Top Secret' },
    { id: '3', type: 'Subordinate', status: 'Active', clearance: 'Secret' }
  ];

  return (
    <Box>
      <Heading mb={6}>Network Nodes</Heading>
      <Box bg="white" rounded="lg" shadow="sm" overflow="hidden">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Node ID</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th>Clearance</Th>
            </Tr>
          </Thead>
          <Tbody>
            {nodes.map(node => (
              <Tr key={node.id}>
                <Td>{node.id}</Td>
                <Td>{node.type}</Td>
                <Td>{node.status}</Td>
                <Td>{node.clearance}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

export default NetworkView;