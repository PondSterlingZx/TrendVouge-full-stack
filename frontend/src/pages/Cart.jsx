import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, removeFromCart, navigate } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [isCartEmpty, setIsCartEmpty] = useState(true);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      // Improved cart data mapping
      Object.entries(cartItems).forEach(([productId, sizes]) => {
        Object.entries(sizes).forEach(([size, quantity]) => {
          if (quantity > 0) {
            const product = products.find(p => p._id === productId);
            if (product) {
              tempData.push({
                _id: productId,
                size: size,
                quantity: quantity,
                product: product // Include full product data
              });
            }
          }
        });
      });
      
      setCartData(tempData);
      setIsCartEmpty(tempData.length === 0);
    }
  }, [cartItems, products]);

  const handleQuantityChange = (productId, size, value) => {
    const newQuantity = parseInt(value);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      updateQuantity(productId, size, newQuantity);
    }
  };

  const handleRemoveItem = (productId, size) => {
    removeFromCart(productId, size);
  };

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"MY"} text2={"CART"} />
      </div>

      {isCartEmpty ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate("/")}
            className="bg-black text-white text-sm px-8 py-3 hover:bg-gray-800 transition-colors"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartData.map((item, index) => (
              <div
                key={`${item._id}-${item.size}-${index}`}
                className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
              >
                <div className="flex items-start gap-6">
                  <img
                    className="w-16 sm:w-20 object-cover"
                    src={item.product.image[0]}
                    alt={item.product.name}
                  />
                  <div>
                    <p className="text-xs sm:text-lg font-medium">
                      {item.product.name}
                    </p>
                    <div className="flex items-center gap-5 mt-2">
                      <p>
                        {currency}
                        {item.product.price}
                      </p>
                      <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                        {item.size}
                      </p>
                    </div>
                  </div>
                </div>

                <input
                  type="number"
                  min={1}
                  max={item.product.stockLevel?.[item.size] || 99}
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item._id, item.size, e.target.value)}
                  className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                />

                <button
                  onClick={() => handleRemoveItem(item._id, item.size)}
                  className="flex items-center justify-center"
                >
                  <img
                    className="w-4 mr-4 sm:w-5 cursor-pointer"
                    src={assets.bin_icon}
                    alt="Remove"
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end my-20">
            <div className="w-full sm:w-[450px]">
              <CartTotal />
              <div className="w-full text-end">
                <button
                  onClick={() => navigate("/place-order")}
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