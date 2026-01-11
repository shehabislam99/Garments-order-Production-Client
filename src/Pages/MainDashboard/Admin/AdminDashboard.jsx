import React, { useEffect, useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { Link } from "react-router";
import {
  FaTasks,
  FaUsers,
  FaBox,
} from "react-icons/fa";
import Loading from "../../../Components/Common/Loding/Loding";


  const DashboardOverview = ({ stats }) => (
    <div className="p-6">
      <div className="mb-8 text-center">
        <h2 className="text-3xl flex justify-center font-bold  text-gray-800">
          Welcome back
        </h2>
        <p className="text-gray-600 mt-2">Here's your Dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-amber-100 rounded-4xl  shadow p-6">
          <div className="ml-4 text-center">
            <p className="text-xl font-medium text-gray-600">Total Products</p>
            <p className="text-2xl mt-1 font-semibold text-blue-900">
              {stats.allProducts || 0}
            </p>
          </div>
        </div>

        

        <div className="bg-amber-100 rounded-4xl shadow p-6">
          <div className="ml-4 text-center">
            <p className="text-xl font-medium text-gray-600">Total Users</p>
            <p className="text-2xl mt-1 font-semibold text-violet-900">
              {stats.allUsers || 0}
            </p>
          </div>
        </div>

        <div className="bg-amber-100 rounded-4xl shadow p-6">
          <div className="ml-4 text-center">
            <p className="text-xl font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl mt-1 font-semibold text-green-900">
              ${stats.totalRevenue?.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-4xl shadow p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/dashboard/admin/manage-users">
            <button className="flex items-center bg-amber-100 p-3 rounded-lg hover:bg-red-200">
              <div className="flex-shrink-0 text-blue-500 bg-blue-100 rounded-lg p-3 mr-4">
                <FaUsers />
              </div>
              <div className="text-left">
                <p className="text-xl font-semibold text-gray-900">Manage Users</p>
                <p className="text-lg text-gray-500 font-medium">
                  View and manage all users
                </p>
              </div>
            </button>
          </Link>

          <Link to="/dashboard/admin/manage-products">
            <button className="flex items-center bg-amber-100 p-3 rounded-lg hover:bg-red-200">
              <div className="flex-shrink-0 text-green-500 bg-green-100 rounded-lg p-3 mr-4">
                <FaBox />
              </div>
              <div className="text-left">
                <p className="text-xl font-semibold text-gray-900">All Products</p>
                <p className="text-lg text-gray-500 font-medium">
                  Edit, delete or update products
                </p>
              </div>
            </button>
          </Link>

          <Link to="/dashboard/admin/all-orders">
            <button className="flex items-center bg-amber-100 p-3 rounded-lg hover:bg-red-200">
              <div className="flex-shrink-0 text-purple-500 bg-purple-100 rounded-lg p-3 mr-4">
                <FaTasks />
              </div>
              <div className="text-left">
                <p className="text-xl font-semibold text-gray-900">All Orders</p>
                <p className="text-lg text-gray-500 font-medium">
                  Review, delete and approve orders
                </p>
              </div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );

const AdminDashBoard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true);
 const [stats, setStats] = useState({
   allProducts: 0,
   allUsers: 0,
   totalRevenue: 0, 
 });
  const axiosSecure = useAxiosSecure()

useEffect(() => {

    const fetchDashboardStats = async () => {
      try {
        const response = await axiosSecure.get("/admin/stats");
        setStats(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setLoading(false);
      }
    };
  fetchDashboardStats();
}, []);

 
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading className="h-16 w-16" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white shadow">
          <div className="px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-xl  font-bold text-gray-800">
                 Dashboard
              </h1>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Welcome, <span className="font-medium">{user?.email}</span>
                </span>
                <div className="h-8 w-8 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    <div className="avatar">
                      <div className="w-8 rounded-full">
                        <img src={user?.photoURL} alt="User" />
                      </div>
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <DashboardOverview stats={stats} />
        </main>
      </div>
    </div>
  );
};

export default AdminDashBoard;
