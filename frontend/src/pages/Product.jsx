import React, { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { FaShare, FaFacebook, FaTwitter, FaPinterest, FaCheckCircle } from 'react-icons/fa';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, fetchProducts } = useContext(ShopContext);
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
    setTimeout(() => setAddedToCart(false), 2000); // Remove the indicator after 2 seconds
  }

  return (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          {/* ... (image gallery code remains the same) ... */}
        </div>

        {/* Product Info */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            {[1, 2, 3, 4, 5].map((star) => (
              <img key={star} src={star <= 4 ? assets.star_icon : assets.star_dull_icon} alt="" className="w-3.5" />
            ))}
            <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
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
          <div className="relative">
            <button 
              onClick={handleAddToCart} 
              className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'
            >
              ADD TO CART
            </button>
            {addedToCart && (
              <div className="absolute top-0 left-full ml-4 bg-green-500 text-white px-4 py-2 rounded-md flex items-center">
                <FaCheckCircle className="mr-2" />
                Added to Cart!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description & Review Section */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>{productData.description}</p>
          {/* Add more detailed description here */}
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

      {/* Image Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={() => setShowLightbox(false)}>
          <img src={image} alt="" className="max-w-full max-h-full" />
        </div>
      )}
    </div>
  )
}

export default Product