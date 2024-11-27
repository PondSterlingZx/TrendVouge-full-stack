import express from 'express';
import { getUserProfile, updateUserProfile, updateUserPassword, deleteUser } from '../controllers/profileController.js';
import upload from '../middleware/multer.js';
import authUser from '../middleware/auth.js';

const profileRouter = express.Router();

// Route to get user profile details
profileRouter.get('/display', authUser, getUserProfile);

// Route to update user profile details with image upload
profileRouter.put(
    '/update',
    authUser,
    upload.single('profilePicture'), // Handle single image upload for profile picture
    updateUserProfile
);

// Route to update user password
profileRouter.put('/update-password', authUser, updateUserPassword);

// Route to delete user account
profileRouter.delete('/delete', authUser, deleteUser);

export default profileRouter;
