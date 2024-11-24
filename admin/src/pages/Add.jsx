import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

// Component for adding new products with image upload, details, and inventory management
const Add = ({ token }) => {
  // State for managing multiple product images
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  // State for managing product details and specifications
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [stockLevel, setStockLevel] = useState({});
  const [loading, setLoading] = useState(false);
  const [productAdded, setProductAdded] = useState(false); // Track if product is added

  // Handler for updating stock levels for different sizes
  const handleStockChange = (size, value) => {
    setStockLevel((prev) => ({
      ...prev,
      [size]: parseInt(value) || 0,
    }));
  };

  // Handler for selecting sizes and initializing stock levels
  const handleSizeSelection = (size) => {
    setSizes((prevSizes) => {
      if (prevSizes.includes(size)) {
        // Remove size and delete corresponding stock level
        setStockLevel((prevStock) => {
          const updatedStock = { ...prevStock };
          delete updatedStock[size];
          return updatedStock;
        });
        return prevSizes.filter((item) => item !== size);
      } else {
        // Add size and set default stock level to 0 if not already set
        setStockLevel((prevStock) => ({
          ...prevStock,
          [size]: prevStock[size] || 0,
        }));
        return [...prevSizes, size];
      }
    });
  };

  // Form submission handler that sends product data to the backend
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Disable the button while submitting
    setLoading(true);

    // Validate inputs before submitting
    if (!image1 && !image2 && !image3 && !image4) {
      toast.error("At least one image must be uploaded.");
      setLoading(false); // Reset loading state
      return; // Stop further execution
    }

    if (!name) {
      toast.error("Please provide product name.");
      setLoading(false); // Reset loading state
      return; // Stop further execution
    }

    if (!description) {
      toast.error("Product description must be provided.");
      setLoading(false); // Reset loading state
      return; // Stop further execution
    }

    if (price < 25) {
      toast.error("Price must be at least 25. Please update the price.");
      setLoading(false); // Reset loading state
      return; // Stop further execution
    }

    // Check if sizes array is empty
    if (sizes.length === 0) {
      toast.error("Please select at least one size before submitting.");
      setLoading(false); // Reset loading state
      return; // Stop further execution
    }

    try {
      // Create FormData object to handle file uploads and product details
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("customize", customize);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("stockLevel", JSON.stringify(stockLevel));

      // Only append images if they exist
      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      // Send POST request to add product
      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      // Handle successful product addition
      if (response.data.success) {
        toast.success(response.data.message);
        setProductAdded(true); // Trigger page reload

        // Reset form fields after successful submission
        setName("");
        setDescription("");
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
        setPrice("");
        setSizes([]);
        setStockLevel({});

        // Optionally reset any other form data (like category, bestseller, etc.)
        setCategory("");
        setSubCategory("");
        setBestseller(false);
        setCustomize(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // Log the error
      console.error("Error during form submission:", error);
      toast.error("Error during form submission. Please try again.");
    } finally {
      // Always reset loading state, whether success or error
      setLoading(false);
    }
  };

  // Effect hook to reload the page after product is added
  useEffect(() => {
    if (productAdded) {
      window.location.reload(); // Reload the page to reflect the new product
    }
  }, [productAdded]); // Trigger effect when product is added

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      {/* Image upload section with preview functionality */}
      <div>
        <p className="mb-2">Upload Image</p>

        <div className="flex gap-2">
          <label htmlFor="image1">
            <img
              className="w-20"
              src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
              alt=""
            />
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              hidden
            />
          </label>
          <label htmlFor="image2">
            <img
              className="w-20"
              src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
              alt=""
            />
            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type="file"
              id="image2"
              hidden
            />
          </label>
          <label htmlFor="image3">
            <img
              className="w-20"
              src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
              alt=""
            />
            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type="file"
              id="image3"
              hidden
            />
          </label>
          <label htmlFor="image4">
            <img
              className="w-20"
              src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
              alt=""
            />
            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type="file"
              id="image4"
              hidden
            />
          </label>
        </div>
      </div>

      {/* Product name input field */}
      <div className="w-full">
        <p className="mb-2">Product name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
        />
      </div>

      {/* Product description textarea */}
      <div className="w-full">
        <p className="mb-2">Product description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Write content here"
        />
      </div>

      {/* Category, subcategory, and price selection section */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Sub category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="Number"
            placeholder="25"
          />
        </div>
      </div>

      {/* Size selection and stock level management section */}
      <div>
        <p className="mb-2">Product Sizes and Stock</p>
        <div className="flex flex-wrap gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <div onClick={() => handleSizeSelection(size)}>
                <p
                  className={`${
                    sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"
                  } px-3 py-1 cursor-pointer`}
                >
                  {size}
                </p>
              </div>
              {sizes.includes(size) && (
                <input
                  type="number"
                  min="0"
                  value={stockLevel[size] || 0}
                  onChange={(e) => handleStockChange(size, e.target.value)}
                  className="w-16 px-2 py-1 text-center border"
                  placeholder="Stock"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bestseller checkbox */}
      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>

      {/* Customize product checkbox */}
      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setCustomize((prev) => !prev)}
          checked={customize}
          type="checkbox"
          id="customize"
        />
        <label className="cursor-pointer" htmlFor="customize">
          Customize Product
        </label>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="w-28 py-3 mt-4 bg-black text-white"
        disabled={loading} // Disable button while loading
      >
        {loading ? "Loading..." : "ADD"}{" "}
        {/* Show Loading text when submitting */}
      </button>
    </form>
  );
};

export default Add;
