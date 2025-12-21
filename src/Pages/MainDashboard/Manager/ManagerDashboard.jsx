import React, { useEffect, useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import { Link } from "react-router-dom";
import { FaTasks } from "react-icons/fa";
import { MdAddShoppingCart } from "react-icons/md";
import { BsClockHistory } from "react-icons/bs";
import { SiGoogletasks } from "react-icons/si";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

  const DashboardOverview = ({ stats }) => (
    <div className="p-6">
      <div className="mb-8 text-center item-center">
        <h2 className="text-3xl flex justify-center font-bold">
          Welcome back to Your Dashboard
        </h2>
        <p className="mt-2">Here's Your Account Management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-amber-100 rounded-4xl shadow p-6">
          <div className="ml-4 text-center">
            <p className="text-xl font-medium text-gray-600">Total Products</p>
            <p className="text-2xl mt-1 font-semibold text-blue-600">
              {stats?.totalProducts || 0}
            </p>
          </div>
        </div>

        <div className="bg-amber-100 rounded-4xl shadow p-6">
          <div className="ml-4 text-center">
            <p className="text-xl font-medium text-gray-600">Pending Orders</p>
            <p className="text-2xl mt-1 font-semibold text-red-600">
              {stats?.pendingOrders || 0}
            </p>
          </div>
        </div>

        <div className="bg-amber-100 rounded-4xl shadow p-6">
          <div className="ml-4 text-center">
            <p className="text-xl font-medium text-gray-600">Approved Orders</p>
            <p className="text-2xl mt-1 font-semibold text-purple-600">
              {stats?.approvedOrders || 0}
            </p>
          </div>
        </div>

        <div className="bg-amber-100 rounded-4xl shadow p-6">
          <div className="ml-4 text-center">
            <p className="text-xl font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl mt-1 font-semibold text-green-600">
              ${stats?.totalRevenue?.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-4xl shadow p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-900 text-center">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-6">
          <Link to="/dashboard/manager/manage-products">
            <button className="flex items-center bg-amber-100 p-3 rounded-lg hover:bg-red-200">
              <div className="flex-shrink-0 text-blue-500 bg-blue-100 rounded-lg p-3 mr-4">
                <FaTasks className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-lg text-gray-700 font-semibold">
                  Manage Products
                </p>
                <p className="text-lg text-gray-500">Edit your products</p>
              </div>
            </button>
          </Link>

          <Link to="/dashboard/manager/orders/pending">
            <button className="flex items-center bg-amber-100 p-3 rounded-lg hover:bg-red-200">
              <div className="flex-shrink-0 text-green-500 bg-green-100 rounded-lg p-3 mr-4">
                <BsClockHistory className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-lg text-gray-700 font-semibold">
                  Pending Orders
                </p>
                <p className="text-lg text-gray-500">
                  Review and approve orders
                </p>
              </div>
            </button>
          </Link>

          <Link to="/dashboard/manager/orders/approved">
            <button className="flex items-center bg-amber-100 p-3 rounded-lg hover:bg-red-200">
              <div className="flex-shrink-0 text-purple-500 bg-purple-100 rounded-lg p-3 mr-4">
                <SiGoogletasks className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-lg text-gray-700 font-semibold">
                  Approved Orders
                </p>
                <p className="text-lg text-gray-500">View completed orders</p>
              </div>
            </button>
          </Link>

          <Link to="/dashboard/manager/add-product">
            <button className="flex items-center bg-amber-100 p-3 rounded-lg hover:bg-red-200">
              <div className="flex-shrink-0 text-amber-500 bg-violet-100 rounded-lg p-3 mr-4">
                <MdAddShoppingCart className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-lg text-gray-700 font-semibold">
                  Add Product
                </p>
                <p className="text-lg text-gray-500">
                  Add Your Exciting Product
                </p>
              </div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingOrders: 0,
    approvedOrders: 0,
    totalRevenue: 0,
  });
  const axiosSecure = useAxiosSecure()

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axiosSecure.get("/manager/stats");
        setStats(response.data.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchDashboardStats();
  }, []);


  return (
    <div className="flex h-screen ">
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white rounded-4xl shadow">
          <div className="px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-xl  font-bold text-gray-800">Dashboard</h1>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Welcome, <span className="font-medium">{user?.email}</span>
                </span>
                <div className="h-8 w-8 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    <div className="avatar">
                      <div className="w-8 rounded-full">
                        <img
                          src={
                            user?.photoURL || "https://via.placeholder.com/32"
                          }
                          alt="User"
                        />
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

export default ManagerDashboard;
