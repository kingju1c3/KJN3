import { createServer } from './server.js';
import { logger } from '../utils/logger.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 5000;
const host = process.env.HOST || '0.0.0.0';
const isWindows = os.platform() === 'win32';

// Ensure proper path handling across platforms
const getPath = (...paths) => join(__dirname, ...paths);

async function startServer() {
  try {
    const server = await createServer({
      tempDir: os.tmpdir(),
      isWindows,
      rootDir: getPath('../..')
    });
    
    server.listen(port, host, () => {
      logger.info(`
🚀 KJ Network Node Running
   - Port: ${port}
   - Host: ${host}
   - Platform: ${os.platform()}
   - Architecture: ${os.arch()}
   - Node Version: ${process.version}
   - Mode: ${process.env.NODE_ENV || 'development'}
      `);
    });

    const cleanup = async () => {
      try {
        await server.close();
        logger.info('Server closed successfully');
        process.exit(0);
      } catch (error) {
        logger.error('Error during cleanup:', error);
        process.exit(1);
      }
    };

    // Handle different termination signals
    const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
    signals.forEach(signal => {
      process.on(signal, async () => {
        logger.info(`\n⚠️ ${signal} received. Cleaning up...`);
        await cleanup();
      });
    });

    // Handle uncaught errors
    process.on('uncaughtException', async (error) => {
      logger.error('Uncaught Exception:', error);
      await cleanup();
    });

    process.on('unhandledRejection', async (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      await cleanup();
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();