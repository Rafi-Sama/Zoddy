import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate, requirePermission } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { catchAsync } from '../middleware/errorHandler';
import { DeliveryController } from '../controllers/delivery.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/v1/delivery/providers - Get supported delivery providers
router.get('/providers', catchAsync(DeliveryController.getProviders));

// POST /api/v1/delivery/book - Book a delivery
router.post(
  '/book',
  requirePermission('canManageOrders'),
  [
    body('order_id').notEmpty().withMessage('Order ID is required'),
    body('provider').isIn(['ecourier', 'redx', 'pathao']).withMessage('Invalid provider'),
    body('recipient_name').trim().notEmpty(),
    body('recipient_phone')
      .trim()
      .matches(/^(?:\+88|88)?(01[3-9]\d{8})$/),
    body('delivery_address').trim().notEmpty(),
    body('package_value').isFloat({ min: 0 }),
    body('package_description').optional().trim(),
  ],
  validate,
  catchAsync(DeliveryController.bookDelivery)
);

// GET /api/v1/delivery/track/:provider/:trackingId - Track delivery
router.get(
  '/track/:provider/:trackingId',
  [
    param('provider').isIn(['ecourier', 'redx', 'pathao']),
    param('trackingId').notEmpty(),
  ],
  validate,
  catchAsync(DeliveryController.trackDelivery)
);

// POST /api/v1/delivery/cancel - Cancel delivery
router.post(
  '/cancel',
  requirePermission('canManageOrders'),
  [
    body('provider').isIn(['ecourier', 'redx', 'pathao']),
    body('tracking_id').notEmpty(),
  ],
  validate,
  catchAsync(DeliveryController.cancelDelivery)
);

export default router;
