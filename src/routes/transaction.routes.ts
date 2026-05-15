import { Router } from 'express';
import { createTransaction, updateTransaction, deleteTransaction, listTransactions } from '../controllers/transaction.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRoles } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import { createTransactionSchema, updateTransactionSchema, listTransactionsSchema, transactionIdSchema } from '../validators/transaction.validator';

const router = Router();

router.use(requireAuth); // All routes require auth

router.get('/', validate(listTransactionsSchema), listTransactions);
router.post('/', requireRoles(['ADMIN', 'ACCOUNTANT']), validate(createTransactionSchema), createTransaction);
router.put('/:id', requireRoles(['ADMIN', 'ACCOUNTANT']), validate(updateTransactionSchema), updateTransaction);
router.delete('/:id', requireRoles(['ADMIN']), validate(transactionIdSchema), deleteTransaction);

export default router;
