import express from 'express';
import { createLibp2pNode } from '../network/libp2p.js';
import { setupRoutes } from './routes.js';
import { logger } from '../utils/logger.js';
import { securityMiddleware } from './middleware/security.js';
import { loggingMiddleware } from './middleware/logging.js';
import { errorHandler } from './middleware/errorHandler.js';

export async function createServer() {
  const app = express();
  
  // Apply security middleware
  app.use(securityMiddleware.helmet);
  app.use(securityMiddleware.cors);
  app.use(securityMiddleware.rateLimit);
  app.use(securityMiddleware.dynamicRateLimit);
  
  // Request parsing with size limits and additional security
  app.use(express.json({ 
    limit: '10kb',
    strict: true,
    verify: (req, res, buf, encoding) => {
      try {
        if (buf.length > 0) {
          JSON.parse(buf.toString(encoding));
        }
      } catch (e) {
        throw new Error('Invalid JSON');
      }
    }
  }));

  // Logging middleware
  app.use(loggingMiddleware);

  // Initialize libp2p node
  let node;
  try {
    node = await createLibp2pNode();
    logger.info('Libp2p node created successfully');
  } catch (error) {
    logger.error('Failed to create libp2p node:', error);
    throw error;
  }
  
  // Setup routes
  setupRoutes(app, node);

  // Global error handling
  app.use(errorHandler);

  // Track active connections for graceful shutdown
  const activeConnections = new Set();
  
  app.on('connection', connection => {
    activeConnections.add(connection);
    connection.on('close', () => {
      activeConnections.delete(connection);
    });
  });

  // Graceful shutdown handler
  const shutdown = async (signal) => {
    logger.info(`${signal} received. Starting graceful shutdown...`);
    
    // Close all active connections
    for (const connection of activeConnections) {
      connection.end();
    }
    
    if (node) {
      try {
        await node.stop();
        logger.info('Libp2p node stopped successfully');
      } catch (error) {
        logger.error('Error stopping libp2p node:', error);
      }
    }

    // Exit after cleanup or force exit after timeout
    const forceExit = setTimeout(() => {
      logger.warn('Forcing shutdown after timeout');
      process.exit(1);
    }, 10000);
    
    forceExit.unref();
    process.exit(0);
  };

  // Register shutdown handlers
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  
  // Handle uncaught errors
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception:', error);
    shutdown('UNCAUGHT_EXCEPTION');
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled rejection at:', promise, 'reason:', reason);
    shutdown('UNHANDLED_REJECTION');
  });

  return app;
}