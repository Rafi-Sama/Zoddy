import { Router } from 'express';
import { OrganizationController } from '../controllers/organization.controller';
import { authenticate } from '../middleware/auth';
import { catchAsync } from '../middleware/errorHandler';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/v1/organizations - Get all user's organizations
router.get('/', catchAsync(OrganizationController.getUserOrganizations));

// GET /api/v1/organizations/current - Get current organization
router.get('/current', catchAsync(OrganizationController.getCurrentOrganization));

// POST /api/v1/organizations - Create new organization
router.post('/', catchAsync(OrganizationController.createOrganization));

// POST /api/v1/organizations/switch - Switch active organization
router.post('/switch', catchAsync(OrganizationController.switchOrganization));

// PATCH /api/v1/organizations/:organizationId - Update organization
router.patch('/:organizationId', catchAsync(OrganizationController.updateOrganization));

// PATCH /api/v1/organizations/:organizationId/branding - Update organization branding
router.patch('/:organizationId/branding', catchAsync(OrganizationController.updateOrganizationBranding));

export default router;
