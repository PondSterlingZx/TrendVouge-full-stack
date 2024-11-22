import express from "express";
import { addReview, getReviewsByProduct, deleteReview, editReview } from "../controllers/reviewController.js";
import authUser from '../middleware/auth.js';

const reviewRouter = express.Router();

reviewRouter.post("/add", authUser, addReview);
reviewRouter.post("/list", getReviewsByProduct);
reviewRouter.delete("/remove/:reviewId", authUser, deleteReview);
reviewRouter.patch("/edit", authUser, editReview); //suspend

export default reviewRouter;
