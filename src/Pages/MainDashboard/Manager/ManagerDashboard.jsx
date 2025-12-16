import React, { useEffect, useState } from "react";
import ManageProducts from "./ManageProducts";
import PendingOrders from "./PendingOrders";
import ApprovedOrders from "./ApproveOrders";
import ManagerProfile from "./ManagerProfile";
import { axiosInstance } from "../../../Hooks/useAxios";
import useAuth from "../../../Hooks/useAuth";
import { Link } from "react-router";
import {
  Banknote,
  CalendarCheck,
  ClockFading,
  ShieldCheck,
} from "lucide-react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoNotificationsOffOutline } from "react-icons/io5";
import { FaTasks } from "react-icons/fa";

import { MdAddShoppingCart } from "react-icons/md";
import { BsClockHistory } from "react-icons/bs";
import { SiGoogletasks } from "react-icons/si";

const ManagerDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [notifications, setNotifications] = useState([]);
  // const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingOrders: 0,
    approvedOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
    fetchNotifications();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axiosInstance.get("/manager/stats");
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };
  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get("/notifications");
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "manage-Products":
        return <ManageProducts />;
      case "pending-orders":
        return <PendingOrders />;
      case "approved-orders":
        return <ApprovedOrders />;
      case "profile":
        return <ManagerProfile />;
      default:
        return <DashboardOverview />;
    }
  };

  const DashboardOverview = () => (
    <div className="p-6">
      <div className="mb-8 text-center item-center">
        <h2 className="text-3xl flex justify-center font-bold  text-gray-800">
          Welcome back Your Dashboard
        </h2>
        <p className="text-gray-600 mt-2">Here's Your Account Management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-blue-500 bg-blue-100 rounded-md p-3">
              <ShieldCheck />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Products
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.totalProducts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-yellow-500 bg-yellow-100 rounded-md p-3">
              <ClockFading />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Pending Orders
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.pendingOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-purple-500 bg-purple-100 rounded-md p-3">
              <CalendarCheck />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Approved Orders
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.recentBookings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-green-500 bg-green-100 rounded-md p-3">
              <Banknote />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${stats?.totalSpent?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/dashboard/manager/manage-products">
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition duration-150">
              <div className="flex-shrink-0 text-blue-500 bg-blue-100 rounded-md p-3 mr-4">
                <FaTasks />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Manage Products</p>
                <p className="text-sm text-gray-500">
                  Edit, delete or update products
                </p>
              </div>
            </button>
          </Link>

          <Link to="/dashboard/manager/orders/pending">
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 transition duration-150">
              <div className="flex-shrink-0 text-green-500 bg-green-100 rounded-md p-3 mr-4">
                <BsClockHistory />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Pending Orders</p>
                <p className="text-sm text-gray-500">
                  Review and approve orders
                </p>
              </div>
            </button>
          </Link>

          <Link to="/dashboard/manager/orders/approved">
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-purple-300 transition duration-150">
              <div className="flex-shrink-0 text-purple-500 bg-purple-100 rounded-md p-3 mr-4">
                <SiGoogletasks />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Approved Orders</p>
                <p className="text-sm text-gray-500">View completed orders</p>
              </div>
            </button>
          </Link>

          <Link to="/dashboard/manager/add-product">
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-amber-300 transition duration-150">
              <div className="flex-shrink-0 text-amber-500 bg-amber-100 rounded-md p-3 mr-4">
                <MdAddShoppingCart />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Add Product</p>
                <p className="text-sm text-gray-500">
                  Add Your Exiciting Product
                </p>
              </div>
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notifications */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            <button
              onClick={fetchNotifications}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Mark all as read
            </button>
          </div>
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification._id}
                  className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div
                    className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                      notification.type === "order"
                        ? "bg-blue-500"
                        : notification.type === "shipping"
                        ? "bg-green-500"
                        : notification.type === "promotion"
                        ? "bg-purple-500"
                        : "bg-yellow-500"
                    }`}
                  ></div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <span className="text-gray-400 ">
                  <IoNotificationsOffOutline className="mx-auto h-12 w-12" />
                </span>
                <p className="text-gray-500 mt-4">No new notifications</p>
              </div>
            )}
          </div>
          {notifications.length > 5 && (
            <button
              onClick={() => {
                /* View all notifications */
              }}
              className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-800"
            >
              View all notifications
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                <svg
                  className="h-4 w-4 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-900">
                  New order #ORD-001 received
                </p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                <svg
                  className="h-4 w-4 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-900">Order #ORD-999 approved</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-full p-2">
                <svg
                  className="h-4 w-4 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-900">Product stock updated</p>
                <p className="text-xs text-gray-500">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white shadow">
          <div className="px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-lg  font-semibold text-gray-800">
                My Dashboard
              </h1>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <button
                    onClick={() => {}}
                    className="relative p-2 text-gray-600 hover:text-gray-900"
                  >
                    <span className="text-amber-400">
                      <IoIosNotificationsOutline className="w-6 h-6 " />
                    </span>
                    {notifications.filter((n) => !n.read).length > 0 && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
                    )}
                  </button>
                </div>
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

        <main className="flex-1 overflow-y-auto">{renderComponent()}</main>
      </div>
    </div>
  );
};

export default ManagerDashboard;
