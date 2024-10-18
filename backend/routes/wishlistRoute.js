

const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const authMiddleware = require('../middleware/authMiddleware');

// Add to wishlist
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { itemId } = req.body;
        const user = await User.findById(req.user.id);
        if (!user.wishlist.includes(itemId)) {
            user.wishlist.push(itemId);
            await user.save();
        }
        res.json({ success: true, message: 'Added to wishlist' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Remove from wishlist
router.post('/remove', authMiddleware, async (req, res) => {
    try {
        const { itemId } = req.body;
        const user = await User.findById(req.user.id);
        user.wishlist = user.wishlist.filter(id => id.toString() !== itemId);
        await user.save();
        res.json({ success: true, message: 'Removed from wishlist' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get wishlist
router.get('/get', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({ success: true, wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
