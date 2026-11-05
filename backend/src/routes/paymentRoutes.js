import express from 'express';
import {
  createPayment,
  getPayments,
  deletePayment,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';
import { checkWeddingAccess } from '../middleware/weddingAccess.js';

const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(checkWeddingAccess);

router.post('/', createPayment);
router.get('/', getPayments);
router.delete('/:paymentId', deletePayment);

export default router;

