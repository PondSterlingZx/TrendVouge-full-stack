import mongoose from "mongoose";

const sizeRecommendationSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    answers: {
        fit_preference: String,
        body_type: String,
        height_range: String,
        current_size: String,
        problem_areas: String
    },
    recommendedSize: String,
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

const sizeRecommendationModel = mongoose.models.sizeRecommendation || 
    mongoose.model("sizeRecommendation", sizeRecommendationSchema);

export default sizeRecommendationModel;