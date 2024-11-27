import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { Upload } from "lucide-react";
import { toast } from "react-toastify";

const ProductCustomize = () => {
  const { id } = useParams();
  const { products, currency, navigate, token } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (products && products.length > 0) {
      const foundProduct = products.find((p) => p._id === id);
      if (foundProduct) {
        setProduct(foundProduct);
      }
    }
  }, [id, products]);

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
        y: newY,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTrialFeature = () => {
    if (!token) {
      navigate("/login"); // Navigate to the login page if no token
    } else {
      toast.success("Thanks for letting us know!"); // Provide success feedback
      //console.log("Feature accessible for logged-in users!");
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Product Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium">{product.name}</h1>
        <p className="text-xl">
          {currency}
          {product.price}
        </p>
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
              style={{ cursor: uploadedImage ? "move" : "default" }}
            >
              {uploadedImage && (
                <div
                  className="relative w-full h-full"
                  style={{ pointerEvents: "none" }}
                >
                  <img
                    ref={imageRef}
                    src={uploadedImage}
                    alt="Custom design"
                    className="absolute select-none"
                    style={{
                      transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                      maxWidth: "100%",
                      maxHeight: "100%",
                      cursor: "move",
                      transformOrigin: "0 0",
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
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                token
                  ? "border-gray-300"
                  : "border-gray-200 bg-gray-100 cursor-not-allowed"
              }`}
            >
              {token ? (
                <>
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
                      Upload your design
                    </span>
                  </label>
                </>
              ) : (
                <div className="text-sm text-gray-400">
                  Sign in to upload your design
                </div>
              )}
            </div>
          </div>

          {/* Size Controls */}
          {uploadedImage && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Adjust Size</h3>
              <div className="flex border rounded-lg">
                <button
                  onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
                  className="flex-1 py-2 text-lg border-r hover:bg-gray-50"
                >
                  -
                </button>
                <button
                  onClick={() => setScale((prev) => Math.min(2, prev + 0.1))}
                  className="flex-1 py-2 text-lg hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Button */}
          <button
            onClick={handleTrialFeature}
            className="w-full py-3 bg-black text-white rounded hover:bg-gray-900"
          >
            {!token ? "Sign In to try this feature." : "I want this feature!"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCustomize;
