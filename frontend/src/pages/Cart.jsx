import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  // Destructure values from ShopContext
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);

  // State for cart data and whether the cart is empty
  const [cartData, setCartData] = useState([]);
  const [isCartEmpty, setIsCartEmpty] = useState(true);

  // Effect to update the cart data when cartItems or products change
  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      // Loop through cartItems and map to cartData
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData); // Set the cart data
      setIsCartEmpty(tempData.length === 0); // Check if cart is empty
    }
  }, [cartItems, products]); // Dependency on cartItems and products

  return (
    <div className="border-t pt-14">
      {/* Cart Title */}
      <div className="text-2xl mb-3">
        <Title text1={"MY"} text2={"CART"} />
      </div>

      {/* Conditional rendering based on whether the cart is empty */}
      {isCartEmpty ? (
        // Empty cart message and button to continue shopping
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate("/")} // Navigate to home page
            className="bg-black text-white text-sm px-8 py-3 hover:bg-gray-800"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      ) : (
        // Cart items displayed if not empty
        <>
          <div>
            {/* Map through cartData and display each product */}
            {cartData.map((item, index) => {
              const productData = products.find(
                (product) => product._id === item._id
              ); // Get product details by ID

              return (
                <div
                  key={index}
                  className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
                >
                  {/* Product Information */}
                  <div className="flex items-start gap-6">
                    <img
                      className="w-16 sm:w-20"
                      src={productData.image[0]}
                      alt=""
                    />{" "}
                    {/* Product Image */}
                    <div>
                      <p className="text-xs sm:text-lg font-medium">
                        {productData.name}
                      </p>{" "}
                      {/* Product Name */}
                      <div className="flex items-center gap-5 mt-2">
                        <p>
                          {currency}
                          {productData.price}
                        </p>{" "}
                        {/* Product Price */}
                        <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                          {item.size}
                        </p>{" "}
                        {/* Product Size */}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Input Field */}
                  <input
                    onChange={(e) =>
                      e.target.value === "" || e.target.value === "0"
                        ? null
                        : updateQuantity(
                            item._id,
                            item.size,
                            Number(e.target.value)
                          )
                    }
                    className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                    type="number"
                    min={1}
                    max={productData.stockLevel[item.size]}
                    defaultValue={item.quantity}
                  />

                  {/* Remove Item Button */}
                  <img
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                    className="w-4 mr-4 sm:w-5 cursor-pointer"
                    src={assets.bin_icon}
                    alt="Remove"
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-end my-20">
            <div className="w-full sm:w-[450px]">
              {/* Cart Total */}
              <CartTotal />
              <div className="w-full text-end">
                {/* Button to navigate to checkout */}
                <button
                  onClick={() => {
                    // Check if any item's quantity exceeds available stock
                    const exceedsStock = cartData.some(item => {
                      const productData = products.find(product => product._id === item._id);
                      return item.quantity > productData.stockLevel[item.size];
                    });

                    if (exceedsStock) {
                      toast.warning("Some items exceed available stock. Please adjust quantities.");
                    } else {
                      navigate("/place-order");
                    }
                  }}
                  className="bg-black text-white text-sm my-8 px-8 py-3 hover:bg-gray-800 transition-colors"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
