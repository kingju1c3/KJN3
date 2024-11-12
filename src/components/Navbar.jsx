import React from 'react';
import { Box, Flex, Button, Heading, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

function Navbar() {
  return (
    <Box bg={useColorModeValue('white', 'gray.900')} px={4} shadow="sm">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Heading size="md">Decentralized Network</Heading>
        
        <Flex gap={4}>
          <Button as={RouterLink} to="/" variant="ghost">
            Dashboard
          </Button>
          <Button as={RouterLink} to="/network" variant="ghost">
            Network
          </Button>
          <Button as={RouterLink} to="/messages" variant="ghost">
            Messages
          </Button>
          <Button as={RouterLink} to="/admin" variant="ghost">
            Admin
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Navbar;