// import { v2 as cloudinary } from "cloudinary";
// import productModel from "../models/productModel.js";
// import { validateProduct } from "../validators/productValidator.js";

// // Configure cloudinary with proper error handling
// const configureCloudinary = () => {
//     if (!process.env.CLOUDINARY_URL) {
//         throw new Error('Cloudinary configuration is missing');
//     }
// };

// /**
//  * Add a new product with enhanced features
//  */
// const addProduct = async (req, res) => {
//     try {
//         const {
//             name,
//             description,
//             price,
//             categories, // Now an array of category objects
//             sizes, // Enhanced size data with dimensions
//             bestseller,
//             tags = []
//         } = req.body;

//         // Validate incoming data
//         const validationResult = validateProduct(req.body);
//         if (!validationResult.success) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Validation failed",
//                 errors: validationResult.errors
//             });
//         }

//         // Handle image uploads
//         const imageFiles = [
//             req.files.image1?.[0],
//             req.files.image2?.[0],
//             req.files.image3?.[0],
//             req.files.image4?.[0]
//         ].filter(Boolean);

//         // Upload images to Cloudinary with enhanced error handling
//         const imagesData = await Promise.all(
//             imageFiles.map(async (file) => {
//                 try {
//                     const result = await cloudinary.uploader.upload(file.path, {
//                         resource_type: 'image',
//                         folder: 'products',
//                         quality: 'auto:best',
//                         fetch_format: 'auto'
//                     });
//                     return {
//                         url: result.secure_url,
//                         public_id: result.public_id
//                     };
//                 } catch (error) {
//                     throw new Error(`Failed to upload image: ${error.message}`);
//                 }
//             })
//         );

//         // Parse and validate sizes data
//         const parsedSizes = JSON.parse(sizes).map(size => ({
//             size: size.size,
//             dimensions: {
//                 chest: Number(size.dimensions.chest),
//                 length: Number(size.dimensions.length),
//                 shoulder: Number(size.dimensions.shoulder)
//             },
//             stock: Number(size.stock)
//         }));

//         // Create product data object
//         const productData = {
//             name,
//             description,
//             categories: JSON.parse(categories).map(cat => ({
//                 main: cat.main,
//                 sub: cat.sub
//             })),
//             price: Number(price),
//             bestseller: bestseller === "true",
//             sizes: parsedSizes,
//             images: imagesData,
//             tags,
//             totalStock: parsedSizes.reduce((sum, size) => sum + size.stock, 0),
//             status: 'active',
//             date: Date.now()
//         };

//         // Create and save product
//         const product = new productModel(productData);
//         await product.save();

//         res.status(201).json({
//             success: true,
//             message: "Product Added Successfully",
//             product
//         });

//     } catch (error) {
//         console.error('Product Addition Error:', error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to add product",
//             error: error.message
//         });
//     }
// };

// /**
//  * List products with advanced filtering and pagination
//  */
// const listProducts = async (req, res) => {
//     try {
//         const {
//             page = 1,
//             limit = 10,
//             sort = '-date',
//             category,
//             subCategory,
//             minPrice,
//             maxPrice,
//             status,
//             search,
//             inStock
//         } = req.query;

//         // Build filter object
//         const filter = {};
        
//         if (category) {
//             filter['categories.main'] = category;
//         }
//         if (subCategory) {
//             filter['categories.sub'] = subCategory;
//         }
//         if (status) {
//             filter.status = status;
//         }
//         if (minPrice || maxPrice) {
//             filter.price = {};
//             if (minPrice) filter.price.$gte = Number(minPrice);
//             if (maxPrice) filter.price.$lte = Number(maxPrice);
//         }
//         if (inStock === 'true') {
//             filter.totalStock = { $gt: 0 };
//         }
//         if (search) {
//             filter.$or = [
//                 { name: { $regex: search, $options: 'i' } },
//                 { description: { $regex: search, $options: 'i' } },
//                 { tags: { $in: [new RegExp(search, 'i')] } }
//             ];
//         }

//         // Execute query with pagination
//         const products = await productModel
//             .find(filter)
//             .sort(sort)
//             .skip((page - 1) * limit)
//             .limit(Number(limit))
//             .lean();

//         // Get total count for pagination
//         const total = await productModel.countDocuments(filter);

//         res.json({
//             success: true,
//             products,
//             pagination: {
//                 current: Number(page),
//                 total: Math.ceil(total / limit),
//                 totalItems: total
//             }
//         });

//     } catch (error) {
//         console.error('Product Listing Error:', error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch products",
//             error: error.message
//         });
//     }
// };

// /**
//  * Remove product with image cleanup
//  */
// const removeProduct = async (req, res) => {
//     try {
//         const { id } = req.params;

//         // Find product to get image public_ids
//         const product = await productModel.findById(id);
//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Product not found"
//             });
//         }

//         // Delete images from Cloudinary
//         await Promise.all(
//             product.images.map(async (image) => {
//                 try {
//                     await cloudinary.uploader.destroy(image.public_id);
//                 } catch (error) {
//                     console.error(`Failed to delete image: ${image.public_id}`, error);
//                 }
//             })
//         );

//         // Delete product
//         await productModel.findByIdAndDelete(id);

//         res.json({
//             success: true,
//             message: "Product Removed Successfully"
//         });

//     } catch (error) {
//         console.error('Product Removal Error:', error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to remove product",
//             error: error.message
//         });
//     }
// };

// /**
//  * Get single product info with enhanced details
//  */
// const singleProduct = async (req, res) => {
//     try {
//         const { productId } = req.params;

//         const product = await productModel
//             .findById(productId)
//             .lean();

//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Product not found"
//             });
//         }

//         // Calculate additional product info
//         const totalStock = product.sizes.reduce((sum, size) => sum + size.stock, 0);
//         const isLowStock = totalStock < 10;

//         res.json({
//             success: true,
//             product: {
//                 ...product,
//                 totalStock,
//                 isLowStock
//             }
//         });

//     } catch (error) {
//         console.error('Single Product Fetch Error:', error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch product",
//             error: error.message
//         });
//     }
// };

// /**
//  * Update product details
//  */
// const updateProduct = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updateData = req.body;

//         // Find existing product
//         const product = await productModel.findById(id);
//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Product not found"
//             });
//         }

//         // Handle image updates if present
//         if (req.files && Object.keys(req.files).length > 0) {
//             // Delete old images
//             await Promise.all(
//                 product.images.map(image => 
//                     cloudinary.uploader.destroy(image.public_id)
//                 )
//             );

//             // Upload new images
//             const imageFiles = [
//                 req.files.image1?.[0],
//                 req.files.image2?.[0],
//                 req.files.image3?.[0],
//                 req.files.image4?.[0]
//             ].filter(Boolean);

//             const imagesData = await Promise.all(
//                 imageFiles.map(async (file) => {
//                     const result = await cloudinary.uploader.upload(file.path, {
//                         resource_type: 'image',
//                         folder: 'products',
//                         quality: 'auto:best'
//                     });
//                     return {
//                         url: result.secure_url,
//                         public_id: result.public_id
//                     };
//                 })
//             );

//             updateData.images = imagesData;
//         }

//         // Update sizes if present
//         if (updateData.sizes) {
//             updateData.sizes = JSON.parse(updateData.sizes).map(size => ({
//                 size: size.size,
//                 dimensions: {
//                     chest: Number(size.dimensions.chest),
//                     length: Number(size.dimensions.length),
//                     shoulder: Number(size.dimensions.shoulder)
//                 },
//                 stock: Number(size.stock)
//             }));
//             updateData.totalStock = updateData.sizes.reduce(
//                 (sum, size) => sum + size.stock, 0
//             );
//         }

//         // Update categories if present
//         if (updateData.categories) {
//             updateData.categories = JSON.parse(updateData.categories);
//         }

//         // Update product
//         const updatedProduct = await productModel.findByIdAndUpdate(
//             id,
//             { 
//                 ...updateData,
//                 lastModified: Date.now()
//             },
//             { new: true, runValidators: true }
//         );

//         res.json({
//             success: true,
//             message: "Product Updated Successfully",
//             product: updatedProduct
//         });

//     } catch (error) {
//         console.error('Product Update Error:', error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to update product",
//             error: error.message
//         });
//     }
// };

// export {
//     listProducts,
//     addProduct,
//     removeProduct,
//     singleProduct,
//     updateProduct
// };

import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"

// function for add product
const addProduct = async (req, res) => {
    try {

        const { name, description, price, category, subCategory, sizes, bestseller } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData);

        const product = new productModel(productData);
        await product.save()

        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        
        const products = await productModel.find({});
        res.json({success:true,products})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product Removed"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({success:true,product})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { listProducts, addProduct, removeProduct, singleProduct }