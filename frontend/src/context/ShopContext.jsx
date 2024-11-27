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

  const addToCart = async (itemId, size, quantity = 1, suppressToast = false) => {
    if (!size) {
      if (!suppressToast) toast.error("Select Product Size");
      return;
    }
  
    if (quantity <= 0) {
      if (!suppressToast) toast.error("Invalid product quantity");
      return;
    }
  
    try {
      let cartData = structuredClone(cartItems);
  
      // Initialize nested structure if it doesn't exist
      if (!cartData[itemId]) {
        cartData[itemId] = {};
      }
  
      // Add or update quantity
      cartData[itemId][size] = (cartData[itemId][size] || 0) + quantity;
  
      // Update local state
      setCartItems(cartData);
  
      // Update backend if user is logged in
      if (token) {
        await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId, size, quantity },
          { headers: { token } }
        );
  
        if (!suppressToast) {
          toast.success("Added to cart successfully");
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (!suppressToast) {
        toast.error("Failed to update cart");
      }
    }
  };

  
  
  // Add new function for batch adding items
  const addMultipleToCart = async (items) => {
    if (!token) {
      toast.error("Please sign in to add items to cart");
      return;
    }
  
    try {
      // Update local state first
      let cartData = structuredClone(cartItems);
      
      items.forEach(({ itemId, size, quantity }) => {
        if (!cartData[itemId]) {
          cartData[itemId] = {};
        }
        if (cartData[itemId][size]) {
          cartData[itemId][size] += quantity;
        } else {
          cartData[itemId][size] = quantity;
        }
      });
  
      setCartItems(cartData);
  
      // Batch update on backend
      await axios.post(
        backendUrl + "/api/cart/batch-add",
        { items },
        { headers: { token } }
      );
  
      toast.success("All items added to cart successfully");
    } catch (error) {
      console.error("Error adding items to cart:", error);
      toast.error("Failed to add some items to cart");
      
      // Refresh cart from server on error
      getUserCart(token);
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

  const updateQuantity = async (itemId, size, newQuantity) => {
    try {
      let cartData = structuredClone(cartItems);
  
      if (newQuantity <= 0) {
        // Remove the size entry if quantity is 0
        if (cartData[itemId]) {
          delete cartData[itemId][size];
          // Remove the product entry if no sizes left
          if (Object.keys(cartData[itemId]).length === 0) {
            delete cartData[itemId];
          }
        }
      } else {
        // Update quantity
        if (!cartData[itemId]) cartData[itemId] = {};
        cartData[itemId][size] = newQuantity;
      }
  
      setCartItems(cartData);
  
      if (token) {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId, size, quantity: newQuantity },
          { headers: { token } }
        );
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };
  
  const removeFromCart = async (itemId, size) => {
    try {
      let cartData = structuredClone(cartItems);
      
      if (cartData[itemId]) {
        delete cartData[itemId][size];
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      }
  
      setCartItems(cartData);
  
      if (token) {
        await axios.post(
          `${backendUrl}/api/cart/remove`,
          { itemId, size },
          { headers: { token } }
        );
        toast.success("Item removed from cart");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
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
      // Add product to wishlist
      const response = await axios.post(
        `${backendUrl}/api/wishlist/add`,
        { productId }, // Pass productId directly
        { headers: { token } }
      );

      if (response.data.success) {
        // Update local state on success
        setWishlistItems((prev) => [...prev, productId]);
        toast.success("Added to wishlist successfully!");
      } else {
        toast.warning(
          response.data.message || "Could not add item to wishlist"
        );
      }
    } catch (error) {
      // Log error for debugging
      console.error("Wishlist error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // Handle specific error scenarios
      toast.error("Failed to add to wishlist. Please try again.");
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      if (!token) {
        toast.error("User not authenticated");
        return;
      }

      // Get userId first
      const userResponse = await axios.post(
        `${backendUrl}/api/user/getId`,
        {},
        { headers: { token } }
      );

      const userId = userResponse?.data?.userId;

      if (!userId) {
        toast.error("Failed to retrieve user information. Please try again.");
        return;
      }

      // Send request to remove product from wishlist
      const response = await axios.post(
        `${backendUrl}/api/wishlist/remove`,
        { productId, userId },
        { headers: { token, "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        // Update local state to reflect removal
        setWishlistItems((prev) => prev.filter((id) => id !== productId));
        toast.success("Removed from wishlist");
      } else {
        toast.warning(
          response.data.message || "Failed to remove item from wishlist"
        );
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("An error occurred while removing from wishlist");

      // Detailed logging for debugging
      if (error.response) {
        console.error("Error response data:", error.response?.data);
        console.error("Error status:", error.response?.status);
      }
    }
  };

  const getWishlist = async () => {
    try {
      if (!token) {
        toast.error("User not authenticated");
        return;
      }

      // Get user ID
      const userResponse = await axios.post(
        `${backendUrl}/api/user/getId`,
        {},
        { headers: { token } }
      );

      const userId = userResponse?.data?.userId;

      if (!userId) {
        toast.error("Failed to retrieve user information. Please try again.");
        return;
      }

      //console.log("Got userId:", userId);

      // Fetch wishlist data for the user
      const wishlistResponse = await axios.get(
        `${backendUrl}/api/wishlist/${userId}`,
        { headers: { token } }
      );

      //console.log("Wishlist response:", wishlistResponse.data);

      // Check if the response is successful and handle accordingly
      if (wishlistResponse.data.success) {
        setWishlistItems(wishlistResponse.data.wishlist || []);
      } else {
        toast.warning("No wishlist found or failed to load wishlist");
        setWishlistItems([]); // Set empty array if no wishlist is found
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);

      // Handle specific error cases
      if (error.response?.status === 404) {
        // If the wishlist is not found, set empty array instead of showing error
        toast.info("Wishlist is empty or not found");
        setWishlistItems([]);
      } else if (error.response?.status === 401) {
        // Handle unauthorized error
        toast.error("Unauthorized access. Please sign in.");
      } else {
        // Handle general errors
        toast.error("An error occurred while fetching the wishlist");
      }
    }
  };

  // Add this helper function to get userId
  const getUserId = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/getId`,
        {},
        { headers: { token } }
      );
      return response.data.userId;
    } catch (error) {
      console.error("Error getting user ID:", error);
      throw error;
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
    //console.log("Initial products fetch");
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
    addMultipleToCart,
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
    getUserId,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
