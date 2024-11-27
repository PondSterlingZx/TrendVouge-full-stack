import { v2 as cloudinary } from "cloudinary"
import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';

// Get user profile details
const getUserProfile = async (req, res) => {
    try {
        const userId = req.body.userId;

        // Check if the userId is provided
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID not provided' });
        }

        // Fetch the user details (excluding sensitive data like password)
        const user = await userModel.findById(userId).select('-password'); // Don't include password in response

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Send the user profile details as response
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching user profile' });
    }
};

// Update user profile details
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.body.userId;
        const { username, email, firstName, middleName, lastName, phone, address, bio, profilePicture, gender, dateOfBirth } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID not provided' });
        }

        let profileURL = null;

        // Fetch the existing user
        const prevUser = await userModel.findById(userId);
        if (!prevUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (profilePicture) {
            try {
                // Delete old image (optional)
                if (prevUser.profileURL) {
                    const publicId = prevUser.profileURL.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(publicId); // Deletes previous image
                }

                // Upload new image
                const uploadResult = await cloudinary.uploader.upload(profilePicture, { resource_type: 'image' });
                profileURL = uploadResult.secure_url;
            } catch (error) {
                return res.status(500).json({ success: false, message: 'Error uploading profile picture' });
            }
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                username,
                email,
                firstName,
                middleName,
                lastName,
                phone,
                address,
                bio,
                profileURL: profileURL || prevUser.profileURL, // Use new URL or keep existing
                gender,
                dateOfBirth,
            },
            { new: true }
        );

        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ success: false, message: 'Server error while updating profile' });
    }
};


// Update user password
const updateUserPassword = async (req, res) => {
    try {
        const userId = req.body.userId;
        const { currentPassword, newPassword } = req.body;

        // Check if the userId is provided
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID not provided' });
        }

        // Find the user by ID
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Compare the current password with the user's stored password
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect current password' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the password in the database
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ success: false, message: 'Server error while updating password' });
    }
};

// Delete user account
const deleteUser = async (req, res) => {
    try {
        const userId = req.body.userId;

        // Check if the userId is provided
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID not provided' });
        }

        // Find the user by ID and delete the account
        const user = await userModel.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'User account deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Server error while deleting user account' });
    }
};

export { getUserProfile, updateUserProfile, updateUserPassword, deleteUser };
