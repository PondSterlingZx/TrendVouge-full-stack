import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Upload } from 'lucide-react';
import { toast } from 'react-toastify';

const ProductCustomize = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { products, currency, addToCart, user } = useContext(ShopContext);
  
  // Product and UI states
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Refs for drag functionality
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Load product data
  useEffect(() => {
    if (products && products.length > 0) {
      const foundProduct = products.find(p => p._id === id);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        toast.error("Product not found");
        navigate('/customize');
      }
    }
  }, [id, products, navigate]);

  // Handle add to cart action
  const handleActionClick = async () => {
    if (!user) {
      toast.info("Please sign in to continue");
      navigate('/login');
      return;
    }
    
    if (!selectedSize) {
      toast.warning("Please select a size");
      return;
    }
    
    if (!uploadedImage) {
      toast.warning("Please upload your design");
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToCart(product._id, selectedSize);
      toast.success("Added to cart successfully!");
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
      setPosition({ x: 0, y: 0 });
      setScale(1);
    };
    reader.readAsDataURL(file);
  };

  // Mouse event handlers for drag functionality
  const handleMouseDown = (e) => {
    if (uploadedImage && containerRef.current) {
      e.preventDefault();
      const rect = containerRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - position.x;
      const offsetY = e.clientY - rect.top - position.y;
      
      setIsDragging(true);
      setDragStart({ x: offsetX, y: offsetY });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && uploadedImage && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      
      // Get mouse position relative to container
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate boundaries based on container and image size
      const maxX = rect.width - (imageRef.current?.offsetWidth || 0) * scale;
      const maxY = rect.height - (imageRef.current?.offsetHeight || 0) * scale;

      // Calculate new position with boundaries
      const newX = Math.min(Math.max(0, mouseX - dragStart.x), maxX);
      const newY = Math.min(Math.max(0, mouseY - dragStart.y), maxY);

      setPosition({
        x: newX,
        y: newY
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add and remove event listeners for drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  if (!product) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="py-8">
      {/* Product Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium">{product.name}</h1>
        <p className="text-xl">{currency}{product.price}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Preview Area */}
        <div className="flex-1">
          <div className="relative bg-gray-100 rounded-lg aspect-square">
            {/* Product Base Image */}
            <img 
              src={product.image[0]} 
              alt={product.name}
              className="w-full h-full object-contain"
            />
            
            {/* Customizable Area */}
            <div 
              ref={containerRef}
              className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-dashed border-blue-400 overflow-hidden"
              onMouseDown={handleMouseDown}
              style={{ cursor: uploadedImage ? 'move' : 'default' }}
            >
              {uploadedImage && (
                <div 
                  className="relative w-full h-full"
                  style={{ pointerEvents: 'none' }}
                >
                  <img
                    ref={imageRef}
                    src={uploadedImage}
                    alt="Custom design"
                    className="absolute select-none"
                    style={{
                      transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                      maxWidth: '100%',
                      maxHeight: '100%',
                      cursor: 'move',
                      transformOrigin: '0 0',
                    }}
                    draggable="false"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="w-full md:w-80 space-y-6">
          {/* Customize Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Customize Your Design</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="designUpload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <label htmlFor="designUpload" className="cursor-pointer">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  {uploadedImage ? 'Change design' : 'Upload your design'}
                </span>
              </label>
            </div>
          </div>

          {/* Size Controls */}
          {uploadedImage && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Adjust Size</h3>
              <div className="flex border rounded-lg">
                <button 
                  onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
                  className="flex-1 py-2 text-lg border-r hover:bg-gray-50"
                >
                  -
                </button>
                <button 
                  onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
                  className="flex-1 py-2 text-lg hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Size Selection */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Select Size</h3>
            <div className="flex gap-2">
              {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`flex-1 py-2 border rounded ${
                    selectedSize === size 
                      ? 'bg-black text-white' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleActionClick}
            disabled={isAddingToCart}
            className="w-full py-3 bg-black text-white rounded hover:bg-gray-900 
                     disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {!user ? 'Sign In to Add to Cart' : 
             isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCustomize;