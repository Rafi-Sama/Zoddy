import Joi from 'joi';
import { BANGLADESH_PHONE_REGEX } from './constants';

/**
 * Custom Joi validators for Bangladesh-specific fields
 */

export const validators = {
  // Bangladesh phone number validator
  bangladeshPhone: () =>
    Joi.string()
      .pattern(BANGLADESH_PHONE_REGEX)
      .messages({
        'string.pattern.base': 'Phone number must be a valid Bangladesh number (e.g., +8801712345678 or 01712345678)',
      }),

  // Email validator
  email: () =>
    Joi.string()
      .email()
      .lowercase()
      .trim()
      .messages({
        'string.email': 'Must be a valid email address',
      }),

  // UUID validator
  uuid: () =>
    Joi.string()
      .uuid()
      .messages({
        'string.uuid': 'Must be a valid UUID',
      }),

  // Positive number validator
  positiveNumber: () =>
    Joi.number()
      .positive()
      .messages({
        'number.positive': 'Must be a positive number',
      }),

  // Non-negative number validator
  nonNegativeNumber: () =>
    Joi.number()
      .min(0)
      .messages({
        'number.min': 'Must be zero or greater',
      }),

  // Date validator
  date: () =>
    Joi.date()
      .iso()
      .messages({
        'date.format': 'Must be a valid ISO 8601 date',
      }),

  // Pagination validators
  pagination: {
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    search: Joi.string().optional().allow(''),
  },
};

/**
 * Validate Bangladesh phone number
 */
export const isValidBangladeshPhone = (phone: string): boolean => {
  return BANGLADESH_PHONE_REGEX.test(phone);
};

/**
 * Normalize Bangladesh phone number to E.164 format
 */
export const normalizeBangladeshPhone = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // If starts with 880, add +
  if (digits.startsWith('880')) {
    return `+${digits}`;
  }

  // If starts with 88, add +
  if (digits.startsWith('88')) {
    return `+${digits}`;
  }

  // If starts with 01, add +880
  if (digits.startsWith('01')) {
    return `+880${digits}`;
  }

  // Return as is with +
  return `+${digits}`;
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
