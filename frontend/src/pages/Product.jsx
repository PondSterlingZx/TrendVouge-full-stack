import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { FaShare, FaFacebook, FaTwitter, FaPinterest, FaCheckCircle, FaHeart } from 'react-icons/fa';

const Product = () => {
  const { productId } = useParams();
  const { 
    products, 
    currency, 
    addToCart, 
    fetchProducts, 
    wishlistItems, 
    addToWishlist, 
    removeFromWishlist,
    getWishlist  // Make sure this function is provided by your ShopContext
  } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('')
  const [size, setSize] = useState('')
  const [showLightbox, setShowLightbox] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlistError, setWishlistError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchProducts();
        await getWishlist(); // Fetch the latest wishlist
      } catch (error) {
        console.error("Error fetching data:", error);
        setWishlistError("Unable to fetch wishlist. Some features may be limited.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchProducts, getWishlist]);

  useEffect(() => {
    if (products.length > 0) {
      const product = products.find(item => item._id === productId);
      if (product) {
        setProductData(product);
        setMainImage(product.image[0]);
      }
    }
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

  const handleWishlist = async () => {
    try {
      if (wishlistItems.includes(productData._id)) {
        await removeFromWishlist(productData._id);
      } else {
        await addToWishlist(productData._id);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      setWishlistError("Unable to update wishlist. Please try again later.");
    }
  }

  return (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {wishlistError && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p>{wishlistError}</p>
        </div>
      )}
      
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          {/* Main image */}
          <img 
            src={mainImage} 
            alt={productData.name} 
            className="w-full h-auto cursor-pointer" 
            onClick={() => setShowLightbox(true)}
          />
          
          {/* Thumbnail images */}
          <div className="flex sm:flex-col gap-2">
            {productData.image.map((img, index) => (
              <img 
                key={index} 
                src={img} 
                alt={`${productData.name} view ${index + 1}`} 
                className={`w-16 h-16 object-cover cursor-pointer ${img === mainImage ? 'border-2 border-black' : ''}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          {/* ... other product info ... */}
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
              disabled={wishlistError !== null}
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
          
          {/* ... rest of the component ... */}
        </div>
      </div>

      {/* ... Description, Reviews, Related Products ... */}

      {/* Image Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={() => setShowLightbox(false)}>
          <img src={mainImage} alt="" className="max-w-full max-h-full" />
        </div>
      )}
    </div>
  )
}

export default Product