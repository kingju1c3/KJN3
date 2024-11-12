import React from 'react';
import { Box, Heading, VStack, HStack, Text, Badge } from '@chakra-ui/react';

function MessageCenter() {
  const messages = [
    { id: 1, from: 'Node-1', content: 'System update required', priority: 'high' },
    { id: 2, from: 'Node-2', content: 'Network status normal', priority: 'low' },
    { id: 3, from: 'Node-3', content: 'Security check completed', priority: 'medium' }
  ];

  return (
    <Box>
      <Heading mb={6}>Message Center</Heading>
      <VStack spacing={4} align="stretch">
        {messages.map(message => (
          <Box key={message.id} p={4} bg="white" rounded="lg" shadow="sm">
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="bold">From: {message.from}</Text>
              <Badge colorScheme={
                message.priority === 'high' ? 'red' : 
                message.priority === 'medium' ? 'yellow' : 'green'
              }>
                {message.priority}
              </Badge>
            </HStack>
            <Text>{message.content}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

export default MessageCenter;