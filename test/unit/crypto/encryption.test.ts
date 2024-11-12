import { describe, it, expect } from 'vitest';
import { E2EEncryption } from '../../../src/security/encryption';

describe('E2EEncryption', () => {
  it('generates valid key pair', () => {
    const encryption = new E2EEncryption();
    const keyPair = encryption.generateKeyPair();
    
    expect(keyPair.publicKey).toBeDefined();
    expect(keyPair.privateKey).toBeDefined();
    expect(typeof keyPair.publicKey).toBe('string');
    expect(typeof keyPair.privateKey).toBe('string');
  });

  it('encrypts and decrypts message correctly', async () => {
    const encryption = new E2EEncryption();
    const message = 'Test secret message';
    
    const encrypted = await encryption.encryptMessage(
      message,
      encryption.getPublicKey()
    );
    
    const decrypted = await encryption.decryptMessage(encrypted);
    
    expect(decrypted).toBe(message);
  });
});