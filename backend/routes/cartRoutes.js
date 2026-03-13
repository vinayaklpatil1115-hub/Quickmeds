import express from 'express';
import {
  addItemToCart,
  getUserCart,
  updateCartItemQty,
  removeCartItem,
  clearCart
} from '../controllers/cartController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, addItemToCart)
  .get(protect, getUserCart)
  .delete(protect, clearCart);

router.route('/:id')
  .put(protect, updateCartItemQty)
  .delete(protect, removeCartItem);

export default router;
