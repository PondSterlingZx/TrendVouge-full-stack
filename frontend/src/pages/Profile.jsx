import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import Title from "../components/Title";
import axios from "axios";

const Profile = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleSwipe = (direction) => {
    if (direction === "left" && currentCard < 2) {
      setCurrentCard(currentCard + 1);
    } else if (direction === "right" && currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    bio: "",
    profilePicture: "",
    gender: "",
    dateOfBirth: "",
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    // Check for nested fields (e.g., address fields)
    if (name.includes("address")) {
      const fieldName = name.split(".")[1]; // Extract "street", "city", etc.
      setUserData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [fieldName]: value, // Dynamically update the correct field
        },
      }));
    } else {
      setUserData((prevData) => ({
        ...prevData,
        [name]: value, // Update top-level fields
      }));
    }
    console.log(userData?.profilePicture); // Check the profilePicture state
  };

  // Fetch user data (outside useEffect)
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/profile/display`, {
        headers: { token },
      });
      setUserData(response.data.user);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch user data on component mount
  }, [token]); // Dependencies to ensure fresh data on token/backendUrl changes

  const handleEditClick = async (e) => {
    if (isEditing) {
      setIsEditing(!isEditing);
      // If in editing mode and save is clicked, call updateProfile
      await updateProfile(e);
    } else {
      // Toggle to edit mode
      setIsEditing(!isEditing);
    }
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    console.log(file); // Check if the file is being selected correctly
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log(reader.result); // Check if the FileReader is reading the file correctly
        setUserData((prevData) => ({
          ...prevData,
          profilePicture: reader.result, // Store the image data URL
        }));
      };
      reader.readAsDataURL(file); // Read the file as a base64 data URL
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `${backendUrl}/api/profile/update`,
        userData,
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error("An error occurred while updating your profile.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t pt-16">
      <div className="flex justify-between text-base sm:text-2xl mb-4">
        <Title text1={"MY"} text2={"PROFILE"} />
      </div>
      {/* Personal info */}
      {/* For sm screen only */}
      <div className="md:hidden">
        <div className="mt-8 max-w-[80%] mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex sm:flex-col">
            {/* Left Section: Profile Picture and Name Info */}
            <div
              className={`w-full sm:w-full p-4 flex flex-col items-center justify-center relative bg-black text-white ${
                currentCard === 0 ? "block" : "hidden"
              } `}
              style={{
                background:
                  "linear-gradient(to bottom right, #184e68, #5e2563)",
              }}
            >
              <div className="w-20 h-20 sm:w-20 sm:h-20  bg-white/80 rounded-full shadow-md mb-8 flex items-center justify-center">
                <img
                  src={userData?.profilePicture || assets.cat_profile}
                  alt="Profile"
                  className="object-cover w-full h-full rounded-full"
                />
              </div>

              <div className="text-center text-sm mb-4 flex flex-col items-center">
                <p className="text-left w-full">First Name</p>
                <input
                  type="text"
                  name="firstName"
                  value={userData?.firstName || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="border p-2 rounded text-center w-full mb-1 text-sm"
                />

                <p className="text-left w-full">Middle Name</p>
                <input
                  type="text"
                  name="middleName"
                  value={userData?.middleName || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="border p-2 rounded text-center w-full mb-1 text-sm"
                />

                <p className="text-left w-full">Last Name</p>
                <input
                  type="text"
                  name="lastName"
                  value={userData?.lastName || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="border p-2 rounded text-center w-full mb-1 text-sm"
                />
              </div>
            </div>

            {/* Middle Section: Username, Email, Bio, Date of Birth, and Gender */}
            <div
              className={`w-full sm:w-full  p-4 flex flex-col items-start ${
                currentCard === 1 ? "block" : "hidden"
              }`}
            >
              <div className="text-sm mb-4 w-full">
                <p className="font-semibold">Username</p>
                <input
                  type="text"
                  name="username"
                  value={userData?.username || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="border p-2 rounded text-sm w-full mb-1"
                />
              </div>
              <div className="text-sm mb-4 w-full">
                <p className="font-semibold">Email</p>
                <input
                  type="email"
                  name="email"
                  value={userData?.email || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="border p-2 rounded text-sm w-full mb-1"
                />
              </div>

              <div className="text-sm mb-4 w-full">
                <p className="font-semibold">Bio</p>
                <textarea
                  name="bio"
                  value={userData?.bio || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  rows="3"
                  className="border p-2 rounded text-sm w-full mb-1"
                />
              </div>
              <div className="text-sm mb-4 w-full">
                <p className="font-semibold">Date of Birth</p>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={userData?.dateOfBirth || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="border p-2 rounded text-sm w-full mb-1"
                />
              </div>

              <div className="text-sm mb-4 w-full">
                <p className="font-semibold">Gender</p>
                <select
                  name="gender"
                  value={userData?.gender || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="border p-2 rounded text-sm w-full mb-1"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Right Section: Address and Phone */}
            <div
              className={`w-full sm:w-full p-4 flex flex-col items-start ${
                currentCard === 2 ? "block" : "hidden"
              }`}
            >
              <div className="text-sm mb-4 w-full">
                <p className="font-semibold">Address</p>
                <input
                  type="text"
                  name="address.street"
                  value={userData?.address.street || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="border p-2 rounded text-sm w-full mb-1"
                  placeholder="Street"
                />
                <input
                  type="text"
                  name="address.city"
                  value={userData?.address.city || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="border p-2 rounded text-sm w-full mb-1"
                  placeholder="City"
                />
                <input
                  type="text"
                  name="address.state"
                  value={userData?.address.state || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="border p-2 rounded text-sm w-full mb-1"
                  placeholder="State"
                />
                <input
                  type="text"
                  name="address.postalCode"
                  value={userData?.address.postalCode || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="border p-2 rounded text-sm w-full mb-1"
                  placeholder="Postal Code"
                />
                <input
                  type="text"
                  name="address.country"
                  value={userData?.address.country || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="border p-2 rounded text-sm w-full mb-1"
                  placeholder="Country"
                />
              </div>

              <div className="text-sm w-full">
                <p className="font-semibold">Phone</p>
                <input
                  type="text"
                  name="phone"
                  value={userData?.phone || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="border p-2 rounded text-sm w-full mb-1"
                />
              </div>
            </div>
          </div>

          {/* Navigation Buttons Positioned Outside */}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10">
            <button onClick={() => handleSwipe("right")} className="py-2 px-4">
              <img src={assets.left_arrow} alt="Previous" className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10">
            <button onClick={() => handleSwipe("left")} className="py-2 px-4">
              <img src={assets.right_arrow} alt="Next" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      ;
      {/* For medium (md) and large (lg) screens, use the regular layout without the swipe buttons */}
      <div className="md:flex hidden sm:hidden">
        <div className="mt-8 max-w-[80%] mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex">
            {/* Left Side: Profile Picture and Name Info */}
            <div
              className="w-1/3 p-4 flex flex-col items-center justify-center relative bg-black text-white"
              style={{
                background:
                  "linear-gradient(to bottom right, #184e68, #5e2563)",
              }}
            >
              <div className="w-20 h-20 sm:w-20 sm:h-20 bg-white/80 rounded-full shadow-md mb-8 flex items-center justify-center">
                {/* Clickable image that triggers file input */}
                {isEditing ? (
                  <>
                    <input
                      type="file"
                      id="profilePictureInput"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <img
                      src={userData?.profilePicture || assets.cat_profile}
                      alt="Profile"
                      className="object-cover w-full h-full rounded-full"
                      onClick={() =>
                        document.getElementById("profilePictureInput").click()
                      }
                    />
                  </>
                ) : (
                  <img
                    src={userData?.profilePicture || assets.cat_profile}
                    alt="Profile"
                    className="object-cover w-full h-full rounded-full"
                  />
                )}
              </div>

              <div className="text-center text-sm mb-4 flex flex-col items-center">
                <p className="text-left w-full">First Name</p>
                <input
                  type="text"
                  name="firstName"
                  value={userData?.firstName || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className={`border p-2 rounded text-center w-full mb-1 text-sm ${
                    isEditing ? "text-black" : "text-white"
                  }`}
                />

                <p className="text-left w-full">Middle Name</p>
                <input
                  type="text"
                  name="middleName"
                  value={userData?.middleName || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className={`border p-2 rounded text-center w-full mb-1 text-sm ${
                    isEditing ? "text-black" : "text-white"
                  }`}
                />

                <p className="text-left w-full">Last Name</p>
                <input
                  type="text"
                  name="lastName"
                  value={userData?.lastName || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className={`border p-2 rounded text-center w-full mb-1 text-sm ${
                    isEditing ? "text-black" : "text-white"
                  }`}
                />
              </div>
            </div>

            {/* Middle Section: Username, Email, Bio, Date of Birth, and Gender */}
            <div className="w-1/3 p-4 flex flex-col items-start">
              {/* Top Section: Username and Email */}
              <div className="text-sm mb-4 w-full">
                <p className="font-semibold">Username</p>
                <input
                  type="text"
                  name="username"
                  value={userData?.username || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="border p-2 rounded text-sm w-full mb-1"
                />
              </div>
              <div className="text-sm mb-4 w-full">
                <p className="font-semibold">Email</p>
                <input
                  type="email"
                  name="email"
                  value={userData?.email || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="border p-2 rounded text-sm w-full mb-1"
                />
              </div>

              {/* Middle Section: Bio, Date of Birth, and Gender */}
              <div className="text-sm mb-4 w-full">
                <p className="font-semibold">Bio</p>
                <textarea
                  name="bio"
                  value={userData?.bio || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  rows="3"
                  className="border p-2 rounded text-sm w-full mb-1"
                />
              </div>
              <div className="text-sm mb-4 w-full">
                <p className="font-semibold">Date of Birth</p>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={
                    userData?.dateOfBirth
                      ? new Date(userData.dateOfBirth)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    const selectedDate = e.target.value
                      ? new Date(e.target.value)
                      : null;
                    setUserData((prevData) => ({
                      ...prevData,
                      dateOfBirth: selectedDate,
                    }));
                  }}
                  disabled={!isEditing}
                  max={new Date().toISOString().split("T")[0]} // Restrict future dates
                  className="border p-2 rounded text-sm w-full mb-1"
                />
              </div>

              <div className="text-sm mb-4 w-full">
                <p className="font-semibold">Gender</p>
                <select
                  name="gender"
                  value={userData?.gender || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="border p-2 rounded text-sm w-full mb-1"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Right Side: Address and Phone */}
            <div className="w-1/3 p-4 flex flex-col items-start">
              <div className="text-sm mb-4 w-full">
                <p className="font-semibold">Address</p>
                <input
                  type="text"
                  name="address.street"
                  value={userData?.address.street || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="border p-2 rounded text-sm w-full mb-1"
                  placeholder="Street"
                />
                <input
                  type="text"
                  name="address.city"
                  value={userData?.address.city || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="border p-2 rounded text-sm w-full mb-1"
                  placeholder="City"
                />
                <input
                  type="text"
                  name="address.state"
                  value={userData?.address.state || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="border p-2 rounded text-sm w-full mb-1"
                  placeholder="State"
                />
                <input
                  type="text"
                  name="address.postalCode"
                  value={userData?.address.postalCode || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="border p-2 rounded text-sm w-full mb-1"
                  placeholder="Postal Code"
                />
                <input
                  type="text"
                  name="address.country"
                  value={userData?.address.country || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="border p-2 rounded text-sm w-full mb-1"
                  placeholder="Country"
                />
              </div>

              <div className="text-sm w-full">
                <p className="font-semibold">Phone</p>
                <input
                  type="text"
                  name="phone"
                  value={userData?.phone || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="border p-2 rounded text-sm w-full mb-1"
                />
              </div>
              {/* Edit Button */}
              <div className="text-center mt-4">
                <button
                  onClick={handleEditClick}
                  className="bg-black text-white py-2 px-4 rounded"
                >
                  {isEditing ? "Save" : "Edit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;