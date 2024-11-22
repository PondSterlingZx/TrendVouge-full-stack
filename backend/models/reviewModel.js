import mongoose from "mongoose";

// Define the review schema
const reviewSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Link to user
    productId: { type: String, required: true }, // Link to product
    rating: { type: Number, required: true, min: 1, max: 5 }, // Rating between 1 and 5
    comment: { type: String, required: true }, // Review text
    create: { type: Date, default: Date.now }, // Review date 
});

// Create or get the review model
const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);

export default reviewModel;
