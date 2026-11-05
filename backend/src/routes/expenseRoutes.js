import express from 'express';
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getBrideExpenses,
  getGroomExpenses,
  getCategories,
  createCategory,
} from '../controllers/expenseController.js';
import { protect } from '../middleware/auth.js';
import { checkWeddingAccess } from '../middleware/weddingAccess.js';

const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(checkWeddingAccess);

router.post('/', createExpense);
router.get('/', getExpenses);
router.get('/bride', getBrideExpenses);
router.get('/groom', getGroomExpenses);
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.get('/:expenseId', getExpenseById);
router.put('/:expenseId', updateExpense);
router.delete('/:expenseId', deleteExpense);

export default router;

