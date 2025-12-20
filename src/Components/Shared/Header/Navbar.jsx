import { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { HiOutlineMenuAlt1, HiMoon, HiSun, HiX } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";
import MenuSideBar from "./MenuSideBar";
import Logo from "../../Common/Logo/Logo";
import useAuth from "../../../Hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleToggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document
      .querySelector("html")
      .setAttribute("data-theme", isDarkTheme ? "dark" : "light");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/all-products", label: "Products" },
    { to: "/about", label: "About" },
  ];

  const links = (
    <>
      {navLinks.map((link, index) => (
        <button key={index}>
          <NavLink
            to={link.to}
            className={({ isActive }) =>
              `text-[16px] font-medium hover:text-red-800  ${
                isActive ? "text-red-800 font-medium underline" : ""
              }`
            }
          >
            {link.label}
          </NavLink>
        </button>
      ))}
    </>
  );

  return (
    <>
      <nav className="text-black navbar bg-gray-200 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-20">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden flex items-center 
              focus:outline-none"
            >
              <HiOutlineMenuAlt1 className="w-7 h-7" />
              <div className="items-center hover:underline">
                <Logo />
              </div>
            </button>

            <div className="hidden lg:flex items-center">
              <Logo />
            </div>

            {/* Desktop navigation links */}
            <div className="hidden lg:flex navbar-center">
              <ul className="flex justify-between gap-8">{links}</ul>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search bar */}
            <div
              className="hidden md:flex items-centerw-full
             text-gray-800 bg-gray-800 border border-gray-400 rounded-full       
             px-4 py-2 w-48"
            >
              <input
                type="text"
                placeholder="Search Product..."
                className="bg-transparent border-none outline-none text-white placeholder-gray-400 w-full"
              />
            </div>

            {/* Mobile search button */}
            <div className="lg:hidden md:hidden">
              <button className="mt-2 hover:text-red-800">
                <FaSearch />
              </button>
            </div>
            {/* Desktop search button */}
            <button
              placeholder="Search Product..."
              className=" 
            hover:text-red-800
              font-semibold  hidden md:flex  "
              title="Search"
            >
              Search
            </button>

            {/* Theme toggle */}
            <button
              onClick={handleToggleTheme}
              className="hover:text-indigo-300  md:p-2 rounded-full hover:bg-red-800"
              title={
                isDarkTheme ? "Switch to light theme" : "Switch to dark theme"
              }
            >
              {isDarkTheme ? (
                <HiSun className="w-6 h-6" />
              ) : (
                <HiMoon className="w-6 h-6 " />
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center"
                >
                  <img
                    src={user?.photoURL || "https://via.placeholder.com/40"}
                    alt="user"
                    className="w-10 h-10 rounded-full border-2 border-amber-500"
                  />
                </button>

                {isProfileOpen && (
                  <div
                    className="absolute right-0 mt-3 font-semibold w-48 backdrop-blur-xl 
                  py-3"
                  >
                    <Link
                      onClick={() => setIsProfileOpen(false)}
                      to="/dashboard"
                      className="block text-green-600 px-4 py-2 hover:text-red-800 hover:underline"
                    >
                      Dashboard
                    </Link>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);

                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 hover:text-red-800 text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  className="bg-indigo-600 border-none
               rounded-full text-white  hover:bg-purple-600 
               btn p py-4 
               font-medium "
                  to="/login"
                >
                  <button>Log In</button>
                </Link>

                <Link
                  className="bg-green-600 border-none
               rounded-full text-white hover:bg-purple-600 
               btn px-3  
               font-medium  "
                  to="/register"
                >
                  <button>Sign Up </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <MenuSideBar
        links={navLinks}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
};

export default Navbar;
