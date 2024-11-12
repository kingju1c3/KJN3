import crypto from 'crypto';
import argon2 from 'argon2';
import { logger } from '../utils/logger.js';
import { z } from 'zod';

const AuthTokenSchema = z.object({
  nodeId: z.string().min(1),
  timestamp: z.number().min(Date.now() - 5000), // Token must not be older than 5 seconds
  nonce: z.string().min(16)
});

// Secure token storage
const tokens = new Map();

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
    this.status = 401;
  }
}

// Clean expired tokens periodically
setInterval(() => {
  const now = Date.now();
  for (const [nodeId, data] of tokens.entries()) {
    if (now - data.timestamp > 3600000) { // 1 hour
      tokens.delete(nodeId);
    }
  }
}, 300000); // Clean every 5 minutes

export async function authenticateNode(node) {
  try {
    const nodeId = node.peerId.toString();
    const timestamp = Date.now();
    const nonce = crypto.randomBytes(16).toString('hex');
    
    // Validate input data
    const validatedData = AuthTokenSchema.parse({
      nodeId,
      timestamp,
      nonce
    });

    // Create a secure hash using Argon2
    const authToken = await argon2.hash(`${nodeId}-${timestamp}-${nonce}`, {
      type: argon2.argon2id,
      memoryCost: 2048,
      timeCost: 3,
      parallelism: 1
    });

    // Store the token
    await storeAuthToken(nodeId, authToken);

    logger.info(`Node ${nodeId} authenticated successfully`);
    return authToken;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('Authentication validation error:', error.errors);
      throw new AuthenticationError('Invalid authentication data');
    }
    
    logger.error('Authentication error:', error);
    throw new AuthenticationError('Authentication failed');
  }
}

async function storeAuthToken(nodeId, token) {
  tokens.set(nodeId, {
    token,
    timestamp: Date.now()
  });
}

export async function verifyAuthToken(nodeId, token) {
  try {
    const storedData = tokens.get(nodeId);
    
    if (!storedData) {
      throw new AuthenticationError('Invalid token');
    }

    const isValid = await argon2.verify(storedData.token, token);
    
    if (!isValid) {
      throw new AuthenticationError('Invalid token');
    }

    // Check token age
    const tokenAge = Date.now() - storedData.timestamp;
    if (tokenAge > 3600000) { // 1 hour
      tokens.delete(nodeId); // Clean up expired token
      throw new AuthenticationError('Token expired');
    }

    return true;
  } catch (error) {
    logger.error('Token verification error:', error);
    throw new AuthenticationError('Token verification failed');
  }
}