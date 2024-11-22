import wishlistModel from '../models/wishlistModel.js';

// Add an item to the wishlist
const addToWishlist = async (req, res) => {
    const { productId } = req.body;  // itemId should be renamed to productId

    if (!productId) {
        return res.status(400).json({ success: false, message: "Missing productId" });
    }

    const userId = req.body.userId;

    try {
        let wishlist = await wishlistModel.findOne({ userId });

        if (!wishlist) {
            // Create a new wishlist if the user doesn't have one
            wishlist = new wishlistModel({ userId, wishlist: [productId] });
        } else if (!wishlist.wishlist.includes(productId)) {
            // Add the product to the wishlist if it's not already there
            wishlist.wishlist.push(productId);
        } else {
            return res.status(400).json({ success: false, message: "Product already in wishlist" });
        }

        await wishlist.save();
        res.status(200).json({ success: true, message: "Product added to wishlist", wishlist });
    } catch (error) {
        // Handle database errors
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
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