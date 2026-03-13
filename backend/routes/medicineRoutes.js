import express from 'express';
import {
  getMedicineSuggestions,
  getBestsellerMedicines,
  getMedicines,
  getMedicineById,
  getMedicineInventory,
  getRecommendedMedicines,
  getMedicinePriceHistory
} from '../controllers/medicineController.js';

const router = express.Router();

router.route('/suggestions').get(getMedicineSuggestions);
router.route('/').get(getMedicines);
router.route('/bestsellers').get(getBestsellerMedicines);
router.route('/:id').get(getMedicineById);
router.route('/:id/inventory').get(getMedicineInventory);
router.route('/:id/recommended').get(getRecommendedMedicines);
router.route('/:id/history').get(getMedicinePriceHistory);

export default router;
