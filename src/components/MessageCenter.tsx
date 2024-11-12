import React, { useCallback } from 'react';
import { Box, Heading, VStack, HStack, Text, Badge, Button } from '@chakra-ui/react';
import { useNetwork } from '@/hooks/useNetwork';
import type { Message } from '@/types/network';

function MessageCenter() {
  const { messages, sendMessage, isLoading } = useNetwork();

  const handleResend = useCallback(async (message: Message) => {
    await sendMessage({
      content: message.content,
      sender: message.sender,
      priority: message.priority
    });
  }, [sendMessage]);

  return (
    <Box>
      <Heading mb={6}>Message Center</Heading>
      <VStack spacing={4} align="stretch">
        {messages.map(message => (
          <Box key={message.id} p={4} bg="white" rounded="lg" shadow="sm">
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="bold">From: {message.sender}</Text>
              <Badge colorScheme={
                message.priority === 'high' ? 'red' : 
                message.priority === 'medium' ? 'yellow' : 'green'
              }>
                {message.priority}
              </Badge>
            </HStack>
            <Text mb={3}>{message.content}</Text>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.500">
                {new Date(message.timestamp).toLocaleString()}
              </Text>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => handleResend(message)}
                isLoading={isLoading}
              >
                Resend
              </Button>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}