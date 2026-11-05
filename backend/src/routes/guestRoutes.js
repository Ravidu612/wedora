import express from 'express';
import {
  createGuest,
  getGuests,
  updateGuest,
  deleteGuest,
  bulkUploadGuests,
  getGuestStats,
} from '../controllers/guestController.js';
import { protect } from '../middleware/auth.js';
import { checkWeddingAccess } from '../middleware/weddingAccess.js';

const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(checkWeddingAccess);

router.post('/', createGuest);
router.get('/', getGuests);
router.get('/stats', getGuestStats);
router.post('/bulk', bulkUploadGuests);
router.put('/:guestId', updateGuest);
router.delete('/:guestId', deleteGuest);

export default router;

