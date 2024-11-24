import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    age: { type: Number },
    bio: { type: String },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zip: { type: String },
        country: { type: String }
    },
    profilePicture: { type: String }, // URL to the profile picture
    phoneNumber: { type: String }
});

const profileModel = mongoose.model('profile', profileSchema);
export default profileModel;
