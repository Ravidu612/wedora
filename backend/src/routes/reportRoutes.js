import express from 'express';
import {
  exportBudgetPDF,
  exportGuestsCSV,
} from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';
import { checkWeddingAccess } from '../middleware/weddingAccess.js';

const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(checkWeddingAccess);

router.get('/budget-pdf', exportBudgetPDF);
router.get('/guests-csv', exportGuestsCSV);

export default router;

