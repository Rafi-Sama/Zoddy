import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate, requirePermission } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { catchAsync } from '../middleware/errorHandler';
import { ProductController } from '../controllers/product.controller';

const router = Router();

router.use(authenticate);

router.get('/', catchAsync(ProductController.getAll));

router.get('/low-stock', catchAsync(ProductController.getLowStock));

router.get('/:id', [param('id').notEmpty()], validate, catchAsync(ProductController.getById));

router.get('/:id/stock-movements', catchAsync(ProductController.getStockMovements));

router.post(
  '/',
  requirePermission('canManageInventory'),
  [
    body('name').trim().notEmpty(),
    body('sku').trim().notEmpty(),
    body('category').trim().notEmpty(),
    body('current_stock').isInt({ min: 0 }),
    body('reorder_level').isInt({ min: 0 }),
    body('cost_price').isFloat({ min: 0 }),
    body('selling_price').isFloat({ min: 0 }),
  ],
  validate,
  catchAsync(ProductController.create)
);

router.put('/:id', requirePermission('canManageInventory'), catchAsync(ProductController.update));

router.post(
  '/:id/stock',
  requirePermission('canManageInventory'),
  [
    param('id').notEmpty(),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be zero or positive'),
    body('type').isIn(['in', 'out', 'adjustment']).withMessage('Type must be in, out, or adjustment'),
    body('reason').optional().trim(),
  ],
  validate,
  catchAsync(ProductController.updateStock)
);

router.delete('/:id', requirePermission('canManageInventory'), catchAsync(ProductController.delete));

export default router;
