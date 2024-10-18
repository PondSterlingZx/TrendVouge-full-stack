// src/pages/WishlistPage.js

import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { FaTrash } from 'react-icons/fa';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, products, currency, addToCart } = useContext(ShopContext);
  const [wishlistProducts, setWishlistProducts] = useState([]);

  useEffect(() => {
    const filteredProducts = products.filter(product => wishlistItems.includes(product._id));
    setWishlistProducts(filteredProducts);
  }, [wishlistItems, products]);

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  const handleAddToCart = (productId) => {
    addToCart(productId);
    removeFromWishlist(productId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
      {wishlistProducts.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistProducts.map(product => (
            <div key={product._id} className="border rounded-lg p-4 flex flex-col">
              <Link to={`/product/${product._id}`}>
                <img src={product.image[0]} alt={product.name} className="w-full h-48 object-cover mb-4" />
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              </Link>
              <p className="text-gray-600 mb-2">{currency}{product.price}</p>
              <div className="mt-auto flex justify-between items-center">
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemoveFromWishlist(product._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
