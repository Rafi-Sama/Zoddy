import Joi from 'joi';
import { validators } from '../utils/validators';

export const productValidators = {
  create: Joi.object({
    name: Joi.string().trim().min(2).max(200).required(),
    description: Joi.string().max(2000).optional().allow(''),
    sku: Joi.string().trim().min(2).max(100).required(),
    category: Joi.string().trim().min(2).max(100).required(),
    brand: Joi.string().max(100).optional().allow(''),
    unit: Joi.string().max(50).optional().allow(''),
    current_stock: Joi.number().integer().min(0).required(),
    reorder_level: Joi.number().integer().min(0).required(),
    min_order_quantity: Joi.number().integer().min(1).optional(),
    max_order_quantity: Joi.number().integer().min(1).optional(),
    cost_price: validators.nonNegativeNumber().required(),
    selling_price: validators.nonNegativeNumber().required(),
    discount_price: validators.nonNegativeNumber().optional(),
    supplier: Joi.string().max(200).optional().allow(''),
    supplier_phone: validators.bangladeshPhone().optional().allow(''),
    barcode: Joi.string().max(100).optional().allow(''),
    tags: Joi.array().items(Joi.string()).optional(),
    location: Joi.string().max(200).optional().allow(''),
    status: Joi.string().valid('active', 'inactive', 'discontinued').optional(),
    expiry_date: Joi.date().optional(),
    manufacturing_date: Joi.date().optional(),
    warranty: Joi.string().max(200).optional().allow(''),
    weight: Joi.string().max(50).optional().allow(''),
    dimensions: Joi.string().max(100).optional().allow(''),
    color: Joi.string().max(50).optional().allow(''),
    size: Joi.string().max(50).optional().allow(''),
  }),

  update: Joi.object({
    name: Joi.string().trim().min(2).max(200).optional(),
    description: Joi.string().max(2000).optional().allow(''),
    category: Joi.string().trim().min(2).max(100).optional(),
    brand: Joi.string().max(100).optional().allow(''),
    reorder_level: Joi.number().integer().min(0).optional(),
    cost_price: validators.nonNegativeNumber().optional(),
    selling_price: validators.nonNegativeNumber().optional(),
    discount_price: validators.nonNegativeNumber().optional(),
    status: Joi.string().valid('active', 'inactive', 'discontinued').optional(),
  }),

  updateStock: Joi.object({
    quantity: Joi.number().integer().min(0).required()
      .messages({
        'number.min': 'Quantity must be zero or positive',
        'number.base': 'Quantity must be a number',
      }),
    type: Joi.string().valid('in', 'out', 'adjustment').required()
      .messages({
        'any.only': 'Type must be one of: in, out, adjustment',
      }),
    reason: Joi.string().max(500).optional().allow(''),
  }).custom((value, helpers) => {
    // Additional validation: for 'in' and 'out', quantity must be > 0
    if ((value.type === 'in' || value.type === 'out') && value.quantity === 0) {
      return helpers.error('any.invalid', { message: 'Quantity must be greater than 0 for in/out operations' });
    }
    return value;
  }),
};
