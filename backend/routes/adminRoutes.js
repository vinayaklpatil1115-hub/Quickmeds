import express from 'express';
import {
  getAdminAnalytics,
  createCoupon,
  getUsers
} from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/analytics').get(protect, admin, getAdminAnalytics);
router.route('/coupons').post(protect, admin, createCoupon);
router.route('/users').get(protect, admin, getUsers);

export default router;
