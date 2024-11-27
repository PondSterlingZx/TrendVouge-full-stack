import userModel from "../models/userModel.js"

const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity = 1 } = req.body

        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.json({ success: false, message: "User not found" })
        }

        let cartData = userData.cartData || {};

        if (!cartData[itemId]) {
            cartData[itemId] = {}
        }
        
        cartData[itemId][size] = quantity

        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "Added To Cart" })
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body

        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.json({ success: false, message: "User not found" })
        }

        let cartData = userData.cartData || {};

        if (!cartData[itemId]) {
            cartData[itemId] = {}
        }

        if (quantity === 0) {
            delete cartData[itemId][size]
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId]
            }
        } else {
            cartData[itemId][size] = quantity
        }

        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "Cart Updated" })
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}



// get user cart data
const getUserCart = async (req,res) => {

    try {
        
        const { userId } = req.body
        
        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        res.json({ success: true, cartData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

export { addToCart, updateCart, getUserCart }