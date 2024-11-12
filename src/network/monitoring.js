import os from 'os';
import { logger } from '../utils/logger.js';
import { authenticateNode } from '../security/auth.js';

export function startHeartbeat(node) {
  setInterval(async () => {
    try {
      const authToken = await authenticateNode(node);
      const message = {
        node_id: node.peerId.toString(),
        timestamp: new Date().toISOString(),
        auth_token: authToken,
        node_type: os.type()
      };

      await node.pubsub.publish('heartbeat', JSON.stringify(message));
      logger.info(`Heartbeat sent from node ${message.node_id}`);
      
    } catch (error) {
      logger.error('Heartbeat error:', error);
    }
  }, 10000);
}

export function startContributionMonitor(node) {
  setInterval(async () => {
    try {
      const message = {
        node_id: node.peerId.toString(),
        timestamp: new Date().toISOString(),
        contribution: 'data_processed',
        node_type: os.type()
      };

      await node.pubsub.publish('contributions', JSON.stringify(message));
      logger.info(`Contribution sent from node ${message.node_id}`);
      
    } catch (error) {
      logger.error('Contribution monitor error:', error);
    }
  }, 15000);
}