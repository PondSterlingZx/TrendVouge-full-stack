import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '$';
    const delivery_fee = 0;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('')
    const [wishlistItems, setWishlistItems] = useState([]);
    const navigate = useNavigate();


    const fetchProducts = async () => {
        try {
            console.log("Fetching products from:", backendUrl + '/api/product/list');
            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                console.log("Fetched products successfully");
                console.log("Number of products:", response.data.products.length);
                console.log("First product:", response.data.products[0]);
                setProducts(response.data.products.reverse())
            } else {
                console.error("Failed to fetch products:", response.data.message);
                toast.error(response.data.message)
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error(error.message)
        }
    }

    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    // Handle error if needed
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData)

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {
                    // Handle error if needed
                }
            }
        }
        return totalAmount;
    }

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

     const addToWishlist = async (itemId) => {
        try {
            if (token) {
                const response = await axios.post(backendUrl + '/api/wishlist/add', { itemId }, { headers: { token } });
                if (response.data.success) {
                    setWishlistItems([...wishlistItems, itemId]);
                    toast.success('Added to wishlist');
                }
            } else {
                setWishlistItems([...wishlistItems, itemId]);
                toast.success('Added to wishlist');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to add to wishlist');
        }
    }

    const removeFromWishlist = async (itemId) => {
        try {
            if (token) {
                const response = await axios.post(backendUrl + '/api/wishlist/remove', { itemId }, { headers: { token } });
                if (response.data.success) {
                    setWishlistItems(wishlistItems.filter(id => id !== itemId));
                    toast.success('Removed from wishlist');
                }
            } else {
                setWishlistItems(wishlistItems.filter(id => id !== itemId));
                toast.success('Removed from wishlist');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to remove from wishlist');
        }
    }

    const getWishlist = async () => {
        try {
            if (token) {
                const response = await axios.get(backendUrl + '/api/wishlist/get', { headers: { token } });
                if (response.data.success) {
                    setWishlistItems(response.data.wishlist);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch wishlist');
        }
    }

    useEffect(() => {
        console.log("Initial products fetch");
        fetchProducts()
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
            getWishlist()
        }
        if (token) {
            getUserCart(token)
            getWishlist()
        }
    }, [token])

    const value = {
        products, 
        currency, 
        delivery_fee,
        search, 
        setSearch, 
        showSearch, 
        setShowSearch,
        cartItems, 
        addToCart,
        setCartItems,
        getCartCount, 
        updateQuantity,
        getCartAmount, 
        navigate, 
        backendUrl,
        setToken, 
        token,
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        fetchProducts
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;