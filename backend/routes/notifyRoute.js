import express from 'express';
import { sendNotifyEmails, addNotify } from '../controllers/notifyController.js';
import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const notifyRouter = express.Router();

// Route to add a new notification
notifyRouter.post('/add', authUser, addNotify);

// Route to send notification emails (restricted to admins)
notifyRouter.post('/send-emails', adminAuth, async (req, res) => {
    try {
        await sendNotifyEmails();
        res.json({ success: true, message: 'Notification emails sent successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error sending notification emails.' });
    }
});

export default notifyRouter;
