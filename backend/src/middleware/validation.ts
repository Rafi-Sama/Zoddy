import { Request, Response, NextFunction, RequestHandler } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ApiError } from './errorHandler';

/**
 * Validation middleware to check for express-validator errors
 * Returns a Promise to satisfy TypeScript async handler expectations
 */
export const validate = (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  return Promise.resolve().then(() => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((err) => ({
        field: 'path' in err ? err.path : 'unknown',
        message: err.msg,
      }));

      throw new ApiError(
        `Validation failed: ${errorMessages.map((e) => e.message).join(', ')}`,
        400
      );
    }

    next();
  });
};

/**
 * Wrap express-validator chains to be async-compatible
 * This allows TypeScript to accept them in async route handlers
 */
export const asyncValidate = (validations: ValidationChain[]): RequestHandler[] => {
  return [
    ...validations,
    (req: Request, res: Response, next: NextFunction) => validate(req, res, next).catch(next)
  ] as RequestHandler[];
};
