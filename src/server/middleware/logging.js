import { logger } from '../../utils/logger.js';
import crypto from 'crypto';

export const loggingMiddleware = (req, res, next) => {
  const requestStart = Date.now();
  const requestId = crypto.randomUUID();
  
  res.setHeader('X-Request-Id', requestId);
  
  res.on('finish', () => {
    const duration = Date.now() - requestStart;
    logger.info({
      requestId,
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      userAgent: req.get('user-agent'),
      ip: req.ip
    });
  });
  
  next();
};