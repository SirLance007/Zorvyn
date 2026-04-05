import { Router } from 'express';
import {
    getTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction
} from './transaction.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { rbac } from '../../middlewares/rbac.middleware.js';

const router = Router();

router.use(protect);

// All authenticated users can read
// Only ADMIN and ANALYST can read lists
router.get('/', rbac('ADMIN', 'ANALYST'), getTransactions);
router.get('/:id', rbac('ADMIN', 'ANALYST'), getTransactionById);

// Only ADMIN can mutate
router.post('/', rbac('ADMIN'), createTransaction);
router.patch('/:id', rbac('ADMIN'), updateTransaction);
router.delete('/:id', rbac('ADMIN'), deleteTransaction);

export default router;
