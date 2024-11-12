import { createLibp2p } from 'libp2p';
import { TCP } from '@libp2p/tcp';
import { Noise } from '@chainsafe/libp2p-noise';
import { Mplex } from '@libp2p/mplex';
import { KadDHT } from '@libp2p/kad-dht';
import { logger } from '../utils/logger.js';
import { startHeartbeat, startContributionMonitor } from './monitoring.js';
import os from 'os';

export async function createLibp2pNode(options = {}) {
  logger.info('Creating libp2p node...');
  
  try {
    // Get available network interfaces
    const networkInterfaces = os.networkInterfaces();
    const addresses = [];

    // Add listen addresses for all available interfaces
    Object.values(networkInterfaces).forEach(interfaces => {
      interfaces.forEach(iface => {
        if (!iface.internal && iface.family === 'IPv4') {
          addresses.push(`/ip4/${iface.address}/tcp/0`);
        }
      });
    });

    // Fallback to default if no interfaces found
    if (addresses.length === 0) {
      addresses.push('/ip4/0.0.0.0/tcp/0');
    }

    const node = await createLibp2p({
      addresses: {
        listen: addresses
      },
      transports: [new TCP()],
      streamMuxers: [new Mplex()],
      connectionEncryption: [new Noise()],
      dht: new KadDHT({
        enabled: true,
        randomWalk: {
          enabled: true,
          interval: 30000,
          timeout: 5000
        }
      }),
      connectionManager: {
        minConnections: options.minConnections || 5,
        maxConnections: options.maxConnections || 50,
        pollInterval: 2000,
      },
      metrics: {
        enabled: true,
        computeThrottleMaxQueueSize: 1000,
        computeThrottleTimeout: 2000,
        movingAverageIntervals: [
          60 * 1000, // 1 minute
          5 * 60 * 1000, // 5 minutes
          15 * 60 * 1000 // 15 minutes
        ]
      }
    });

    logger.info(`Libp2p node created with peer ID: ${node.peerId.toString()}`);
    logger.info(`Listening on addresses: ${addresses.join(', ')}`);

    setupEventHandlers(node);
    await node.start();
    
    startHeartbeat(node);
    startContributionMonitor(node);

    return node;

  } catch (error) {
    logger.error('Error creating libp2p node:', error);
    throw error;
  }
}

function setupEventHandlers(node) {
  node.connectionManager.on('peer:connect', (connection) => {
    logger.info(`Connected to peer: ${connection.remotePeer.toString()}`);
  });

  node.connectionManager.on('peer:disconnect', (connection) => {
    logger.warn(`Disconnected from peer: ${connection.remotePeer.toString()}`);
  });

  // Monitor DHT events
  node.dht.addEventListener('peer:discovery', (event) => {
    logger.info(`Discovered peer: ${event.detail.id.toString()}`);
  });

  // Monitor connection quality
  setInterval(() => {
    const metrics = node.metrics.getMetrics();
    logger.debug('Node metrics:', metrics);
  }, 60000);
}