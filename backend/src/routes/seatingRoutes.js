import express from 'express';
import {
  getTables,
  createTable,
  updateTable,
  deleteTable,
  assignGuestToTable,
} from '../controllers/seatingController.js';
import { protect } from '../middleware/auth.js';
import { checkWeddingAccess } from '../middleware/weddingAccess.js';

const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(checkWeddingAccess);

router.get('/', getTables);
router.post('/', createTable);
router.put('/:tableId', updateTable);
router.delete('/:tableId', deleteTable);
router.post('/:tableId/assign', assignGuestToTable);

export default router;

