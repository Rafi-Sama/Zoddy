import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { catchAsync } from '../middleware/errorHandler';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

// POST /api/v1/auth/signup - Register new user
router.post(
  '/signup',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('firstName').optional().trim().notEmpty(),
    body('lastName').optional().trim().notEmpty(),
    body('phone').optional().trim(),
  ],
  validate,
  catchAsync(AuthController.signUp)
);

// POST /api/v1/auth/signin - Sign in user
router.post(
  '/signin',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  catchAsync(AuthController.signIn)
);

// POST /api/v1/auth/oauth - Get OAuth URL
router.post(
  '/oauth',
  [
    body('provider')
      .notEmpty()
      .isIn(['google', 'github', 'facebook', 'twitter'])
      .withMessage('Valid OAuth provider is required'),
  ],
  validate,
  catchAsync(AuthController.signInWithOAuth)
);

// POST /api/v1/auth/oauth/callback - Handle OAuth callback
router.post(
  '/oauth/callback',
  [
    body('access_token').notEmpty().withMessage('Access token is required'),
    body('refresh_token').optional(),
  ],
  validate,
  catchAsync(AuthController.handleOAuthCallback)
);

// POST /api/v1/auth/refresh - Refresh access token
router.post(
  '/refresh',
  [body('refresh_token').notEmpty().withMessage('Refresh token is required')],
  validate,
  catchAsync(AuthController.refreshToken)
);

// POST /api/v1/auth/password/reset - Request password reset
router.post(
  '/password/reset',
  [body('email').isEmail().normalizeEmail().withMessage('Valid email is required')],
  validate,
  catchAsync(AuthController.requestPasswordReset)
);

// PUT /api/v1/auth/password/reset - Reset password with token
router.put(
  '/password/reset',
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  catchAsync(AuthController.resetPassword)
);

// POST /api/v1/auth/verify-email - Verify email address
router.post(
  '/verify-email',
  [body('token').notEmpty().withMessage('Verification token is required')],
  validate,
  catchAsync(AuthController.verifyEmail)
);

// POST /api/v1/auth/check-email - Check if email exists
router.post(
  '/check-email',
  [body('email').isEmail().withMessage('Valid email is required')],  // Don't normalize - need exact match
  validate,
  catchAsync(AuthController.checkEmailExists)
);

// GET /api/v1/auth/me - Get current user profile (requires authentication)
router.get('/me', authenticate, catchAsync(AuthController.getCurrentUser));

// PUT /api/v1/auth/profile - Update user profile (requires authentication)
router.put(
  '/profile',
  authenticate,
  [
    body('first_name').optional().trim().notEmpty(),
    body('last_name').optional().trim().notEmpty(),
    body('phone').optional().trim(),
    body('profile_picture_url').optional().isURL(),
  ],
  validate,
  catchAsync(AuthController.updateProfile)
);

// POST /api/v1/auth/signout - Sign out user (optionally authenticated)
router.post('/signout', catchAsync(AuthController.signOut));

export default router;