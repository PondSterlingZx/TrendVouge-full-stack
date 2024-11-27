import userModel from "../models/userModel.js"

// add products to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity = 1 } = req.body // Add quantity with default value of 1

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += quantity // Add the quantity instead of just 1
            } else {
                cartData[itemId][size] = quantity // Set initial quantity
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = quantity // Set initial quantity
        }

        await userModel.findByIdAndUpdate(userId, { cartData })

        res.json({ success: true, message: "Added To Cart" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// update user cart
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body

        // Add validation for quantity
        if (quantity < 0) {
            return res.json({ success: false, message: "Invalid quantity" })
        }

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        // If quantity is 0, remove the item
        if (quantity === 0) {
            if (cartData[itemId] && cartData[itemId][size]) {
                delete cartData[itemId][size]
                // If no sizes left, remove the entire item
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId]
                }
            }
        } else {
            // Ensure the nested structure exists
            if (!cartData[itemId]) {
                cartData[itemId] = {}
            }
            cartData[itemId][size] = quantity
        }

        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "Cart Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// get user cart data
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body
        
        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.json({ success: false, message: "User not found" })
        }

        let cartData = await userData.cartData;

        res.json({ success: true, cartData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Add a new function to handle batch cart updates
const batchAddToCart = async (req, res) => {
    try {
        const { userId, items } = req.body // items is an array of {itemId, size, quantity}

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        // Process each item in the batch
        items.forEach(({ itemId, size, quantity = 1 }) => {
            if (!cartData[itemId]) {
                cartData[itemId] = {}
            }
            cartData[itemId][size] = (cartData[itemId][size] || 0) + quantity
        })

        await userModel.findByIdAndUpdate(userId, { cartData })

        res.json({ success: true, message: "Items added to cart" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { addToCart, updateCart, getUserCart, batchAddToCart }