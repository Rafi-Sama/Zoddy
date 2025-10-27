import Joi from 'joi';
import { validators } from '../utils/validators';

export const customerValidators = {
  create: Joi.object({
    name: Joi.string().trim().min(2).max(200).required(),
    phone: validators.bangladeshPhone().required(),
    email: validators.email().optional().allow(''),
    address: Joi.string().trim().min(5).max(500).required(),
    status: Joi.string().valid('vip', 'regular', 'new', 'inactive').optional(),
    favorite_category: Joi.string().max(100).optional().allow(''),
    notes: Joi.string().max(1000).optional().allow(''),
  }),

  update: Joi.object({
    name: Joi.string().trim().min(2).max(200).optional(),
    phone: validators.bangladeshPhone().optional(),
    email: validators.email().optional().allow(''),
    address: Joi.string().trim().min(5).max(500).optional(),
    status: Joi.string().valid('vip', 'regular', 'new', 'inactive').optional(),
    favorite_category: Joi.string().max(100).optional().allow(''),
    notes: Joi.string().max(1000).optional().allow(''),
  }),
};
