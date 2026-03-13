import express from 'express';
import { sendMessage, getChatHistory } from '../controllers/chatController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, sendMessage)
  .get(protect, getChatHistory);

export default router;
