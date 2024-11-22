import React, { useContext, useEffect, useState } from 'react'
import { useParams , useNavigate} from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import SizeQuizModal from '../components/size-recommendation/SizeQuizModal.jsx';
import SizeChartButton from "../components/SizeChartButton";
import { toast } from "react-toastify";
import axios from "axios";
import { log } from 'three/webgpu';

const Product = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { 
    backendUrl, 
    token, 
    products, 
    currency, 
    addToCart,
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    getWishlist 
  } = useContext(ShopContext);
  
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [showSizeQuiz, setShowSizeQuiz] = useState(false);
  const [recommendedSize, setRecommendedSize] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [activeSection, setActiveSection] = useState("description");
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewUpdated, setReviewUpdated] = useState(false);
  const [showOptionsForReviewId, setShowOptionsForReviewId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Fetch the userId based on the token
  const fetchUserId = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/getId`,
        {},
        { headers: { token } }
      );
      setUserId(response.data.userId); // Use the userId
      
    } catch (error) {
      console.error("Error fetching user ID:", error);
      toast.error("Unable to fetch user data.");
      console.log("user id: ",userId)
    }
  };

   // Handle Add to Cart action
   const handleAddToCart = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!size) {
      toast.warning("Please select a size first");
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToCart(productData._id, size);
      toast.success("Added to cart successfully!");
    } catch (error) {
      toast.error("Failed to add to cart. Please try again.");
      console.error("Add to cart error:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    try {
      // Check if the product is already in the wishlist
      if (wishlistItems.includes(productId)) {
        // If the product is already in the wishlist, remove it
        await removeFromWishlist(productId); // Remove the product from the wishlist
      } else {
        await addToWishlist(productId); // Add the product to the wishlist
      }
    } catch (error) {
      // If an error occurs while adding/removing the product from the wishlist, show an error message
      console.error("Error updating wishlist:", error); // Log the error to the console
      toast.error("Unable to update wishlist. Please try again later."); // Show error message
    }
  };

  const fetchProductData = async () => {
    const item = products.find(item => item._id === productId);
    if (item) {
      setProductData(item);
      setImage(item.image[0]);
    }
  }

  // Calculate average rating for the reviews
  const calculateAverageRating = (productReviews) => {
    if (productReviews.length > 0) {
      const totalRating = productReviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const avgRating = totalRating / productReviews.length;
      setAverageRating(Math.round(avgRating)); // Round to nearest integer for star display
    } else {
      setAverageRating(0); // If no reviews, set rating to 0
    }
  };

  // Handle section selection (Description or Reviews)
  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  useEffect(() => {
    fetchProductData();
    fetchProductReviews();
    fetchUserId();
    getWishlist();
  }, [productId, products, token]);

  useEffect(() => {
    fetchProductReviews();
  }, [reviewUpdated]);

  useEffect(() => {
    fetchProductReviews();
  }, [token]);

  // Handle size selection
  const handleSizeSelect = (selectedSize) => {
    setSize(selectedSize);
    if (selectedSize !== recommendedSize) {
      setRecommendedSize(null); // Clear recommended size if user selects a different size
    }
    // toast.success(`Size ${selectedSize} selected`);
  };

  // Get button text based on state
  const getButtonText = () => {
    if (!token) return "SIGN IN TO SHOP";
    if (isAddingToCart) return "ADDING...";
    if (!size) return "SELECT A SIZE";
    return "ADD TO CART";
  };

  // Get button state
  const isButtonDisabled = () => {
    return isAddingToCart || (!token || !size);
  };

  // Submit a new review
  const handleReviewSubmit = async () => {
    if (!token) {
      toast.error("Please log in to submit a review.");
      return;
    }

    if (!newReview.rating || !newReview.comment.trim()) {
      toast.error("Please provide both rating and comment.");
      return;
    }

    if (!productId || typeof productId !== "string") {
      toast.error("Invalid product ID.");
      return;
    }

    const newReviewData = {
      productId,
      rating: newReview.rating,
      comment: newReview.comment.trim(),
    };

    try {
      const response = await axios.post(
        `${backendUrl}/api/review/add`,
        newReviewData,
        { headers: { token } }
      );

      if (response.data.success) {
        setReviews((prevReviews) => {
          const updatedReviews = [...prevReviews, response.data.review];
          return updatedReviews;
        });
        setNewReview({ rating: 0, comment: "" });
        setReviewUpdated((prev) => !prev);
        toast.success("Review added successfully.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("An error occurred while submitting your review.");
    }
  };

  const handleReviewDelete = async (reviewId) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/review/remove/${reviewId}`,
        { headers: { token } }
      );

      if (response.data.success) {
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review._id !== reviewId)
        );
        toast.success("Review deleted successfully.");
      } else {
        toast.error("Failed to delete review.");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("An error occurred while deleting your review.");
    }
  };

  // Handle dropdown click to show review options
  const handleMoreOptionsClick = (reviewId) => {
    setShowOptionsForReviewId((prevId) =>
      prevId === reviewId ? null : reviewId
    );
  };

  // Fetch the reviews for a product
  const fetchProductReviews = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/review/list`,
        { productId },
        { headers: { token } }
      );

      if (response.data.success) {
        const reviews = response.data.reviews || []; // Default to an empty array if no reviews
        if (reviews.length > 0) {
          const sanitizedReviews = reviews.map((review) => ({
            ...review,
            user: review.user || { _id: null, name: "Anonymous" }, // Fallback user object
          }));
          setReviews(sanitizedReviews);
          calculateAverageRating(sanitizedReviews);
        } else {
          setReviews([]); // Clear reviews for a clean empty state
          calculateAverageRating([]); // Handle no reviews in the average rating
        }
      } else {
        //toast.info("No reviews found for this product."); // Informative message for no reviews
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Error fetching reviews.");
    }
  };

  // Loading state
  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {productData.image.map((item, index) => (
              <img 
                onClick={() => setImage(item)} 
                src={item} 
                key={index} 
                className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' 
                alt="" 
              />
            ))}
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>

        {/* Product Info */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          
          {/* Rating Display */}
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, index) => (
              <img
                key={index}
                src={
                  index < averageRating
                    ? assets.star_icon
                    : assets.star_dull_icon
                }
                alt=""
                className="w-3.5"
              />
            ))}
            <p className="pl-2">({reviews.length} Reviews)</p>
          </div>

          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>

          {/* Size Selection */}
      <div className='flex flex-col gap-4 my-8'>
        <div className="flex justify-between items-center">
          <p className="font-medium">Select Size</p>
          <div className="flex items-center gap-4">
            <SizeChartButton />
            {token && (
              <button 
                onClick={() => setShowSizeQuiz(true)}
                className="text-blue-600 text-sm hover:underline flex items-center gap-1"
              >
                <span>Not sure? Find your size</span>
              </button>
            )}
          </div>
        </div>

        <div className='flex flex-wrap gap-2'>
          {productData.sizes.map((item) => (
            <button 
              key={item}
              onClick={() => handleSizeSelect(item)} 
              className={`
                relative px-4 py-2 border rounded-lg transition-all
                ${item === size ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}
                ${item === recommendedSize ? 'ring-2 ring-blue-500' : ''}
                ${!token ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
              disabled={!token}
            >
              {item}
              {item === recommendedSize && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full text-[10px]">
                  Recommended
                </span>
              )}
            </button>
          ))}
        </div>
        {!token && (
          <p className="text-sm text-gray-500 italic">
            Please sign in to select a size
          </p>
        )}
      </div>

          <div className="flex space-x-4">
            <button
              onClick={() => {
                if (!token) {
                  navigate("/login"); // Redirect to login page
                } else {
                  addToCart(productData._id, size);
                }
              }}
              className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
            >
              {token ? "ADD TO CART" : "SIGN IN"}
            </button>

            {token && ( // Only show the wishlist button if the user is logged in
              <button
                onClick={handleWishlist}
                className={`border px-4 py-3 text-sm flex items-center ${
                  wishlistItems.includes(productId)
                    ? "bg-red-500 text-white"
                    : "bg-white text-black"
                }`}
              >
                <img
                  src={assets.wish_list}
                  alt="Wishlist Icon"
                  className="mr-2"
                  style={{
                    width: "20px", // Adjust the width as needed
                    height: "20px", // Adjust the height similarly
                  }}
                />
                {wishlistItems.includes(productId)
                  ? "In Wishlist"
                  : "Add to Wishlist"}
              </button>
            )}
          </div>

          {/*Size Quiz Modal */}
          {showSizeQuiz && (
            <SizeQuizModal
              productData={{
                name: productData.name,
                category: productData.category,
                image: image,
                sizes: productData.sizes
              }}
              onClose={() => setShowSizeQuiz(false)}
              onSizeSelected={handleSizeSelect}
            />
          )}

          

          {/* Additional Product Info */}
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 space-y-1'>
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* ---------- Description & Review Section ------------- */}
      <div className="mt-20">
        <div className="flex">
          {/* Description Tab */}
          <p
            onClick={() => handleSectionClick("description")}
            className={`border px-5 py-3 text-sm cursor-pointer ${
              activeSection === "description" ? "font-bold" : ""
            }`}
          >
            Description
          </p>
          {/* Reviews Tab */}
          <p
            onClick={() => handleSectionClick("reviews")}
            className={`border px-5 py-3 text-sm cursor-pointer ${
              activeSection === "reviews" ? "font-bold" : ""
            }`}
          >
            Reviews ({reviews.length})
          </p>
        </div>

        {/* Display the selected section */}
        {activeSection === "description" ? (
          <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
            <p>{productData.description}</p>
          </div>
        ) : (
          <div className="mt-8">
            {reviews.length > 0 ? (
              <>
                {/* Display reviews */}
                {reviews
                  .slice(0, showAllReviews ? reviews.length : 3)
                  .map((review, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-4 border-b pb-4"
                    >
                      <div className="flex items-center gap-1 relative">
                        <span className="text-yellow-500">
                          {"★".repeat(review.rating)}
                        </span>
                        <p className="pl-2">
                          {review.user?.name || "Anonymous"}
                          <span className="text-gray-500 text-sm">
                            (
                            {review.create
                              ? new Date(review.create).toLocaleString()
                              : "Unknown"}
                            )
                          </span>
                        </p>
                        {/* More Icon */}
                        {review.user &&
                          review.user._id &&
                          userId === review.user._id && (
                            <img
                              src={assets.more_horizon}
                              alt="More options"
                              className="w-6 h-6 cursor-pointer ml-auto"
                              onClick={() => handleMoreOptionsClick(review._id)}
                            />
                          )}
                        {/* Delete options dropdown */}
                        {showOptionsForReviewId === review._id && (
                          <div className="absolute top-full right-0 mt-2 bg-white shadow-md rounded-md p-2 z-10">
                            {/* Delete Button */}
                            <button
                              onClick={() => handleReviewDelete(review._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>

                      <p>{review.comment}</p>
                    </div>
                  ))}

                {/* Maximum Display Default = 3 */}
                {reviews.length > 3 && (
                  <button
                    onClick={() => setShowAllReviews((prev) => !prev)}
                    className="block text-gray-500 underline hover:text-gray-800 cursor-pointer mt-4"
                  >
                    {showAllReviews ? "Show Less" : "View All Reviews"}
                  </button>
                )}
              </>
            ) : (
              <p className="mt-4 text-gray-500">
                No reviews yet for this product.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Write a review section */}
      <div className="mt-8 flex justify-between items-center">
        <h3 className="text-xl font-bold">Write a Review</h3>
        <div className="flex gap-4"></div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        {/* Rating */}
        <label htmlFor="rating">Rating:</label>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, index) => (
            <img
              key={index}
              src={
                index < newReview.rating
                  ? assets.star_icon // Filled star
                  : assets.star_dull_icon // Empty star
              }
              alt={`${index + 1} Star`}
              className="w-6 cursor-pointer"
              onClick={() => {
                // Reset rating if clicked on already selected star
                if (index + 1 === newReview.rating) {
                  setNewReview({ ...newReview, rating: 0 }); // Reset to 0 if same star clicked
                } else {
                  setNewReview({ ...newReview, rating: index + 1 }); // Set rating to the clicked star
                }
              }}
            />
          ))}
        </div>

        {/* Comment */}
        <label htmlFor="comment">Comment:</label>
        <textarea
          id="comment"
          value={newReview.comment}
          onChange={(e) =>
            setNewReview({ ...newReview, comment: e.target.value })
          }
          rows="3"
          className="border p-2"
          placeholder="Write your review here..."
        ></textarea>

        {/* Button Row: Submit and Clear */}
        <div className="flex gap-2 mt-4">
          {/* Submit Review Button */}
          <button
            onClick={handleReviewSubmit}
            className="bg-black text-white px-6 py-2 flex-1"
          >
            Submit Review
          </button>

          {/* Clear Button */}
          <button
            onClick={() => setNewReview({ rating: 0, comment: "" })}
            className="bg-gray-200 text-black px-6 py-2 flex-none"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts 
        category={productData.category} 
        subCategory={productData.subCategory} 
      />
    </div>
  );
}

export default Product;