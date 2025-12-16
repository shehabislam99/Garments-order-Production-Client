import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaRegCreditCard,
  FaTasks,
  FaUsers,
  FaHome,
  FaBox,
  FaChartBar,
  FaMapMarkerAlt,
  FaUser,
} from "react-icons/fa";
import { MdAddShoppingCart } from "react-icons/md";
import { SiGoogletasks } from "react-icons/si";
import useAuth from "../../../Hooks/useAuth";
import useRole from "../../../Hooks/useRole";
import Loader from "../../Common/Loader/Loader";



const roleConfig = {
  admin: {
    title: "Admin Panel",
    badgeColor: "badge-error",
    links: [
      { path: "/dashboard/admin", title: "My Dashboard", icon: FaHome },
      {
        path: "/dashboard/admin/all-products",
        title: "All Products",
        icon: FaBox,
      },
      {
        path: "/dashboard/admin/all-orders",
        title: "All Orders",
        icon: FaTasks,
      },
      {
        path: "/dashboard/admin/analytics",
        title: "Analytics",
        icon: FaChartBar,
      },
      {
        path: "/dashboard/admin/manage-users",
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
        path: "/dashboard/manager/add-product",
        title: "Add Product",
        icon: MdAddShoppingCart,
      },
      {
        path: "/dashboard/manager/manage-products",
        title: "Manage Products",
        icon: FaTasks,
      },
      {
        path: "/dashboard/manager/orders/pending",
        title: "Pending Orders",
        icon: SiGoogletasks,
      },
      {
        path: "/dashboard/manager/orders/approved",
        title: "Approved Orders",
        icon: SiGoogletasks,
      },
      {
        path: "/dashboard/manager/profile",
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
      { path: "/dashboard/buyer/my-orders", title: "My Orders", icon: FaTasks },
      {
        path: "/dashboard/buyer/track-order",
        title: "Track Order",
        icon: FaMapMarkerAlt,
      },
      {
        path: "/dashboard/buyer/my-profile",
        title: "My Profile",
        icon: FaUser,
      },
      {
        path: "/dashboard/buyer/booking-order",
        title: "Booking Order",
        icon: FaRegCreditCard,
      },
    ],
  },
};


const Asidebar = () => {
  const { user, logout } = useAuth();
  const { role, loading } = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || loading || !role) return;

    if (role === "admin") {
      navigate("/dashboard/admin", { replace: true });
    } else if (role === "manager") {
      navigate("/dashboard/manager", { replace: true });
    } else {
      navigate("/dashboard/buyer", { replace: true });
    }
  }, [user, role, loading, navigate]);

  if (!user) return null;

  if (loading) {
    return (
      <aside className="fixed left-0 -top-2 h-full w-64 bg-base-200 p-6">
        <Loader></Loader>
      </aside>
    );
  }

  const config = roleConfig[role] || roleConfig.buyer;
  
  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <aside className="w-64 bg-base-200 min-h-screen flex flex-col">
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
        <ul className="menu menu-lg w-full">
          {config.links.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  end={link.path === `/dashboard/${role}`}
                  className={({ isActive }) =>
                    `flex items-center ${isActive ? "active" : ""}`
                  }
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  <span className="ml-3">{link.title}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-6 border-t border-base-300">
        <button onClick={handleLogout} className="btn btn-error btn-block">
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Asidebar;
