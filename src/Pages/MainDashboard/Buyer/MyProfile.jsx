import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";

const MyProfile = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/auth/profile");
      setUser(res.data?.data);
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosSecure.post("/auth/logout");
      localStorage.removeItem("accessToken");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-gray-500 py-10">
        Failed to load profile
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>

      <div className="bg-white rounded-lg shadow p-6">
        {/* PROFILE HEADER */}
        <div className="flex items-center gap-6 border-b pb-6 mb-6">
          {user.photo ? (
            <img
              src={user.photo}
              alt="Profile"
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="h-20 w-20 text-gray-400" />
          )}

          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {user.name || "N/A"}
            </h3>
            <p className="text-gray-600">{user.email}</p>
            <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {user.role || "User"}
            </span>
          </div>
        </div>

        {/* PROFILE DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium text-gray-800">{user.name || "N/A"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="font-medium text-gray-800">{user.email || "N/A"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium text-gray-800">{user.role || "User"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Account Created</p>
            <p className="font-medium text-gray-800">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        {/* LOGOUT */}
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
