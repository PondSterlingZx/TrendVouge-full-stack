import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"
import reviewModel from "../models/reviewModel.js"
import userModel from "../models/userModel.js"
import notifyModel from '../models/notifyModel.js';
import { sendNotifyEmails } from '../controllers/notifyController.js'; // Import the notify function

// function for add product
const addProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            subCategory,
            sizes,
            bestseller,
            customize,
            stockLevel
        } = req.body

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

        // Parse sizes array and create initial stock levels
        const parsedSizes = JSON.parse(sizes)
        const initialStockLevels = parsedSizes.reduce((acc, size) => {
            acc[size] = stockLevel ? (JSON.parse(stockLevel)[size] || 0) : 0;
            return acc;
        }, {});

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: parsedSizes,
            stockLevel: initialStockLevels,
            image: imagesUrl,
            customize: customize === "true" ? true : false,
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

const updateStockLevel = async (req, res) => {
    try {
        // Extract the restock data (an array of {productId, size, stockAmount})
        const { restockData } = req.body;

        // Validate that restockData is an array
        if (!Array.isArray(restockData) || restockData.length === 0) {
            return res.status(400).json({ success: false, message: "No restock data provided." });
        }

        // Loop over each restock item and update the stock levels accordingly
        for (let item of restockData) {
            const { productId, size, stockAmount } = item;

            // Find the product by its ID
            const product = await productModel.findById(productId);

            // If product is not found, return error
            if (!product) {
                return res.status(404).json({ success: false, message: `Product not found: ${productId}` });
            }

            // Check if stockLevel exists for the given size
            if (product.stockLevel.has(size)) {
                // Ensure both values are numbers before adding
                const currentStock = Number(product.stockLevel.get(size)) || 0; // Default to 0 if undefined
                const additionalStock = Number(stockAmount) || 0; // Default to 0 if stockAmount is invalid
                product.stockLevel.set(size, currentStock + additionalStock);
            } else {
                // Initialize the stock level with a numeric value
                product.stockLevel.set(size, Number(stockAmount) || 0);
            }

            // Save the updated product
            await product.save();

            // After updating stock, send notifications for this product and size
            await sendNotifyEmails(productId, size);
        }

        // Return success response after updating all stock levels and sending notifications
        res.json({ success: true, message: "Stock levels updated and notifications sent successfully." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error updating stock levels and notifying users." });
    }
};


// function for list product
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for removing product, its reviews and from wishlists
const removeProduct = async (req, res) => {
    try {
        // Delete the product
        const deletedProduct = await productModel.findByIdAndDelete(req.body.id)
        if (!deletedProduct) {
            return res.json({ success: false, message: "Product not found" })
        }

        // Delete all reviews associated with this product
        await reviewModel.deleteMany({ productId: req.body.id })

        // Remove product from all user wishlists
        await userModel.updateMany(
            { wishlist: req.body.id }, // Find users whose wishlist contains this product
            { $pull: { wishlist: req.body.id } } // Remove the product ID from their wishlist array
        );

        res.json({ success: true, message: "Product, associated reviews and wishlist entries removed" })

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
        res.json({ success: true, product })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { listProducts, addProduct, removeProduct, singleProduct, updateStockLevel }