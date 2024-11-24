import userModel from '../models/userModel.js';
import { sendWishlistNotification } from '../utils/emailService.js';



const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.body.userId; // From auth middleware
        const user = await userModel.findById(userId); // Get user details

        // Add product to wishlist
        user.wishlist.push(productId);
        await user.save();

        // Send email notification
        // console.log('Sending email to:', user.email);
        // try {
        //     const emailResult = await sendWishlistNotification(
        //         user.email,
        //         user.name,
        //         {
        //             name: product.name,
        //             image: product.image,
        //             price: product.price
        //         }
        //     );
        //     console.log('Email notification result:', emailResult);
        // } catch (emailError) {
        //     console.error('Failed to send email:', emailError);
        //     // Continue with the response even if email fails
        // }

        res.status(200).json({
            success: true,
            message: "Product added to wishlist",
            wishlist: user.wishlist
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
    const userId = req.body.userId; // From auth middleware

    try {
        const user = await userModel.findById(userId); // Get user details
        const productIndex = user.wishlist.indexOf(productId); // Get wishlist index

        // Remove the product from the wishlist
        user.wishlist.splice(productIndex, 1);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
            wishlist: user.wishlist,
        });

    } catch (error) {
        console.error('Error removing from wishlist:', error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// Get a user's wishlist
const getWishlist = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "Missing userId"
        });
    }

    try {
        // Find the user by ID
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Respond with the user's wishlist
        return res.status(200).json({
            success: true,
            wishlist: user.wishlist
        });
    } catch (error) {
        console.error('Error retrieving wishlist:', error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export { addToWishlist, removeFromWishlist, getWishlist };


