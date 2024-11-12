import { CryptoUtils } from '../../src/security/CryptoUtils.js';
import { ClearanceLevel } from '../../src/security/ClearanceLevel.js';
import { logger } from '../../src/utils/logger.js';

// In-memory token store (would use a proper database in production)
const tokenStore = new Map();

const generateToken = (userId, clearanceLevel) => {
  const timestamp = Date.now();
  const tokenData = {
    userId,
    clearanceLevel,
    timestamp,
    expiresAt: timestamp + (24 * 60 * 60 * 1000) // 24 hours
  };

  const token = CryptoUtils.encrypt(tokenData, process.env.JWT_SECRET || 'default-secret-key');
  tokenStore.set(token, tokenData);

  return {
    token,
    expiresAt: tokenData.expiresAt
  };
};

const validateCredentials = (username, password) => {
  // Simulate credential validation
  // In production, this would check against a secure database
  if (username.includes('admin') && password.length >= 8) {
    return {
      userId: 'admin-' + Date.now(),
      clearanceLevel: ClearanceLevel.MASTER
    };
  } else if (username.includes('operator') && password.length >= 8) {
    return {
      userId: 'operator-' + Date.now(),
      clearanceLevel: ClearanceLevel.TOP_SECRET
    };
  } else if (password.length >= 8) {
    return {
      userId: 'user-' + Date.now(),
      clearanceLevel: ClearanceLevel.CONFIDENTIAL
    };
  }
  
  return null;
};

export const handler = async (event, context) => {
  try {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    // Parse request body
    const { username, password } = JSON.parse(event.body);

    if (!username || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Username and password are required' })
      };
    }

    // Validate credentials
    const userData = validateCredentials(username, password);

    if (!userData) {
      logger.warn(`Failed authentication attempt for user: ${username}`);
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials' })
      };
    }

    // Generate authentication token
    const { token, expiresAt } = generateToken(userData.userId, userData.clearanceLevel);

    logger.info(`Successful authentication for user: ${username}`);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      },
      body: JSON.stringify({
        token,
        userId: userData.userId,
        clearanceLevel: userData.clearanceLevel.name,
        expiresAt
      })
    };

  } catch (error) {
    logger.error('Authentication error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};