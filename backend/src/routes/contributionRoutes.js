import express from 'express';
import {
  createContribution,
  getContributions,
  updateContribution,
  deleteContribution,
} from '../controllers/contributionController.js';
import { protect } from '../middleware/auth.js';
import { checkWeddingAccess } from '../middleware/weddingAccess.js';

const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(checkWeddingAccess);

router.post('/', createContribution);
router.get('/', getContributions);
router.put('/:contributionId', updateContribution);
router.delete('/:contributionId', deleteContribution);

export default router;

