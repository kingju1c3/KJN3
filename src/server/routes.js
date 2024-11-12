import { Router } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import { logger } from '../utils/logger.js';

export function setupRoutes(app, node) {
  const router = Router();

  router.post('/start-node', async (req, res) => {
    try {
      if (!node.isStarted()) {
        await node.start();
        res.status(200).json({ message: 'Node started successfully' });
      } else {
        res.status(400).json({ message: 'Node is already running' });
      }
    } catch (error) {
      logger.error('Error starting node:', error);
      res.status(500).json({ error: 'Failed to start node' });
    }
  });

  router.get('/status', (req, res) => {
    try {
      res.json({
        peerId: node.peerId.toString(),
        addresses: node.getMultiaddrs().map(addr => addr.toString()),
        status: node.isStarted() ? 'running' : 'stopped'
      });
    } catch (error) {
      logger.error('Error getting status:', error);
      res.status(500).json({ error: 'Failed to get node status' });
    }
  });

  router.post('/stop-node', async (req, res) => {
    try {
      if (node.isStarted()) {
        await node.stop();
        res.status(200).json({ message: 'Node stopped successfully' });
      } else {
        res.status(400).json({ message: 'Node is not running' });
      }
    } catch (error) {
      logger.error('Error stopping node:', error);
      res.status(500).json({ error: 'Failed to stop node' });
    }
  });

  router.post('/update-firmware', async (req, res) => {
    try {
      const { firmwareUrl } = req.body;
      if (!firmwareUrl) {
        return res.status(400).json({ error: 'Firmware URL required' });
      }

      const response = await axios.get(firmwareUrl, { responseType: 'arraybuffer' });
      const checksum = crypto.createHash('sha256').update(response.data).digest('hex');
      
      logger.info(`Firmware downloaded successfully. Checksum: ${checksum}`);
      res.status(200).json({ message: 'Firmware update completed', checksum });
      
    } catch (error) {
      logger.error('Firmware update error:', error);
      res.status(500).json({ error: 'Firmware update failed' });
    }
  });

  app.use('/api', router);
}