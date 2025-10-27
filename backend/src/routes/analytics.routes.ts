import { Router } from 'express';
import { query } from 'express-validator';
import { authenticate, requirePermission } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { catchAsync } from '../middleware/errorHandler';
import { AnalyticsController } from '../controllers/analytics.controller';

const router = Router();

router.use(authenticate);
router.use(requirePermission('canViewAnalytics'));

router.get(
  '/overview',
  [query('start_date').optional().isISO8601(), query('end_date').optional().isISO8601()],
  validate,
  catchAsync(AnalyticsController.getOverview)
);

router.get('/revenue-trend', catchAsync(AnalyticsController.getRevenueTrend));

router.get('/top-products', catchAsync(AnalyticsController.getTopProducts));

router.get('/top-customers', catchAsync(AnalyticsController.getTopCustomers));

router.get('/sales-by-category', catchAsync(AnalyticsController.getSalesByCategory));

export default router;
