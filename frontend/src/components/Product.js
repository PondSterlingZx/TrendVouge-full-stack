// src/components/Product.js

import React, { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { FaShare, FaFacebook, FaTwitter, FaPinterest, FaCheckCircle, FaHeart } from 'react-icons/fa';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, fetchProducts, wishlistItems, addToWishlist, removeFromWishlist } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [showLightbox, setShowLightbox] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    console.log("Products in context:", products);
    console.log("Product ID from params:", productId);
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      console.log("Searching for product with ID:", productId);
      const product = products.find(item => item._id === productId);
      console.log("Found product:", product);
      if (product) {
        setProductData(product);
        setImage(product.image[0]);
      } else {
        console.log("Product not found in the list");
      }
      setLoading(false);
    };

    fetchProductData();
  }, [productId, products]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!productData) {
    return <div className="text-center mt-10">Product not found. ID: {productId}</div>;
  }

  const handleAddToCart = () => {
    if (!size) {
      alert("Please select a size");
      return;
    }
    addToCart(productData._id, size);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  const handleWishlist = () => {
    if (wishlistItems.includes(productData._id)) {
      removeFromWishlist(productData._id);
    } else {
      addToWishlist(productData._id);
    }
  }

  return (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* ... existing code ... */}
      <div className="relative flex gap-4">
        <button 
          onClick={handleAddToCart} 
          className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'
        >
          ADD TO CART
        </button>
        <button 
          onClick={handleWishlist} 
          className={`border px-4 py-3 text-sm flex items-center ${wishlistItems.includes(productData._id) ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
        >
          <FaHeart className="mr-2" />
          {wishlistItems.includes(productData._id) ? 'In Wishlist' : 'Add to Wishlist'}
        </button>
        {addedToCart && (
          <div className="absolute top-0 left-full ml-4 bg-green-500 text-white px-4 py-2 rounded-md flex items-center">
            <FaCheckCircle className="mr-2" />
            Added to Cart!
          </div>
        )}
      </div>
      {/* ... rest of the existing code ... */}
    </div>
  )
}

export default Product
