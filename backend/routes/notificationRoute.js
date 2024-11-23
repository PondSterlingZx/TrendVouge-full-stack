// routes/notificationRoute.js
import express from 'express';
import { sendWishlistNotification } from '../controllers/notificationController.js';
import authUser from '../middleware/auth.js';

const notificationRouter = express.Router();
notificationRouter.post('/wishlist', authUser, sendWishlistNotification);

export default notificationRouter;