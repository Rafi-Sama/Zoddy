import Joi from 'joi';
import { validators } from '../utils/validators';

export const orderValidators = {
  create: Joi.object({
    customer_name: Joi.string().trim().min(2).max(200).required().messages({
      'string.empty': 'Customer name is required',
      'string.min': 'Customer name must be at least 2 characters',
      'string.max': 'Customer name cannot exceed 200 characters',
    }),

    customer_phone: validators.bangladeshPhone().required(),

    customer_email: validators.email().optional().allow(''),

    customer_address: Joi.string().trim().min(5).max(500).required().messages({
      'string.empty': 'Customer address is required',
      'string.min': 'Address must be at least 5 characters',
      'string.max': 'Address cannot exceed 500 characters',
    }),

    items: Joi.array()
      .min(1)
      .items(
        Joi.object({
          name: Joi.string().trim().required().messages({
            'string.empty': 'Item name is required',
          }),
          quantity: Joi.number().integer().min(1).required().messages({
            'number.base': 'Quantity must be a number',
            'number.min': 'Quantity must be at least 1',
          }),
          price: validators.nonNegativeNumber().required().messages({
            'number.base': 'Price must be a number',
          }),
        })
      )
      .required()
      .messages({
        'array.min': 'At least one item is required',
      }),

    total_amount: validators.nonNegativeNumber().required().messages({
      'number.base': 'Total amount must be a number',
    }),

    discount: validators.nonNegativeNumber().optional(),
    delivery_charge: validators.nonNegativeNumber().optional(),

    payment_method: Joi.string()
      .valid('cash', 'bkash', 'nagad', 'rocket', 'bank', 'card')
      .required()
      .messages({
        'any.only': 'Invalid payment method',
      }),

    delivery_type: Joi.string().valid('standard', 'express', 'pickup').optional(),

    channel: Joi.string()
      .valid('whatsapp', 'facebook', 'instagram', 'phone', 'website', 'manual')
      .optional(),

    notes: Joi.string().max(1000).optional().allow(''),
  }),

  update: Joi.object({
    status: Joi.string()
      .valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned')
      .optional(),

    payment_status: Joi.string()
      .valid('pending', 'paid', 'partial', 'failed', 'refunded')
      .optional(),

    notes: Joi.string().max(1000).optional().allow(''),
  }),
};
