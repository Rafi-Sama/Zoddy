import { Response } from 'express';
import { ApiResponse } from '../types';
import { HTTP_STATUS } from './constants';

/**
 * Standardized API response helpers
 */

export class ResponseHandler {
  /**
   * Send success response
   */
  static success<T>(
    res: Response,
    data?: T,
    message?: string,
    statusCode: number = HTTP_STATUS.OK,
    metadata?: any
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      metadata,
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send created response
   */
  static created<T>(res: Response, data?: T, message: string = 'Resource created successfully'): Response {
    return this.success(res, data, message, HTTP_STATUS.CREATED);
  }

  /**
   * Send error response
   */
  static error(res: Response, message: string, statusCode: number = HTTP_STATUS.BAD_REQUEST, error?: string): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error,
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send validation error response
   */
  static validationError(res: Response, errors: any): Response {
    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  /**
   * Send unauthorized response
   */
  static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return this.error(res, message, HTTP_STATUS.UNAUTHORIZED);
  }

  /**
   * Send forbidden response
   */
  static forbidden(res: Response, message: string = 'Forbidden'): Response {
    return this.error(res, message, HTTP_STATUS.FORBIDDEN);
  }

  /**
   * Send not found response
   */
  static notFound(res: Response, message: string = 'Resource not found'): Response {
    return this.error(res, message, HTTP_STATUS.NOT_FOUND);
  }

  /**
   * Send conflict response
   */
  static conflict(res: Response, message: string = 'Resource already exists'): Response {
    return this.error(res, message, HTTP_STATUS.CONFLICT);
  }

  /**
   * Send internal server error response
   */
  static serverError(res: Response, message: string = 'Internal server error'): Response {
    return this.error(res, message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  /**
   * Send paginated response
   */
  static paginated<T>(
    res: Response,
    data: T[],
    total: number,
    page: number,
    limit: number,
    message?: string
  ): Response {
    return this.success(
      res,
      data,
      message,
      HTTP_STATUS.OK,
      {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    );
  }
}
