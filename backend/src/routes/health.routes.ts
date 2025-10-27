import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';
import { catchAsync } from '../middleware/errorHandler';

const router = Router();

// GET /health - Basic health check
router.get('/', catchAsync(HealthController.basic));

// GET /health/detailed - Detailed health check with database status
router.get('/detailed', catchAsync(HealthController.detailed));

// GET /health/ready - Readiness probe (for Kubernetes)
router.get('/ready', catchAsync(HealthController.readiness));

// GET /health/live - Liveness probe (for Kubernetes)
router.get('/live', catchAsync(HealthController.liveness));

export default router;
