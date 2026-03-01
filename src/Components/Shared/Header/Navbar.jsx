import { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { HiOutlineMenuAlt1, HiMoon, HiSun } from "react-icons/hi";
import MenuSideBar from "./MenuSideBar";
import Logo from "../../Common/Logo/Logo";
import useAuth from "../../../Hooks/useAuth";
import toast from "react-hot-toast";
import useRole from "../../../Hooks/useRole";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { role } = useRole();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!", {
      position: "top-center",
      autoClose: 2000,
    });
    navigate("/");
  };

  const handleToggleTheme = () => {
    const newTheme = isDarkTheme ? "dark" : "light";
    setIsDarkTheme(!isDarkTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const navLinks = [
        { to: "/", label: "Home" },
        { to: "/all-products", label: "All Products" },
        { to: "/about", label: "About Us" },
        { to: "/contact", label: "Contact Us" },
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
      <nav
        className="text-indigo-500  sticky top-0 navbar custom-bg py-4
      
      z-50  shadow-md
      "
      >
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
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop navigation links */}
            <div className="hidden lg:flex">
              <ul className="flex justify-between gap-8">{links}</ul>
            </div>
            {/* Theme toggle */}
            <button
              onClick={handleToggleTheme}
              className=" hover:text-red-800"
              title={
                isDarkTheme ? "Switch to light theme" : "Switch to dark theme"
              }
            >
              {isDarkTheme ?
                <HiSun className="w-6 h-6" />
              : <HiMoon className="w-6 h-6 " />}
            </button>

            {user ?
              <div className="flex relative gap-4">
                <button className="font-medium hover:text-red-800 hover:underline">
                  <Link to={`/dashboard/${role}`}>Dashboard</Link>
                </button>
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="cursor-pointer">
                    <img
                      src={user?.photoURL || "https://via.placeholder.com/40"}
                      alt="user"
                      className="w-18 h-8 rounded-full border-2 border-indigo-500 hover:scale-105 transition duration-200"
                    />
                  </div>

                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box  w-30"
                  >
                   
                      <button className="hover:text-red-800 font-bold hover:underline" onClick={() => navigate(`/dashboard/profile`)}>
                        My Profile
                      </button>
                    
                  </ul>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full font-medium hover:underline  hover:text-red-800 text-red-600"
                >
                  Logout
                </button>
              </div>
            : <div className="flex gap-2">
                <Link
                  className="bg-indigo-600 border-none
               rounded-full text-white  hover:bg-red-800 
               btn p py-4 
               font-medium "
                  to="/login"
                >
                  <button>Log In</button>
                </Link>

                <Link
                  className="bg-green-600 border-none
               rounded-full text-white hover:bg-red-800 
               btn px-3  
               font-medium  "
                  to="/register"
                >
                  <button>Sign Up </button>
                </Link>
              </div>
            }
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
