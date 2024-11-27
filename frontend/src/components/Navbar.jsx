import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  const handleIconClick = () => {
    if (!token) {
      navigate("/login");
    } else {
      setIsDropdownOpen((prev) => !prev); // Toggle the dropdown visibility
    }
  };

  return (
    <div className="relative">
      {/* Navbar Container */}
      <div className="flex items-center justify-between py-5 px-4 font-medium">
        <Link to="/">
          <img src={assets.logo} className="w-36" alt="Logo" />
        </Link>

        {/* Desktop Links */}
        <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
          <NavLink to="/" className="hover:text-gray-900">
            HOME
          </NavLink>
          <NavLink to="/collection" className="hover:text-gray-900">
            COLLECTIONS
          </NavLink>
          <NavLink to="/customize" className="hover:text-gray-900">
            CUSTOMIZE
            <span className="text-[10px] text-white bg-black rounded px-1 ml-1">
              trial
            </span>
          </NavLink>

          <NavLink to="/matching" className="hover:text-gray-900">
            MIX & MATCH
          </NavLink>
        </ul>

        {/* Right Side (Search, Profile, Cart, Menu Icon) */}
        <div className="flex items-center gap-4">
          <img
            onClick={() => {
              setShowSearch(true);
              navigate("/collection");
            }}
            src={assets.search_icon}
            className="w-5 cursor-pointer"
            alt="Search"
          />
          {token && (
            <img
              onClick={() => {
                setShowSearch(true);
                navigate("/wishlist");
              }}
              src={assets.wish_list}
              className="w-5 cursor-pointer"
              alt="Wishlist"
            />
          )}

          <div className="relative group">
            <img
              onClick={handleIconClick}
              className="w-5 min-w-5 cursor-pointer"
              src={assets.profile_icon}
              alt="Profile"
            />

            {/* Profile Dropdown */}
            {token && isDropdownOpen && (
              <div className="absolute right-0 top-8 bg-white shadow-md rounded p-4 w-39">
                <p
                  onClick={() => {
                    navigate("/profile");
                    setIsDropdownOpen(false); // Close dropdown after navigation
                  }}
                  className="cursor-pointer hover:text-gray-800"
                >
                  MyProfile
                </p>
                <p
                  onClick={() => {
                    navigate("/orders");
                    setIsDropdownOpen(false); // Close dropdown after navigation
                  }}
                  className="cursor-pointer hover:text-gray-800"
                >
                  Orders
                </p>
                <p
                  onClick={() => {
                    logout();
                    setIsDropdownOpen(false); // Close dropdown after logout
                  }}
                  className="cursor-pointer hover:text-gray-800"
                >
                  Logout
                </p>
              </div>
            )}
          </div>

          {token && (
            <Link to="/cart" className="relative">
              <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
              <p className="absolute right-[-5px] bottom-[-5px] w-4 h-4 text-center leading-4 bg-black text-white rounded-full text-[8px]">
                {getCartCount()}
              </p>
            </Link>
          )}

          {/* Hamburger Menu for Small Screens */}
          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            className="w-5 cursor-pointer sm:hidden"
            alt="Menu"
          />
        </div>
      </div>

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-20 w-3/4 max-w-xs bg-white shadow-lg transform transition-transform duration-300 ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!visible}
      >
        <div className="p-4">
          <button
            onClick={() => setVisible(false)}
            className="text-gray-700 hover:text-gray-900"
          >
            Close
          </button>
        </div>
        <nav className="flex flex-col text-gray-600">
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 px-4 hover:bg-gray-100"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 px-4 hover:bg-gray-100"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 px-4 hover:bg-gray-100 relative"
            to="/customize"
          >
            CUSTOMIZE
            <span className="text-[10px] text-white bg-black rounded px-1 ml-1">
              trial
            </span>
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 px-4 hover:bg-gray-100"
            to="/matching"
          >
            MIX & MATCH
          </NavLink>
        </nav>
      </div>

      {/* Backdrop */}
      {visible && (
        <div
          onClick={() => setVisible(false)}
          className="fixed inset-0 bg-black bg-opacity-30 z-10"
        ></div>
      )}
    </div>
  );
};

export default Navbar;
