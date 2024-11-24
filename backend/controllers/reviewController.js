import reviewModel from "../models/reviewModel.js";

// Function to add a review
const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        // The userId is now in req.body.userId 
        const userId = req.body.userId;

        // Create a new review document and save it
        const reviewData = {
            productId,
            userId,
            rating,
            comment,
            date: Date.now()
        };

        const review = new reviewModel(reviewData);
        await review.save();

        // Return a success response with the review
        res.json({ success: true, message: "Review added successfully", review });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Function to get reviews by product
const getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.body; // Extract productId from the request body

        // Use aggregation to fetch reviews and join user data
        const reviews = await reviewModel.aggregate([
            { $match: { productId } }, // Match reviews for the given productId
            {
                $addFields: {
                    userId: { $toObjectId: "$userId" }, // Convert userId to ObjectId for matching
                },
            },
            {
                $lookup: {
                    from: "users", // The name of the users collection
                    localField: "userId", // Field in the reviews collection
                    foreignField: "_id", // Field in the users collection
                    as: "user", // Alias for the joined user data
                    pipeline: [
                        { $project: { name: 1, _id: 1 } } // Include both name and _id of the user
                    ],
                },
            },
            {
                $unwind: "$user", // Flatten the user array to simplify the output
            },
            {
                $project: {
                    rating: 1, // Include rating
                    comment: 1, // Include comment
                    create: 1, // Include create
                    "user.name": 1, // Include only the user's name
                    "user._id": { $toString: "$user._id" }, // Convert ObjectId to string for _id
                },
            },
        ]);

        // Handle no reviews case
        // if (reviews.length === 0) {
        //     return res.json({ success: false, message: "No reviews found for this product." });
        // }

        // Return the reviews with user data
        res.json({ success: true, reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// Function to delete a review
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await reviewModel.findById(reviewId);

        // Delete the review
        await reviewModel.findByIdAndDelete(reviewId);
        res.json({ success: true, message: "Review removed successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


const editReview = async (req, res) => {
    try {
        const { reviewId, rating, comment } = req.body;  // Destructure reviewId, rating, and comment from the request body

        // Validate reviewId and ensure rating and comment are valid
        if (!reviewId || typeof reviewId !== 'string') {
            return res.status(400).json({ success: false, message: "Invalid review ID format." });
        }

        if (rating && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
            return res.status(400).json({ success: false, message: "Rating should be a number between 1 and 5." });
        }

        if (comment && typeof comment !== 'string') {
            return res.status(400).json({ success: false, message: "Comment should be a string." });
        }

        // Check if the review exists
        const review = await reviewModel.findById(reviewId);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found." });
        }

        // Update the review with new data (rating and/or comment)
        review.rating = rating !== undefined ? rating : review.rating;  // If rating is provided, update it
        review.comment = comment !== undefined ? comment : review.comment;  // If comment is provided, update it

        // Save the updated review
        await review.save();

        // Respond with the updated review
        res.json({ success: true, message: "Review updated successfully.", review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error occurred." });
    }
};


export { addReview, getReviewsByProduct, deleteReview, editReview };
