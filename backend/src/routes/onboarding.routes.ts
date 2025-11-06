import { Router } from 'express';
import { OnboardingController } from '../controllers/onboarding.controller';
import { authenticate } from '../middleware/auth';
import { catchAsync } from '../middleware/errorHandler';

const router = Router();

// All routes require authentication
router.use(authenticate);

// POST /api/v1/onboarding - Complete onboarding
router.post('/', catchAsync(OnboardingController.completeOnboarding));

// GET /api/v1/onboarding/status - Check onboarding status
router.get('/status', catchAsync(OnboardingController.checkOnboardingStatus));

export default router;
