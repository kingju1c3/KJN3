import { logger } from '../../utils/logger.js';

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

export class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthorizationError';
    this.status = 403;
  }
}

export const errorHandler = (err, req, res, next) => {
  const errorResponse = {
    status: err.status || 500,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  };

  errorResponse.requestId = res.getHeader('X-Request-Id');

  logger.error({
    error: err.message,
    stack: err.stack,
    requestId: errorResponse.requestId,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    errorResponse.stack = err.stack;
  }

  res.status(errorResponse.status).json(errorResponse);
};