import sizeRecommendationModel from '../models/sizeRecommendationModel.js';

export const saveSizeRecommendation = async (req, res) => {
    try {
        const { userId, answers, recommendedSize } = req.body;

        // Update or create size recommendation
        const sizeRec = await sizeRecommendationModel.findOneAndUpdate(
            { userId },
            {
                answers,
                recommendedSize,
                lastUpdated: Date.now()
            },
            { upsert: true, new: true }
        );

        res.json({
            success: true,
            message: "Size recommendation saved",
            recommendation: sizeRec
        });

    } catch (error) {
        console.error('Save size recommendation error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getUserSizeRecommendation = async (req, res) => {
    try {
        const { userId } = req.query;

        const sizeRec = await sizeRecommendationModel
            .findOne({ userId })
            .select('-__v');

        res.json({
            success: true,
            recommendation: sizeRec
        });

    } catch (error) {
        console.error('Get size recommendation error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};