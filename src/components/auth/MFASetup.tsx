import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Image,
  Input,
  Button,
  useToast
} from '@chakra-ui/react';
import { TOTPService } from '@/security/mfa/TOTPService';

const totpService = TOTPService.getInstance();

interface MFASetupProps {
  username: string;
  onComplete: () => void;
}

export default function MFASetup({ username, onComplete }: MFASetupProps) {
  const [qrCode, setQrCode] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  React.useEffect(() => {
    setupMFA();
  }, []);

  const setupMFA = async () => {
    try {
      const { qrCode } = await totpService.setupMFA(username);
      setQrCode(qrCode);
    } catch (error) {
      toast({
        title: 'MFA Setup Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const verifySetup = async () => {
    setIsLoading(true);
    try {
      const isValid = totpService.verifyToken(username, verificationCode);
      if (isValid) {
        toast({
          title: 'MFA Setup Complete',
          status: 'success',
          duration: 3000,
        });
        onComplete();
      } else {
        throw new Error('Invalid verification code');
      }
    } catch (error) {
      toast({
        title: 'Verification Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderRadius="lg" boxShadow="lg" bg="white">
      <VStack spacing={6}>
        <Heading size="lg">Setup Two-Factor Authentication</Heading>
        
        <Text>Scan this QR code with your authenticator app:</Text>
        
        {qrCode && (
          <Image 
            src={qrCode} 
            alt="MFA QR Code" 
            boxSize="200px"
            border="1px"
            borderColor="gray.200"
            borderRadius="md"
          />
        )}

        <Text>Enter the verification code from your app:</Text>
        
        <Input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Enter 6-digit code"
          maxLength={6}
        />

        <Button
          colorScheme="blue"
          isLoading={isLoading}
          onClick={verifySetup}
          isDisabled={verificationCode.length !== 6}
          width="100%"
        >
          Verify Setup
        </Button>
      </VStack>
    </Box>
  );
}