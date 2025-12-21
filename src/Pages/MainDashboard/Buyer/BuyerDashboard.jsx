import React, { useState, useEffect } from "react";
import { Link, } from "react-router-dom";
import {
  FaTasks,
  FaMapMarkerAlt,
  FaUser,
} from "react-icons/fa";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const DashboardOverview = ({ stats }) => (
  <div className="p-6">
    <div className="mb-8 text-center item-center">
      <h2 className="text-3xl flex justify-center font-bold">
        Welcome back
      </h2>
      <p className="mt-2">Here's Your Dashboard</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-amber-100 rounded-4xl  shadow p-6">
        <div className="ml-4 text-center">
          <p className="text-xl font-medium text-gray-600">Total Orders</p>
          <p className="text-2xl mt-1 font-semibold text-blue-500">
            {stats?.totalOrders || 0}
          </p>
        </div>
      </div>

      <div className="bg-amber-100 rounded-4xl shadow p-6">
        <div className="ml-4 text-center">
          <p className="text-xl font-medium text-gray-600">Pending Orders</p>
          <p className="text-2xl mt-1 font-semibold text-purple-900">
            {stats?.pendingOrders || 0}
          </p>
        </div>
      </div>

      <div className="bg-amber-100 rounded-4xl shadow p-6">
        <div className="ml-4 text-center">
          <p className="text-xl font-medium text-gray-600">Total Spent</p>
          <p className="text-2xl mt-1 font-semibold text-green-600">
            ${stats?.totalSpent?.toFixed(2) || "0.00"}
          </p>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-4xl shadow p-6 mb-8">
      <h3 className="text-lg font-bold text-gray-900  text-center">
        Quick Actions
      </h3>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <Link to="/dashboard/my-orders">
          <button className="flex items-center bg-amber-100 p-3 rounded-lg hover:bg-red-200">
            <div className="flex-shrink-0 text-blue-500 bg-blue-100 rounded-lg p-3 mr-4">
              <FaTasks className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-semibold text-gray-900">My Orders</p>
              <p className="text-xl text-gray-500">View your order history</p>
            </div>
          </button>
        </Link>

        <Link to="/dashboard/track-order/:orderId">
          <button className="flex items-center bg-amber-100 p-3 rounded-lg hover:bg-red-200">
            <div className="flex-shrink-0 text-green-500 bg-green-100 rounded-lg p-3 mr-4">
              <FaMapMarkerAlt className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-semibold text-gray-900">
                Track Order
              </p>
              <p className="text-xl text-gray-500">
                Tracking your order status
              </p>
            </div>
          </button>
        </Link>
        <Link to="/dashboard/my-profile">
          <button className="flex items-center bg-amber-100 p-3 rounded-lg hover:bg-red-200">
            <div className="flex-shrink-0 text-amber-500 bg-amber-100 rounded-lg p-3 mr-4">
              <FaUser className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-semibold text-gray-900">My Profile</p>
              <p className="text-xl text-gray-500">Manage account settings</p>
            </div>
          </button>
        </Link>
      </div>
    </div>
  </div>
);


const BuyerDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure()
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalSpent: 0,
  });
  

  useEffect(() => {
      const fetchDashboardStats = async () => {
        try {
          const response = await axiosSecure.get("/buyer/stats");
          setStats(response.data.data);
        } catch (error) {
          console.error("Error fetching dashboard stats:", error);
        }
      };
    fetchDashboardStats();
  }, []);


  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white rounded-4xl shadow">
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
                          <img src={user.photoURL} alt="User" />
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
export default BuyerDashboard;