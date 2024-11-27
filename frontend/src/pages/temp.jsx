{
  /* For sm screen only */
}
<div className="">
  <div className="mt-8 max-w-[80%] mx-auto bg-white rounded-xl shadow-md overflow-hidden">
    <div className="flex sm:flex-col">
      {/* Left Section: Profile Picture and Name Info */}
      <div
        className={`w-full sm:w-full p-4 flex flex-col items-center justify-center relative bg-black text-white ${
          currentCard === 0 ? "block" : "hidden"
        } `}
        style={{
          background: "linear-gradient(to bottom right, #184e68, #5e2563)",
        }}
      >
        <div className="w-20 h-20 sm:w-20 sm:h-20  bg-white/80 rounded-full shadow-md mb-8 flex items-center justify-center">
          <img
            src={userData?.profilePicture || assets.profile_icon}
            alt="Profile"
            className="object-cover"
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
</div>;
