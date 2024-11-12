import React from 'react';
import { Box, VStack, Icon, Tooltip, Text } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaNetworkWired, FaRobot, FaEnvelope, FaShieldAlt } from 'react-icons/fa';

const MenuItem = ({ icon, label, path, isActive }) => (
  <Tooltip label={label} placement="right">
    <Box
      p={3}
      cursor="pointer"
      borderRadius="md"
      bg={isActive ? 'blue.500' : 'transparent'}
      color={isActive ? 'white' : 'gray.600'}
      _hover={{ bg: isActive ? 'blue.600' : 'blue.100' }}
      mb={2}
    >
      <Icon as={icon} boxSize={6} />
    </Box>
  </Tooltip>
);

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: FaHome, label: 'Dashboard', path: '/' },
    { icon: FaNetworkWired, label: 'Network Map', path: '/network' },
    { icon: FaRobot, label: 'Node Control', path: '/nodes' },
    { icon: FaEnvelope, label: 'Message Center', path: '/messages' },
    { icon: FaShieldAlt, label: 'Security Panel', path: '/security' }
  ];

  return (
    <Box
      w="70px"
      bg="white"
      borderRight="1px"
      borderColor="gray.200"
      py={4}
      shadow="md"
    >
      <VStack spacing={4}>
        {menuItems.map((item) => (
          <MenuItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            isActive={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </VStack>
    </Box>
  );
}

export default Sidebar;