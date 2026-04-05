import { Router } from 'express';
import { getUsers, updateUserRole, updateUserStatus } from './user.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { rbac } from '../../middlewares/rbac.middleware.js';

const router = Router();

router.use(protect, rbac('ADMIN'));

router.get('/', getUsers);
router.patch('/:id/role', updateUserRole);
router.patch('/:id/status', updateUserStatus);

export default router;
