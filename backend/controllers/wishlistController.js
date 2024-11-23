import wishlistModel from '../models/wishlistModel.js';
import userModel from '../models/userModel.js';
import productModel from '../models/productModel.js';
import { sendWishlistNotification } from '../utils/emailService.js';



const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.body.userId; // From auth middleware

        // Get user details
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Get product details
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Check and update wishlist
        let wishlist = await wishlistModel.findOne({ userId });

        if (!wishlist) {
            wishlist = new wishlistModel({ userId, wishlist: [productId] });
        } else if (!wishlist.wishlist.includes(productId)) {
            wishlist.wishlist.push(productId);
        } else {
            return res.status(400).json({
                success: false,
                message: "Product already in wishlist"
            });
        }

        await wishlist.save();

        // Send email notification
        console.log('Sending email to:', user.email);
        try {
            const emailResult = await sendWishlistNotification(
                user.email,
                user.name,
                {
                    name: product.name,
                    image: product.image,
                    price: product.price
                }
            );
            console.log('Email notification result:', emailResult);
        } catch (emailError) {
            console.error('Failed to send email:', emailError);
            // Continue with the response even if email fails
        }

        res.status(200).json({
            success: true,
            message: "Product added to wishlist",
            wishlist: wishlist.wishlist
        });

    } catch (error) {
        console.error('Wishlist operation failed:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update wishlist"
        });
    }
};


// Remove an item from the wishlist
const removeFromWishlist = async (req, res) => {
    const { productId } = req.body;

    const userId = req.body.userId;

    try {
        const wishlist = await wishlistModel.findOne({ userId });

        if (!wishlist) {
            return res.status(404).json({ success: false, message: "Wishlist not found" });
        }

        const index = wishlist.wishlist.indexOf(productId);
        if (index > -1) {
            wishlist.wishlist.splice(index, 1);
            await wishlist.save();
            res.status(200).json({ success: true, message: "Product removed from wishlist", wishlist });
        } else {
            res.status(400).json({ success: false, message: "Product not found in wishlist" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// Get a user's wishlist
const getWishlist = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ success: false, message: "Missing userId" });
    }

    try {
        const wishlist = await wishlistModel.findOne({ userId });

        if (!wishlist) {
            return res.status(404).json({ success: false, message: "Wishlist not found" });
        }

        res.status(200).json({ success: true, wishlist: wishlist.wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

export { addToWishlist, removeFromWishlist, getWishlist };


