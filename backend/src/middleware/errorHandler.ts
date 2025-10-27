import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { HTTP_STATUS } from '../utils/constants';

export interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  details?: any;
}

export class ApiError extends Error implements AppError {
  statusCode: number;
  status: string;
  isOperational: boolean;
  details?: any;

  constructor(message: string, statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  err.statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  err.status = err.status || 'error';

  // Log error
  logger.error({
    name: err.name,
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    body: req.body,
    query: req.query,
  });

  // Development error response - include stack trace
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      details: err.details,
      stack: err.stack,
      error: {
        name: err.name,
        message: err.message,
      },
    });
  }

  // Production error response
  if (err.isOperational) {
    // Operational, trusted error: send message to client
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  // Programming or unknown error: don't leak error details
  logger.error('Unhandled error:', err);
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    status: 'error',
    message: 'An unexpected error occurred. Please try again later.',
  });
};

/**
 * Async handler wrapper - catches errors in async functions
 */
export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};
