import React, { useState, useRef, useEffect } from 'react';

const ProductCustomizer = ({ productImage }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const customizableAreaRef = useRef(null);
  const uploadedImageRef = useRef(null);

  const bounds = {
    x1: 100,
    x2: 300,
    y1: 100,
    y2: 400
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setPosition({ x: 0, y: 0 });
        setScale(1);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e) => {
    if (uploadedImage) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && uploadedImage) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      const constrainedX = Math.max(bounds.x1, Math.min(bounds.x2, newX));
      const constrainedY = Math.max(bounds.y1, Math.min(bounds.y2, newY));
      
      setPosition({
        x: constrainedX,
        y: constrainedY
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleScale = (direction) => {
    setScale(prev => {
      const newScale = direction === 'up' ? prev + 0.1 : prev - 0.1;
      return Math.max(0.5, Math.min(2, newScale));
    });
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mx-auto">
      {/* Product Preview Area */}
      <div className="flex-1 p-4 border rounded-lg shadow-sm bg-white">
        <div 
          className="relative w-full h-[600px] bg-gray-100 rounded-lg"
          ref={customizableAreaRef}
        >
          {/* Product Base Image */}
          <img 
            src={productImage} 
            alt="Product" 
            className="w-full h-full object-contain"
          />
          
          {/* Customizable Area Overlay */}
          <div 
            className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-dashed border-blue-400 bg-blue-50 bg-opacity-20"
            onMouseDown={handleMouseDown}
          >
            {uploadedImage && (
              <img
                ref={uploadedImageRef}
                src={uploadedImage}
                alt="Custom design"
                className="absolute cursor-move"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  maxWidth: '100%',
                  maxHeight: '100%',
                }}
                draggable="false"
              />
            )}
          </div>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="w-full md:w-72 p-4 border rounded-lg shadow-sm bg-white space-y-4">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Customize Your Design</h3>
          
          {/* Upload Button */}
          <div className="space-y-2">
            <label 
              className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
            >
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <div className="text-center space-y-2">
                <svg 
                  className="mx-auto h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" 
                  />
                </svg>
                <span className="text-sm text-gray-500">Upload your design</span>
              </div>
            </label>
          </div>

          {/* Scale Controls */}
          {uploadedImage && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Adjust Size</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleScale('down')}
                  className="flex-1 py-2 px-4 border rounded hover:bg-gray-50"
                >
                  -
                </button>
                <button 
                  onClick={() => handleScale('up')}
                  className="flex-1 py-2 px-4 border rounded hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCustomizer;