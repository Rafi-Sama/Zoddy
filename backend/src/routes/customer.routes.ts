import { Router } from 'express';
import { body, query, param } from 'express-validator';
import { authenticate, requirePermission } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { catchAsync } from '../middleware/errorHandler';
import { CustomerController } from '../controllers/customer.controller';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().isString(),
  ],
  validate,
  catchAsync(CustomerController.getAll)
);

router.get('/:id', [param('id').notEmpty()], validate, catchAsync(CustomerController.getById));

router.post(
  '/',
  requirePermission('canManageCustomers'),
  [
    body('name').trim().notEmpty(),
    body('phone').trim().matches(/^(?:\+88|88)?(01[3-9]\d{8})$/),
    body('email').optional().isEmail(),
    body('address').trim().notEmpty(),
  ],
  validate,
  catchAsync(CustomerController.create)
);

router.put('/:id', requirePermission('canManageCustomers'), catchAsync(CustomerController.update));

router.delete('/:id', requirePermission('canManageCustomers'), catchAsync(CustomerController.delete));

export default router;
