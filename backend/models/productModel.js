// import mongoose from "mongoose";

// // Size schema for detailed size information
// const sizeSchema = new mongoose.Schema({
//     size: { type: String, required: true },
//     dimensions: {
//         chest: { type: Number },
//         length: { type: Number },
//         shoulder: { type: Number }
//     },
//     stock: { type: Number, default: 0 }
// }, { _id: false });

// // Category schema for multiple categories
// const categorySchema = new mongoose.Schema({
//     main: { type: String, required: true },
//     sub: { type: String, required: true }
// }, { _id: false });

// // Main product schema
// const productSchema = new mongoose.Schema({
//     // Basic Information (maintaining backward compatibility)
//     name: { 
//         type: String, 
//         required: true,
//         trim: true
//     },
//     description: { 
//         type: String, 
//         required: true 
//     },
//     price: { 
//         type: Number, 
//         required: true,
//         min: 0
//     },
    
//     // Images (supporting both old and new format)
//     image: { 
//         type: Array,
//         required: true
//     },
//     images: [{
//         url: String,
//         public_id: String
//     }],

//     // Categories (maintaining backward compatibility while adding support for multiple)
//     category: { 
//         type: String, 
//         required: true 
//     },
//     subCategory: { 
//         type: String, 
//         required: true 
//     },
//     categories: [categorySchema], // New field for multiple categories

//     // Sizes (supporting both simple array and detailed size information)
//     sizes: {
//         type: [sizeSchema],
//         required: true,
//         validate: {
//             validator: function(sizes) {
//                 // Accept both old array format and new detailed format
//                 return Array.isArray(sizes) && sizes.length > 0;
//             },
//             message: 'At least one size must be specified'
//         }
//     },

//     // Additional features
//     bestseller: { 
//         type: Boolean,
//         default: false
//     },
//     date: { 
//         type: Number,
//         required: true,
//         default: () => Date.now() 
//     },

//     // New fields
//     status: {
//         type: String,
//         enum: ['active', 'inactive', 'draft'],
//         default: 'active'
//     },
//     tags: [String],
//     totalStock: {
//         type: Number,
//         default: 0
//     },
//     lastModified: {
//         type: Number,
//         default: () => Date.now()
//     }
// });

// // Middleware to ensure backward compatibility and data consistency
// productSchema.pre('save', function(next) {
//     // Update totalStock
//     if (Array.isArray(this.sizes) && this.sizes[0]?.stock !== undefined) {
//         this.totalStock = this.sizes.reduce((sum, size) => sum + (size.stock || 0), 0);
//     }

//     // Ensure categories array includes the main category/subCategory
//     if (this.category && this.subCategory && (!this.categories || !this.categories.length)) {
//         this.categories = [{
//             main: this.category,
//             sub: this.subCategory
//         }];
//     }

//     // Update lastModified
//     this.lastModified = Date.now();

//     next();
// });

// // Virtual for checking if product is low on stock
// productSchema.virtual('isLowStock').get(function() {
//     return this.totalStock < 10;
// });

// // Method to get available sizes
// productSchema.methods.getAvailableSizes = function() {
//     return this.sizes.filter(size => size.stock > 0);
// };

// // Ensure virtual fields are included when converting to JSON
// productSchema.set('toJSON', { virtuals: true });
// productSchema.set('toObject', { virtuals: true });

// // Create model with checking for existing model to prevent duplicate model error
// const productModel = mongoose.models.product || mongoose.model("product", productSchema);

// export default productModel;

import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: Array, required: true },
    bestseller: { type: Boolean },
    date: { type: Number, required: true }
})

const productModel  = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel