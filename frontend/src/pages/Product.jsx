import React, { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { FaShare, FaFacebook, FaTwitter, FaPinterest } from 'react-icons/fa';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [showLightbox, setShowLightbox] = useState(false);

  const fetchProductData = async () => {
    setLoading(true);
    const product = products.find(item => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProductData();
  }, [productId, products])

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!productData) {
    return <div className="text-center mt-10">Product not found</div>;
  }

  const handleAddToCart = () => {
    if (!size) {
      alert("Please select a size");
      return;
    }
    addToCart(productData._id, size);
  }

  return (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      
      

      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {productData.image.map((item, index) => (
              <img onClick={() => setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
            ))}
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto cursor-pointer' src={image} alt="" onClick={() => setShowLightbox(true)} />
          </div>
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
          <button onClick={handleAddToCart} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>
            ADD TO CART
          </button>
          
          {/* Share buttons */}
          <div className="flex items-center mt-4">
            <FaShare className="mr-2" />
            <FaFacebook className="mx-1 cursor-pointer" />
            <FaTwitter className="mx-1 cursor-pointer" />
            <FaPinterest className="mx-1 cursor-pointer" />
          </div>

          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
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