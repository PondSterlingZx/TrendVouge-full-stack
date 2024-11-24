import mongoose from 'mongoose';

const notifySchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', // Reference to the Product model
            required: true
        },
        size: {
            type: String,
            required: true
        },
        emails: [{
            type: String,
            required: true
        }] // Array of email addresses to notify
    }
);

// Optional index for better query performance
notifySchema.index({ productId: 1, size: 1 });

const notifyModel = mongoose.models.notify || mongoose.model('notify', notifySchema);

export default notifyModel;
