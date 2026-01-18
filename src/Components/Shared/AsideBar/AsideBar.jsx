import React, {  useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaTasks,
  FaUsers,
  FaHome,
  FaBox,
  FaUser,
  FaShoppingCart,
} from "react-icons/fa";
import { TbSquareToggle } from "react-icons/tb";
import { MdAddShoppingCart } from "react-icons/md";
import { BsClockHistory } from "react-icons/bs";
import { SiGoogletasks } from "react-icons/si";
import useAuth from "../../../Hooks/useAuth";
import useRole from "../../../Hooks/useRole";
import Loading from "../../Common/Loding/Loding";



const roleConfig = {
  admin: {
    title: "Admin Panel",
    badgeColor: "badge-error",
    links: [
      { path: "/dashboard/admin", title: "My Dashboard", icon: FaHome },
      {
        path: "/dashboard/all-product",
        title: "All Products",
        icon: FaBox,
      },
      {
        path: "/dashboard/all-orders",
        title: "All Orders",
        icon: FaTasks,
      },
      {
        path: "/dashboard/manage-users",
        title: "Manage Users",
        icon: FaUsers,
      },
    ],
  },

  manager: {
    title: "Manager Panel",
    badgeColor: "badge-primary",
    links: [
      {
        path: "/dashboard/manager",
        title: "My Dashboard",
        icon: FaHome,
      },
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
      {
        path: "/dashboard/profile",
        title: "Manager Profile",
        icon: FaUser,
      },
    ],
  },

  buyer: {
    title: "My Account",
    badgeColor: "badge-success",
    links: [
      {
        path: "/dashboard/buyer",
        title: "My Dashboard",
        icon: FaHome,
      },
      {
        path: "/dashboard/my-orders",
        title: "My Orders",
        icon: FaShoppingCart,
      },
      {
        path: "/dashboard/profile",
        title: "My Profile",
        icon: FaUser,
      },
    ],
  },
};


const Asidebar = () => {
  const { user } = useAuth();
  const { role, loading } = useRole();
  const [open, setOpen] = useState(false);


  if (!user) return null;

  if (loading) {
    return (
      <aside className="fixed left-0 -top-2 h-full w-64 bg-base-200 p-6">
        <Loading></Loading>
      </aside>
    );
  }
  const config = roleConfig[role] || roleConfig.buyer;

  return (
    <>
      <button
        className="lg:hidden z-50 bg-base-300 "
        onClick={() => setOpen(!open)}
      >
        <TbSquareToggle className="relative bottom-84 text-2xl" />
      </button>
      <aside
        className={`
    bg-base-300 border-r border-base-200
    transition-all duration-300 overflow-hidden
    ${open ? "w-64" : "w-0 lg:w-64"}
   
  `}
      >
        <div className="p-6 flex justify-center border-b border-gray-300">
          <h1 className="mt-1 font-bold text-3xl">{config.title}</h1>
        </div>

        <div className="p-6 border-b border-gray-300">
          <div className="flex text-center space-x-4">
            <div className="flex-1">
              <h2 className="font-bold text-lg truncate">
                {user?.displayName || "Unknown"}
              </h2>
              <div className={`badge ${config.badgeColor} mt-1`}>
                {role.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="px-4 py-2 text-xl space-y-3 font-medium w-full">
            {config.links.map((link) => {
              const Icon = link.icon;
              return (
                <li
                  className="hover:bg-red-800 hover:rounded-2xl hover:px-2 hover:py-2"
                  key={link.path}
                  onClick={() => setOpen(open)}
                >
                  <NavLink
                    to={link.path}
                    end={link.path === `/dashboard/${role}`}
                    className={({ isActive }) =>
                      `flex items-center ${isActive ? "active" : ""}`
                    }
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    <span className="ml-3 ">{link.title}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Asidebar;
