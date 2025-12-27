import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import Loading from "../Common/Loding/Loding";
import useAuth from "../../Hooks/useAuth";
import useProfile from "../../Hooks/useProfile";

const Rowinformation = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3 border-b border-gray-100">
    <span className="font-medium text-gray-900 min-w-[140px]">{label}:</span>
    <span className="text-blue-700 font-medium break-all">
      {value || "Not set"}
    </span>
  </div>
);

const ManagerProfile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { profile: user, loading } = useProfile();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-700 mb-2">
            Failed to load profile
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Your Profile
          </h2>
          <p className="text-lg text-gray-600 mt-3">
            Here's Your account information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="col-span-1">
            <div className="bg-amber-100 rounded-4xl shadow-lg p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={user?.photoURL || "/default-avatar.png"}
                    alt={user?.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-400"
                  />
                  <div className="absolute bottom-3 right-2 bg-blue-600 p-2 rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mt-4">
                  {user?.name || "User"}
                </h2>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mt-2">
                  {user?.role?.toUpperCase() || "USER"}
                </div>
              </div>

              <div className="text-center space-y-3">
                <div className="flex items-center justify-center">
                  <span className="font-semibold text-gray-900">
                    Last Login:
                  </span>
                  <span className="ml-2 text-blue-700">
                    {user?.metadata?.lastSignInTime
                      ? new Date(user.metadata.lastSignInTime).toLocaleString()
                      : "Recently"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-sm font-medium ${
                      user?.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user?.status?.toUpperCase() || "ACTIVE"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-amber-100 p-6 md:p-8 rounded-4xl shadow-lg">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">
                Personal Information
              </h2>

              <div className="space-y-4">
                <Rowinformation label="Full Name" value={user?.name} />
                <Rowinformation label="Email Address" value={user?.email} />
                <Rowinformation label="Role" value={user?.role} />
                <Rowinformation
                  label="Member Since"
                  value={
                    user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"
                  }
                />
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerProfile;
