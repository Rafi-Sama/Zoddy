import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { catchAsync } from '../middleware/errorHandler';
import { TeamController } from '../controllers/team.controller';

const router = Router();

router.use(authenticate);

router.get('/members', catchAsync(TeamController.getMembers));

router.post(
  '/invite',
  requireRole('owner', 'admin'),
  [
    body('email').isEmail(),
    body('role').isIn(['admin', 'member']),
    body('permissions').isObject(),
  ],
  validate,
  catchAsync(TeamController.inviteMember)
);

router.put('/members/:id', requireRole('owner', 'admin'), catchAsync(TeamController.updateMember));

router.delete('/members/:id', requireRole('owner', 'admin'), catchAsync(TeamController.removeMember));

router.get('/tasks', catchAsync(TeamController.getTasks));

router.post('/tasks', [body('title').trim().notEmpty()], validate, catchAsync(TeamController.createTask));

export default router;
