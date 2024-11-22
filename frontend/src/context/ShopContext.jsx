import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 0;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
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
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: { token } }
        );
        toast.success("Added to your Cart")
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      if (token) {
        const response = await axios.post(
          `${backendUrl}/api/wishlist/add`,
          { productId },
          { headers: { token } } // Use token in the header
        );
        if (response.data.success) {
          setWishlistItems((prev) => [...prev, productId]); // Update state efficiently
          toast.success("Added to wishlist");
        } else {
          toast.error(response.data.message || "Failed to add to wishlist");
        }
      } else {
        toast.error("User not authenticated");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding to wishlist");
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      if (token) {
        const response = await axios.post(
          `${backendUrl}/api/wishlist/remove`,
          { productId },
          { headers: { token } } // Use token in the header
        );
        if (response.data.success) {
          setWishlistItems((prev) => prev.filter((id) => id !== productId)); // Efficient state update
          toast.success("Removed from wishlist");
        } else {
          toast.error(
            response.data.message || "Failed to remove from wishlist"
          );
        }
      } else {
        toast.error("User not authenticated");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while removing from wishlist");
    }
  };

  const getWishlist = async (userId, token) => {
    try {
      if (token) {
        const response = await axios.get(
          `${backendUrl}/api/wishlist/${userId}`,
          { headers: { token } } // Use token in the header
        );
        if (response.data.success) {
          const wishlist = response.data.wishlist || []; // Default to empty array if no wishlist
          setWishlistItems(wishlist); // Update state with the fetched wishlist
          toast.success(
            wishlist.length > 0
              ? "Wishlist fetched successfully"
              : "Your wishlist is empty"
          );
        } else {
          toast.error(response.data.message || "Failed to fetch wishlist");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching the wishlist");
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!token && storedToken) {
      setToken(storedToken); // This sets the token from localStorage if it's not already set
    }
  }, [token]); // This only runs once at the beginning when token is not yet set

  useEffect(() => {
    if (token) {
      // All actions that depend on token are now called after token is available
      getUserCart(token);
      getWishlist();
    }
  }, [token]); // This effect will run every time `token` is updated

  useEffect(() => {
    console.log("Initial products fetch");
    getProductsData(); // Call the function to get the products
  }, []);

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
    getWishlist,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
