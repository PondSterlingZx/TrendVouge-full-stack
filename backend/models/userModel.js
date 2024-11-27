import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Replacing 'name' with 'username'
    firstName: { type: String, default: "" },              // Adding first name
    middleName: { type: String, default: "" },                // Adding middle name (optional)
    lastName: { type: String, default: "" },               // Adding last name
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    wishlist: { type: [String], default: [] },                // Array of strings, default is an empty array

    // New optional profile fields
    phone: { type: String, default: "" },
    address: {
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        postalCode: { type: String, default: "" },
        country: { type: String, default: "" },
    },
    profileURL: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    bio: { type: String, default: "" },
    dateOfBirth: { type: Date, default: null },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "Other" },
    joinedAt: { type: Date, default: Date.now },
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
