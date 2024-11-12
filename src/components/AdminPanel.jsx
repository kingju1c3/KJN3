import React from 'react';
import { 
  Box, 
  Heading, 
  VStack, 
  Button, 
  useToast, 
  Text,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Progress
} from '@chakra-ui/react';

function AdminPanel() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [updateStatus, setUpdateStatus] = React.useState(null);
  const [updateHistory, setUpdateHistory] = React.useState([
    { timestamp: Date.now() - 86400000, version: '1.0.0', success: true },
    { timestamp: Date.now() - 172800000, version: '0.9.0', success: true }
  ]);

  const handleEmergencyShutdown = () => {
    toast({
      title: 'Emergency Shutdown Initiated',
      description: 'Network shutdown sequence started',
      status: 'warning',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleNetworkReset = () => {
    toast({
      title: 'Network Reset',
      description: 'Network reset completed successfully',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleFirmwareUpdate = async () => {
    onOpen();
    setUpdateStatus('checking');
    
    try {
      // Simulate update process
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUpdateStatus('downloading');
      await new Promise(resolve => setTimeout(resolve, 3000));
      setUpdateStatus('installing');
      await new Promise(resolve => setTimeout(resolve, 4000));
      setUpdateStatus('verifying');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUpdateHistory(prev => [{
        timestamp: Date.now(),
        version: '1.1.0',
        success: true
      }, ...prev]);

      setUpdateStatus('complete');
      
      toast({
        title: 'Firmware Update Successful',
        description: 'System has been updated to version 1.1.0',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      setUpdateStatus('error');
      toast({
        title: 'Update Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getUpdateProgress = () => {
    switch (updateStatus) {
      case 'checking': return 20;
      case 'downloading': return 40;
      case 'installing': return 60;
      case 'verifying': return 80;
      case 'complete': return 100;
      default: return 0;
    }
  };

  return (
    <Box>
      <Heading mb={6}>Admin Control Panel</Heading>
      
      <Alert status="info" mb={6}>
        <AlertIcon />
        <Box>
          <AlertTitle>Current Firmware Version: 1.0.0</AlertTitle>
          <AlertDescription>
            Regular updates help maintain network security and performance.
          </AlertDescription>
        </Box>
      </Alert>

      <VStack spacing={4} align="stretch" mb={8}>
        <Button colorScheme="blue" onClick={handleFirmwareUpdate}>
          Check for Firmware Updates
        </Button>
        <Button colorScheme="red" onClick={handleEmergencyShutdown}>
          Emergency Shutdown
        </Button>
        <Button colorScheme="orange" onClick={handleNetworkReset}>
          Reset Network
        </Button>
      </VStack>

      <Box bg="white" p={4} borderRadius="lg" shadow="sm">
        <Heading size="md" mb={4}>Update History</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Version</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {updateHistory.map((update, index) => (
              <Tr key={index}>
                <Td>{new Date(update.timestamp).toLocaleDateString()}</Td>
                <Td>{update.version}</Td>
                <Td>
                  <Badge colorScheme={update.success ? 'green' : 'red'}>
                    {update.success ? 'Success' : 'Failed'}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Firmware Update in Progress</ModalHeader>
          <ModalBody>
            <Progress value={getUpdateProgress()} mb={4} />
            <Text>
              {updateStatus === 'checking' && 'Checking for updates...'}
              {updateStatus === 'downloading' && 'Downloading firmware...'}
              {updateStatus === 'installing' && 'Installing update...'}
              {updateStatus === 'verifying' && 'Verifying installation...'}
              {updateStatus === 'complete' && 'Update completed successfully!'}
              {updateStatus === 'error' && 'Update failed. Please try again.'}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button 
              onClick={onClose} 
              isDisabled={updateStatus && updateStatus !== 'complete' && updateStatus !== 'error'}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default AdminPanel;