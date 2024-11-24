import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Profile = () => {
  const { user, wishlistItems, products, currency, removeFromWishlist } =
    useContext(ShopContext);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });
  const [wishlistProducts, setWishlistProducts] = useState([]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  useEffect(() => {
    const filteredProducts = products.filter((product) =>
      wishlistItems.includes(product._id)
    );
    setWishlistProducts(filteredProducts);
  }, [wishlistItems, products]);

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      {/* Profile Info */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">User Information</h2>
        <p>
          <strong>Name:</strong> {profileData.name}
        </p>
        <p>
          <strong>Email:</strong> {profileData.email}
        </p>
      </div>

      {/* Wishlist Section */}
      <h2 className="text-2xl font-semibold mb-4">My Wishlist</h2>
      {wishlistProducts.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistProducts.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg overflow-hidden flex flex-col h-full relative group"
            >
              <Link to={`/product/${product._id}`} className="flex-grow">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <p className="text-gray-600">
                    {currency}
                    {product.price}
                  </p>
                </div>
              </Link>
              <div className="p-4 border-t mt-auto">
                <div className="flex justify-end">
                  <button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
