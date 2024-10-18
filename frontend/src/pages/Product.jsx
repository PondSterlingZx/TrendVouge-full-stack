import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { FaShare, FaFacebook, FaTwitter, FaPinterest, FaCheckCircle, FaHeart } from 'react-icons/fa';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, addToWishlist, removeFromWishlist, wishlistItems } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [size, setSize] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      console.log("Searching for product with ID:", productId);
      const product = products.find(item => item._id === productId);
      console.log("Found product:", product);
      if (product) {
        setProductData(product);
        setMainImage(product.image[0]);
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
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          {/* Main image */}
          <img src={mainImage} alt={productData.name} className="w-full h-auto object-cover" />
          
          {/* Thumbnail images */}
          <div className="flex sm:flex-col gap-2">
            {productData.image.map((img, index) => (
              <img 
                key={index} 
                src={img} 
                alt={`${productData.name} view ${index + 1}`} 
                className="w-16 h-16 object-cover cursor-pointer" 
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          
          {/* Size selection */}
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index) => (
                <button 
                  onClick={() => setSize(item)} 
                  className={`border py-2 px-4 ${item === size ? 'bg-black text-white' : 'bg-gray-100'}`} 
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Add to cart and wishlist buttons */}
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
          
          {/* Additional product details */}
          {/* ... */}
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  )
}

export default Product;