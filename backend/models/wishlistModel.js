import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true }, // Assuming one wishlist per user
    wishlist: { type: Array, required: true, default: [] }, // Array of product IDs
});

const wishlistModel = mongoose.models.wishlist || mongoose.model('wishlist', wishlistSchema);
export default wishlistModel;
