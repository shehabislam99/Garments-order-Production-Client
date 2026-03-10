import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaTasks,
  FaUsers,
  FaHome,
  FaBox,
  FaUser,
  FaShoppingCart,
  FaTimes,
  FaChartLine,
} from "react-icons/fa";
import { MdAddShoppingCart } from "react-icons/md";
import { BsClockHistory } from "react-icons/bs";
import { SiGoogletasks } from "react-icons/si";
import useAuth from "../../../Hooks/useAuth";
import useRole from "../../../Hooks/useRole";
import Loading from "../../Common/Loding/Loding";
import { TbSquareToggle } from "react-icons/tb";

const roleConfig = {
    admin: {
      title: "Admin Panel",
      badgeColor: "badge-error",
      links: [
        { path: "/dashboard/admin", title: "My Dashboard", icon: FaHome },
        { path: "/dashboard/all-product", title: "All Products", icon: FaBox },
        { path: "/dashboard/all-orders", title: "All Orders", icon: FaTasks },
        {
          path: "/dashboard/admin/analytics",
          title: "Analytics",
          icon: FaChartLine,
        },
        { path: "/dashboard/manage-users", title: "Manage Users", icon: FaUsers },
        { path: "/dashboard/profile", title: "Profile", icon: FaUser },
        { path: "/dashboard/settings", title: "Settings", icon: TbSquareToggle },
      ],
  },
  manager: {
    title: "Manager Panel",
    badgeColor: "badge-primary",
    links: [
      { path: "/dashboard/manager", title: "My Dashboard", icon: FaHome },
      {
        path: "/dashboard/add-product",
        title: "Add Product",
        icon: MdAddShoppingCart,
      },
      {
        path: "/dashboard/manage-products",
        title: "Manage Products",
        icon: FaTasks,
      },
      {
        path: "/dashboard/pending-orders",
        title: "Pending Orders",
        icon: BsClockHistory,
      },
      {
        path: "/dashboard/approved-orders",
        title: "Approved Orders",
        icon: SiGoogletasks,
      },
      { path: "/dashboard/profile", title: "Manager Profile", icon: FaUser },
    ],
  },
  buyer: {
    title: "My Account",
    badgeColor: "badge-success",
    links: [
      { path: "/dashboard/buyer", title: "My Dashboard", icon: FaHome },
      {
        path: "/dashboard/my-orders",
        title: "My Orders",
        icon: FaShoppingCart,
      },
      {
        path: "/all-products",
        title: "Explore Products",
        icon: FaBox,
      },
      { path: "/dashboard/profile", title: "My Profile", icon: FaUser },
      { path: "/dashboard/settings", title: "Settings", icon: TbSquareToggle },
    ],
  },
};

const Asidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { role, loading } = useRole();
  const location = useLocation();

  useEffect(() => {
    onClose?.();
  }, [location.pathname, onClose]);

  if (!user) return null;
  if (loading) {
    return (
      <aside className="hidden w-72 shrink-0 border-r border-base-200 bg-base-200 p-6 lg:block">
        <Loading />
      </aside>
    );
  }

  const config = roleConfig[role] || roleConfig.buyer;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className="hidden w-72 shrink-0 border-r border-base-200 bg-base-300 lg:block">
        <div className="sticky top-0 h-[calc(100vh-80px)] overflow-y-auto">
          <div className="flex justify-center border-b border-gray-300 p-6">
            <h1 className="mt-1 text-3xl font-bold">{config.title}</h1>
          </div>

          <div className="border-b border-gray-300 p-6">
            <div className="flex text-center space-x-4">
              <div className="flex-1">
                <h2 className="truncate text-lg font-bold">
                  {user.displayName || "Unknown"}
                </h2>
                <div className={`badge ${config.badgeColor} mt-1`}>
                  {role.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="w-full space-y-3 px-4 py-2 text-xl font-medium">
              {config.links.map((link) => {
                const Icon = link.icon;
                return (
                  <li
                    key={link.path}
                    className="hover:rounded-4xl hover:bg-red-800 hover:px-2 hover:py-2"
                  >
                    <NavLink
                      to={link.path}
                      end={link.path === `/dashboard/${role}`}
                      className={({ isActive }) =>
                        `flex items-center ${isActive ? "active" : ""}`
                      }
                    >
                      <Icon className="h-5 w-5" />
                      <span className="ml-3">{link.title}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      <aside
        className={`fixed left-0 top-0 z-30 h-full w-72 border-r border-base-200 bg-base-300 transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="flex items-center justify-between border-b border-gray-300 p-6">
            <h1 className="mt-1 text-2xl font-bold">{config.title}</h1>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-xl hover:bg-base-200"
              aria-label="Close dashboard menu"
            >
              <FaTimes />
            </button>
          </div>

          <div className="border-b border-gray-300 p-6">
            <div className="flex text-center space-x-4">
              <div className="flex-1">
                <h2 className="truncate text-lg font-bold">
                  {user.displayName || "Unknown"}
                </h2>
                <div className={`badge ${config.badgeColor} mt-1`}>
                  {role.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="w-full space-y-3 px-4 py-2 text-xl font-medium">
              {config.links.map((link) => {
                const Icon = link.icon;
                return (
                  <li
                    key={link.path}
                    className="hover:rounded-4xl hover:bg-red-800 hover:px-2 hover:py-2"
                  >
                    <NavLink
                      to={link.path}
                      end={link.path === `/dashboard/${role}`}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center ${isActive ? "active" : ""}`
                      }
                    >
                      <Icon className="h-5 w-5" />
                      <span className="ml-3">{link.title}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Asidebar;
