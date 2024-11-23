import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const Restock = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [updatedStock, setUpdatedStock] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch products list
  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products.reverse()); // Reversing to show the latest first
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Handle changes in stock input
  const handleStockChange = (productId, size, value) => {
    setUpdatedStock((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [size]: value, // size corresponds to one of the sizes in the 'sizes' array
      },
    }));
  };

  // Handle restock submission for all products
  const handleRestockSubmit = async () => {
    try {
      setLoading(true);

      // Prepare restock data for each product that has changes in stock
      const restockData = products
        .filter((product) => updatedStock[product._id]) // Filter products that have changes
        .map((product) => {
          // Map through the sizes of the updated stock for the product
          return Object.keys(updatedStock[product._id] || {}).map((size) => {
            const stockAmount = updatedStock[product._id][size] || 0;

            return {
              productId: product._id,
              size,
              stockAmount,
            };
          });
        })
        .flat(); // Flatten the array to have a single array of restock items

      // Log the prepared restock data
      console.log("Restock Data: ", restockData);

      // If no products were updated, exit early
      if (restockData.length === 0) {
        toast.error("No stock changes detected.");
        setLoading(false);
        return;
      }

      // Send restock data to the backend
      const response = await axios.post(
        `${backendUrl}/api/product/updateStockLevel`,
        { restockData },
        { headers: { token } }
      );

      // Log the response from the server
      console.log("Server Response: ", response);

      if (response.data.success) {
        toast.success("Stock updated successfully!");

        // Reset the updatedStock to zero after successful submission
        const resetStock = {};
        products.forEach((product) => {
          resetStock[product._id] = {};
          product.sizes.forEach((size) => {
            resetStock[product._id][size] = 0; // Set all sizes to 0
          });
        });

        setUpdatedStock(resetStock); // Update the state to reset inputs to 0
      } else {
        toast.error("Failed to update stock.");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Error updating stock.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">Restock Products</p>
      <div className="flex flex-col gap-2">
        {/* ------- List Table Title ---------- */}
        <div className="hidden md:grid grid-cols-[1fr_1fr_3fr_0.5fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>ReStock</b>
          <b className="text-center">Action</b>
        </div>

        {/* ------ Product List ------ */}
        {products.map((item) => (
          <div
            className="grid grid-cols-[1fr_1fr_3fr_0.5fr] md:grid-cols-[1fr_1fr_3fr_0.5fr] items-center gap-2 py-1 px-2 border text-sm"
            key={item._id}
          >
            {/* Image Column */}
            <img className="w-12" src={item.image[0]} alt="" />

            {/* Name Column */}
            <p>{item.name}</p>

            {/* ReStock Column */}
            <div className="flex gap-2">
              {item.sizes.map((size) => (
                <div key={size} className="flex items-center gap-2">
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                    {size}:
                  </span>
                  <input
                    type="number"
                    value={updatedStock[item._id]?.[size] || 0} // Default to 0 if no stock value
                    min="0"
                    onChange={(e) =>
                      handleStockChange(item._id, size, e.target.value)
                    }
                    className="w-14 p-1 border rounded text-xs"
                  />
                </div>
              ))}
            </div>

            {/* Action Column - Hidden on small screens */}
            <p
              onClick={handleRestockSubmit}
              className="text-right md:text-center cursor-pointer text-lg mt-2 md:mt-0 hidden sm:block"
            >
              Update
            </p>

            {/* Show Action Button on smaller screens */}
            <p
              onClick={handleRestockSubmit}
              className="text-right cursor-pointer text-lg mt-2 md:mt-0 sm:hidden block"
            >
              Update
            </p>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="mt-4">
        <button
          onClick={handleRestockSubmit}
          className="bg-black text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update All Stock"}
        </button>
      </div>
    </>
  );
};

export default Restock;
