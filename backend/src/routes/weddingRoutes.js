import express from 'express';
import {
  createWedding,
  getMyWeddings,
  getWeddingById,
  updateWedding,
  deleteWedding,
  invitePartner,
} from '../controllers/weddingController.js';
import { protect } from '../middleware/auth.js';
import { checkWeddingAccess } from '../middleware/weddingAccess.js';

const router = express.Router();

router.use(protect);

router.post('/', createWedding);
router.get('/', getMyWeddings);
router.get('/:id', checkWeddingAccess, getWeddingById);
router.put('/:id', checkWeddingAccess, updateWedding);
router.delete('/:id', checkWeddingAccess, deleteWedding);
router.post('/:id/invite', checkWeddingAccess, invitePartner);

export default router;

