import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Badge, IconButton } from '@chakra-ui/react';
import { FaPowerOff, FaEdit, FaTrash } from 'react-icons/fa';

function NodeControl() {
  const nodes = [
    { id: 1, name: 'Node-Alpha', type: 'AI', status: 'active', clearance: 'TOP_SECRET' },
    { id: 2, name: 'Node-Beta', type: 'Human', status: 'idle', clearance: 'SECRET' },
    // Add more nodes as needed
  ];

  return (
    <Box bg="white" p={6} borderRadius="lg" shadow="md">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Node ID</Th>
            <Th>Name</Th>
            <Th>Type</Th>
            <Th>Status</Th>
            <Th>Clearance</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {nodes.map((node) => (
            <Tr key={node.id}>
              <Td>{node.id}</Td>
              <Td>{node.name}</Td>
              <Td>
                <Badge colorScheme={node.type === 'AI' ? 'purple' : 'green'}>
                  {node.type}
                </Badge>
              </Td>
              <Td>
                <Badge colorScheme={node.status === 'active' ? 'green' : 'yellow'}>
                  {node.status}
                </Badge>
              </Td>
              <Td>{node.clearance}</Td>
              <Td>
                <IconButton
                  aria-label="Power"
                  icon={<FaPowerOff />}
                  size="sm"
                  mr={2}
                  colorScheme="blue"
                />
                <IconButton
                  aria-label="Edit"
                  icon={<FaEdit />}
                  size="sm"
                  mr={2}
                  colorScheme="green"
                />
                <IconButton
                  aria-label="Delete"
                  icon={<FaTrash />}
                  size="sm"
                  colorScheme="red"
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default NodeControl;