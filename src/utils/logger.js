import winston from 'winston';
import { join } from 'path';
import os from 'os';

const logDir = process.env.LOG_DIR || join(os.tmpdir(), 'kj-network-logs');

// Custom format for better cross-platform compatibility
const customFormat = winston.format.printf(({ timestamp, level, message }) => {
  const formattedTimestamp = new Date(timestamp).toISOString();
  return `${formattedTimestamp} [${level.toUpperCase()}]: ${message}`;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    customFormat
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        customFormat
      )
    }),
    new winston.transports.File({ 
      filename: join(logDir, 'error.log'),
      level: 'error'
    }),
    new winston.transports.File({ 
      filename: join(logDir, 'network.log')
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: join(logDir, 'exceptions.log')
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: join(logDir, 'rejections.log')
    })
  ]
});