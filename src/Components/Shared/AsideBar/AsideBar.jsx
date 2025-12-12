import { NavLink } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import { getSidebarRoutes } from "../../../utils/AsideBarRoute";

const Asidebar = ({ user }) => {
  const { logout } = useAuth();
  const sidebarRoutes = getSidebarRoutes(user?.role);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <aside className="fixed left-0 top-0 h-full bg-white shadow-lg w-64 hidden lg:block">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">
          {user?.role === "admin"
            ? "Admin Panel"
            : user?.role === "manager"
            ? "Manager Panel"
            : "My Account"}
        </h2>
        <p className="text-gray-600 text-sm mt-1">{user?.email}</p>
      </div>

      <nav className="mt-6">
        {sidebarRoutes.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                isActive
                  ? "bg-blue-50 border-r-4 border-blue-600 text-blue-600"
                  : ""
              }`
            }
          >
            <span className="ml-3">{route.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
