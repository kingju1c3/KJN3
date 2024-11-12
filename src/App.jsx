import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import NetworkView from './components/NetworkView';
import MessageCenter from './components/MessageCenter';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Box p={4}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/network" element={<NetworkView />} />
          <Route path="/messages" element={<MessageCenter />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;