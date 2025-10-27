import { Router } from 'express';
import { body, query, param } from 'express-validator';
import { authenticate, requirePermission } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { catchAsync } from '../middleware/errorHandler';
import { OrderController } from '../controllers/order.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/v1/orders - Get all orders (with pagination, filters)
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('sortBy').optional().isString(),
    query('sortOrder').optional().isIn(['asc', 'desc']),
    query('search').optional().isString(),
    query('status').optional().isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned']),
    query('payment_status').optional().isIn(['pending', 'paid', 'partial', 'failed', 'refunded']),
  ],
  validate,
  catchAsync(OrderController.getAll)
);

// GET /api/v1/orders/stats - Get order statistics
router.get('/stats', catchAsync(OrderController.getStats));

// GET /api/v1/orders/:id - Get single order
router.get('/:id', [param('id').notEmpty()], validate, catchAsync(OrderController.getById));

// POST /api/v1/orders - Create new order
router.post(
  '/',
  requirePermission('canManageOrders'),
  [
    body('customer_name').trim().notEmpty().withMessage('Customer name is required'),
    body('customer_phone')
      .trim()
      .matches(/^(?:\+88|88)?(01[3-9]\d{8})$/)
      .withMessage('Invalid Bangladesh phone number'),
    body('customer_address').trim().notEmpty().withMessage('Customer address is required'),
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.name').trim().notEmpty(),
    body('items.*.quantity').isInt({ min: 1 }),
    body('items.*.price').isFloat({ min: 0 }),
    body('total_amount').isFloat({ min: 0 }).withMessage('Total amount must be positive'),
    body('payment_method').isIn(['cash', 'bkash', 'nagad', 'rocket', 'bank', 'card']),
    body('delivery_type').optional().isIn(['standard', 'express', 'pickup']),
  ],
  validate,
  catchAsync(OrderController.create)
);

// PUT /api/v1/orders/:id - Update order
router.put(
  '/:id',
  requirePermission('canManageOrders'),
  [
    param('id').notEmpty(),
    body('status').optional().isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned']),
    body('payment_status').optional().isIn(['pending', 'paid', 'partial', 'failed', 'refunded']),
  ],
  validate,
  catchAsync(OrderController.update)
);

// DELETE /api/v1/orders/:id - Delete order
router.delete(
  '/:id',
  requirePermission('canManageOrders'),
  [param('id').notEmpty()],
  validate,
  catchAsync(OrderController.delete)
);

export default router;
