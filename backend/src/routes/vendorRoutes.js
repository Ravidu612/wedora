import express from 'express';
import {
  createVendor,
  getVendors,
  updateVendor,
  deleteVendor,
} from '../controllers/vendorController.js';
import { protect } from '../middleware/auth.js';
import { checkWeddingAccess } from '../middleware/weddingAccess.js';

const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(checkWeddingAccess);

router.post('/', createVendor);
router.get('/', getVendors);
router.put('/:vendorId', updateVendor);
router.delete('/:vendorId', deleteVendor);

export default router;

