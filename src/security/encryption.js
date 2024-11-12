import CryptoJS from 'crypto-js';
import crypto from 'crypto';
import { logger } from '../utils/logger.js';

class EncryptionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EncryptionError';
  }
}

export class E2EEncryption {
  constructor() {
    this.keyPair = this.generateKeyPair();
    this.sessionKeys = new Map();
  }

  generateKeyPair() {
    try {
      // Use Node.js crypto for better key generation
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
      });

      return { publicKey, privateKey };
    } catch (error) {
      logger.error('Key pair generation failed:', error);
      throw new EncryptionError('Failed to generate key pair');
    }
  }

  async encryptMessage(message, recipientPublicKey) {
    try {
      // Generate a random session key
      const sessionKey = crypto.randomBytes(32);
      
      // Encrypt the message with the session key
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-gcm', sessionKey, iv);
      
      let encryptedMessage = cipher.update(message, 'utf8', 'base64');
      encryptedMessage += cipher.final('base64');
      const authTag = cipher.getAuthTag();

      // Encrypt the session key with recipient's public key
      const encryptedSessionKey = crypto.publicEncrypt(
        recipientPublicKey,
        sessionKey
      );

      return {
        message: encryptedMessage,
        sessionKey: encryptedSessionKey.toString('base64'),
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64')
      };

    } catch (error) {
      logger.error('Message encryption failed:', error);
      throw new EncryptionError('Failed to encrypt message');
    }
  }

  async decryptMessage(encryptedData) {
    try {
      // Decrypt the session key
      const sessionKey = crypto.privateDecrypt(
        this.keyPair.privateKey,
        Buffer.from(encryptedData.sessionKey, 'base64')
      );

      // Decrypt the message
      const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        sessionKey,
        Buffer.from(encryptedData.iv, 'base64')
      );
      
      decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'base64'));

      let decryptedMessage = decipher.update(encryptedData.message, 'base64', 'utf8');
      decryptedMessage += decipher.final('utf8');

      return decryptedMessage;

    } catch (error) {
      logger.error('Message decryption failed:', error);
      throw new EncryptionError('Failed to decrypt message');
    }
  }

  rotateSessionKey(peerId) {
    try {
      const newSessionKey = crypto.randomBytes(32);
      this.sessionKeys.set(peerId, {
        key: newSessionKey,
        timestamp: Date.now()
      });
      return newSessionKey;
    } catch (error) {
      logger.error('Session key rotation failed:', error);
      throw new EncryptionError('Failed to rotate session key');
    }
  }

  getPublicKey() {
    return this.keyPair.publicKey;
  }
}