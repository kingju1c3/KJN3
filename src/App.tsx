import { ChakraProvider, Box } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '@/utils/ErrorBoundary';
import AppRoutes from '@/routes';
import Navbar from '@/components/Navbar';
import { theme } from '@/theme';

function App() {
  return (
    <ErrorBoundary>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <Box minH="100vh" bg="gray.50">
            <Navbar />
            <Box p={4}>
              <AppRoutes />
            </Box>
          </Box>
        </BrowserRouter>
      </ChakraProvider>
    </ErrorBoundary>
  );
}

export default App;