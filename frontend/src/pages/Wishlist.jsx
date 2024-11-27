import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, products, currency, addToCart } =
    useContext(ShopContext);
  const [wishlistProducts, setWishlistProducts] = useState([]);

  useEffect(() => {
    const filteredProducts = products.filter((product) =>
      wishlistItems.includes(product._id)
    );
    setWishlistProducts(filteredProducts);
  }, [wishlistItems, products]);

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  // const handleAddToCart = (productId, size) => {
  //   addToCart(productId, size);
  // };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between text-base sm:text-2xl mb-4">
        <Title text1={"MY"} text2={"WISHLIST"} />
      </div>

      {wishlistProducts.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {wishlistProducts.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg overflow-hidden flex flex-col h-full relative group"
            >
              <Link to={`/product/${product._id}`} className="flex-grow">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <p className="text-gray-600">
                    {currency}
                    {product.price}
                  </p>
                </div>
              </Link>
              <div className="p-4 border-t mt-auto">
                <div className="flex justify-end">
                  <button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
