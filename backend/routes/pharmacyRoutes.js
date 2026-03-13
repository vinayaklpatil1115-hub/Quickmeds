import express from 'express';
import {
  getTopPharmacies,
  getNearbyPharmacies,
  getPharmacyById,
  registerPharmacy,
  updateInventory,
  getPharmacyOrders,
} from '../controllers/pharmacyController.js';
import { protect, pharmacy } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, pharmacy, registerPharmacy);
router.route('/top').get(getTopPharmacies);
router.route('/nearby').get(getNearbyPharmacies);
router.route('/inventory').post(protect, pharmacy, updateInventory);
router.route('/orders').get(protect, pharmacy, getPharmacyOrders);
router.route('/:id').get(getPharmacyById);
router.route('/:id/medicines').get(getPharmacyById); // Re-use for simplicity

export default router;
