import express from 'express';
import { createCustomOrder, getCustomOrders, getCustomOrderById, updateCustomOrder, deleteCustomOrder } from '../controllers/customController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const customRouter = express.Router();

// Route to create a new order
customRouter.post('/create', authUser, createCustomOrder);

// Route to get all orders
customRouter.get('/list', authUser, adminAuth, getCustomOrders);

// Route to get a single order by ID
customRouter.post('/single', authUser, adminAuth, getCustomOrderById);

// Route to update an order by ID
customRouter.post('/update', authUser, adminAuth, updateCustomOrder);

// Route to delete an order by ID
customRouter.delete('/delete', authUser, deleteCustomOrder);

export default customRouter;
