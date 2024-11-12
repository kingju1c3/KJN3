import helmet from 'helmet';
import cors from 'cors';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import rateLimit from 'express-rate-limit';
import { logger } from '../../utils/logger.js';

// Rate limiter configurations
const apiLimiter = new RateLimiterMemory({
  points: 10,
  duration: 1,
  blockDuration: 60
});

export const securityMiddleware = {
  // Helmet configuration
  helmet: helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'wss:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true
  }),

  // CORS configuration
  cors: cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 600
  }),

  // Rate limiting
  rateLimit: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded for IP ${req.ip}`);
      res.status(429).json({
        error: 'Too many requests',
        retryAfter: res.getHeader('Retry-After')
      });
    }
  }),

  // Dynamic rate limiting
  dynamicRateLimit: async (req, res, next) => {
    try {
      await apiLimiter.consume(req.ip);
      next();
    } catch (error) {
      logger.warn(`Dynamic rate limit exceeded for IP ${req.ip}`);
      res.status(429).json({
        error: 'Too many requests',
        retryAfter: error.msBeforeNext / 1000
      });
    }
  }
};