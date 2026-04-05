import { Router } from 'express';
import { getSummary, getByCategory, getTrends, getRecent } from './dashboard.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { rbac } from '../../middlewares/rbac.middleware.js';

const router = Router();

router.use(protect, rbac('ADMIN', 'ANALYST'));

router.get('/summary', getSummary);
router.get('/by-category', getByCategory);
router.get('/trends', getTrends);
router.get('/recent', getRecent);

export default router;
