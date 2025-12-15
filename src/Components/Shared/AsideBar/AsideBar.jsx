import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";

const Links = {
  admin: [
    { path: "/", title: "Home" },
    { path: "/dashboard/admin", title: "Admin Dashboard" },
    { path: "/all-products", title: "All Products" },
    { path: "/dashboard/admin/all-orders", title: "All Orders" },
    { path: "/dashboard/admin/analytics", title: "Analytics" },
    { path: "/dashboard/admin/Manage-users", title: "ManageUsers" },
  ],
  manager: [
    { path: "/", title: "Home" },
    { path: "/dashboard/manager", title: "Manager Dashboard" },
    {
      path: "/dashboard/manager/add-product",
      title: "Add Product",
    },
    {
      path: "/dashboard/manager/manage-products",
      title: "Manage Products",
    },
    {
      path: "/dashboard/manager/orders/pending",
      title: "Pending Orders",
    },
    {
      path: "/dashboard/manager/orders/approved",
      title: "Approved Orders",
    },
    { path: "/dashboard/manager/profile", title: "Manager Profile" },
  ],
  buyer: [
    { path: "/", title: "Home" },
    { path: "/dashboard/buyer", title: "Buyer Dashboard" },
    { path: "/dashboard/buyer/my-orders", title: "My Orders" },
    { path: "/dashboard/buyer/track-order", title: "Track Order" },
    { path: "/dashboard/buyer/my-profile", title: "My Profile" },
    { path: "/dashboard/buyer/booking-order", title: "Booking order" },
  ],
};

const Asidebar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  if (!role) {
    return (
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg hidden lg:block">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Loading...</h2>
          <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </aside>
    );
  }

  const sidebarLinks = Links[role] || [];
  if (sidebarLinks.length === 0) {
    return (
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg hidden lg:block">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">No Access</h2>
          <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
          <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            {role} - No Dashboard Access
          </span>
        </div>
        <div className="p-6">
          <p className="text-gray-500 text-center">
            No dashboard access for your role.
          </p>
        </div>
      </aside>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getPanelTitle = () => {
    const titles = {
      admin: "Admin Panel",
      manager: "Manager Panel",
      buyer: "My Account",
    };
    return titles[role] || "Dashboard";
  };

  const getRoleBadgeColor = () => {
    const colors = {
      admin: "bg-red-100 text-red-800",
      manager: "bg-blue-100 text-blue-800",
      buyer: "bg-green-100 text-green-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg  lg:block">
      {/* User? Info Header */}
      <div className="p-6 border-b">
        <h1 className={`text-5xl text-center${getPanelTitle()}`}>
          {role.toUpperCase()}
        </h1>
        <div className="flex items-center space-x-3">
          {user?.photoURL ? (
            <img
              src={user?.photoURL}
              alt={user?.displayName || "User"}
              className="w-12 h-12 rounded-full border-2 border-blue-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xl font-bold text-blue-600">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
          )}
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {user?.displayName || "User"}
            </h2>
            <p className="text-sm text-gray-600 truncate">{user?.email}</p>
            <span
              className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor()}`}
            >
              {role.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        {sidebarLinks.map((Links) => (
          <NavLink
            key={Links?.path}
            to={Links?.path}
            end={Links?.path === `/dashboard/${role}`}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <span>{Links?.title}</span>
          </NavLink>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-6 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Asidebar;
