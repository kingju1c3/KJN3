import { logger } from '../../src/utils/logger.js';

// Simulate metrics collection
const collectNetworkMetrics = () => {
  const generateTimeSeries = (baseValue, variance) => {
    const points = [];
    for (let i = 0; i < 24; i++) {
      points.push({
        timestamp: new Date(Date.now() - (i * 3600000)).toISOString(),
        value: baseValue + (Math.random() * variance * 2 - variance)
      });
    }
    return points;
  };

  return {
    timestamp: new Date().toISOString(),
    activeNodes: Math.floor(Math.random() * 50) + 20,
    metrics: {
      throughput: {
        current: Math.floor(Math.random() * 1000) + 500,
        history: generateTimeSeries(750, 250)
      },
      latency: {
        current: Math.floor(Math.random() * 50) + 10,
        history: generateTimeSeries(30, 20)
      },
      reliability: {
        current: (Math.random() * 5 + 95).toFixed(2),
        history: generateTimeSeries(97.5, 2.5)
      },
      bandwidth: {
        inbound: Math.floor(Math.random() * 500) + 200,
        outbound: Math.floor(Math.random() * 500) + 200,
        history: generateTimeSeries(350, 150)
      }
    },
    security: {
      encryptionStrength: 256,
      lastSecurityScan: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
      threatLevel: 'low',
      activeConnections: Math.floor(Math.random() * 100) + 50
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

    // Optional time range parameters
    const { start, end } = event.queryStringParameters || {};
    
    // Collect network metrics
    const metrics = collectNetworkMetrics();

    logger.info('Network metrics collected successfully');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        success: true,
        data: metrics,
        timeRange: {
          start: start || new Date(Date.now() - 24 * 3600000).toISOString(),
          end: end || new Date().toISOString()
        }
      })
    };

  } catch (error) {
    logger.error('Error collecting network metrics:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};