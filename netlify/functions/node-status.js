import { logger } from '../../src/utils/logger.js';

const getNodeStatus = (nodeId) => {
  // Simulate node status check
  const statuses = {
    active: 0.8,    // 80% chance
    idle: 0.15,     // 15% chance
    offline: 0.05   // 5% chance
  };

  const random = Math.random();
  let status;

  if (random < statuses.offline) {
    status = 'offline';
  } else if (random < statuses.offline + statuses.idle) {
    status = 'idle';
  } else {
    status = 'active';
  }

  return {
    nodeId,
    status,
    lastSeen: new Date().toISOString(),
    metrics: {
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      network: Math.floor(Math.random() * 100)
    }
  };
};

export const handler = async (event, context) => {
  try {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    const { nodeId } = event.queryStringParameters || {};

    if (!nodeId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Node ID is required' })
      };
    }

    const status = getNodeStatus(nodeId);

    logger.info(`Node status check: ${nodeId} is ${status.status}`);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(status)
    };

  } catch (error) {
    logger.error('Error in node-status function:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};