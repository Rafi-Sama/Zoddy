import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { catchAsync } from '../middleware/errorHandler';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

// POST /api/v1/auth/workos-callback - Handle WorkOS authentication callback
router.post(
  '/workos-callback',
  [body('code').notEmpty().withMessage('Authorization code is required')],
  validate,
  catchAsync(AuthController.handleWorkOSCallback)
);

// POST /api/v1/auth/refresh - Refresh JWT token
router.post(
  '/refresh',
  [body('refreshToken').notEmpty().withMessage('Refresh token is required')],
  validate,
  catchAsync(AuthController.refreshToken)
);

// GET /api/v1/auth/me - Get current user profile
router.get('/me', authenticate, catchAsync(AuthController.getCurrentUser));

// PUT /api/v1/auth/profile - Update user profile
router.put(
  '/profile',
  authenticate,
  [
    body('first_name').optional().trim().notEmpty(),
    body('last_name').optional().trim().notEmpty(),
    body('profile_picture_url').optional().isURL(),
  ],
  validate,
  catchAsync(AuthController.updateProfile)
);

// POST /api/v1/auth/logout - Logout user
router.post('/logout', authenticate, catchAsync(AuthController.logout));

export default router;
