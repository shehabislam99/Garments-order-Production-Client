import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyOrders from "./MyOrder";
import TrackOrder from "./TrackOrder";
import MyProfile from "./MyProfile";
import { IoIosNotificationsOutline } from "react-icons/io";
import { BsClipboard2X } from "react-icons/bs";
import { IoNotificationsOffOutline } from "react-icons/io5";
import {
  FaTasks,
  FaMapMarkerAlt,
  FaUser,
} from "react-icons/fa";
import { Banknote, CalendarCheck, ClockFading, ShieldCheck } from "lucide-react";
import useAuth from "../../../Hooks/useAuth";
import { axiosInstance } from "../../../Hooks/useAxios";

const BuyerDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalSpent: 0,
    recentBookings: 0,
  });
  

  useEffect(() => {
    fetchDashboardStats();
    fetchNotifications();
  }, []);



  const fetchDashboardStats = async () => {
    try {
      const response = await axiosInstance.get("/buyer/stats");
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
      case "my-orders":
        return <MyOrders />;
      case "track-order":
        return <TrackOrder />;
      case "my-profile":
        return <MyProfile />;
      default:
        return <DashboardOverview />;
    }
  };

  const DashboardOverview = () => (
    <div className="p-6">
      <div className="mb-8 text-center item-center">
        <h2 className="text-3xl flex justify-center font-bold  text-gray-800">
          Welcome back
        </h2>
        <p className="text-gray-600 mt-2">Here's Your Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-blue-500 bg-blue-100 rounded-md p-3">
              <ShieldCheck />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.totalOrders}
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
            <div className="flex-shrink-0 text-green-500 bg-green-100 rounded-md p-3">
              <Banknote />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${stats?.totalSpent?.toFixed(2) || "0.00"}
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
                Recent Bookings
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.recentBookings}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/dashboard/buyer/my-orders">
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition duration-150">
              <div className="flex-shrink-0 text-blue-500 bg-blue-100 rounded-md p-3 mr-4">
                <FaTasks />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">My Orders</p>
                <p className="text-sm text-gray-500">View your order history</p>
              </div>
            </button>
          </Link>

          <Link to="/dashboard/buyer/track-order">
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 transition duration-150">
              <div className="flex-shrink-0 text-green-500 bg-green-100 rounded-md p-3 mr-4">
                <FaMapMarkerAlt />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Track Order</p>
                <p className="text-sm text-gray-500">
                  Tracking your order status
                </p>
              </div>
            </button>
          </Link>
          <Link to="/dashboard/buyer/my-profile">
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-amber-300 transition duration-150">
              <div className="flex-shrink-0 text-amber-500 bg-amber-100 rounded-md p-3 mr-4">
                <FaUser />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">My Profile</p>
                <p className="text-sm text-gray-500">Manage account settings</p>
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

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Orders
          </h3>
          <div className="space-y-4">
            {stats?.totalOrders > 0 ? (
              <>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Order #ORD-0012
                    </p>
                    <p className="text-xs text-gray-500">
                      Placed on Dec 12, 2024
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Delivered
                    </span>
                    <p className="ml-3 text-sm font-medium text-gray-900">
                      $149.99
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Order #ORD-0011
                    </p>
                    <p className="text-xs text-gray-500">
                      Placed on Dec 10, 2024
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Processing
                    </span>
                    <p className="ml-3 text-sm font-medium text-gray-900">
                      $89.99
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Order #ORD-0010
                    </p>
                    <p className="text-xs text-gray-500">
                      Placed on Dec 5, 2024
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      Shipped
                    </span>
                    <p className="ml-3 text-sm font-medium text-gray-900">
                      $249.99
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <BsClipboard2X className="mx-auto h-12 w-12" />
                </div>
                <p className="text-gray-500">No orders yet</p>
                <button
                  onClick={() => navigate("/all-products")}
                  className="mt-4 text-sm text-blue-600 hover:text-blue-800"
                >
                  Start shopping
                </button>
              </div>
            )}
          </div>
          {stats?.totalOrders > 0 && (
            <button
              onClick={() => setActiveComponent("/dashboard/buyer/my-orders")}
              className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-800"
            >
              View all orders
            </button>
          )}
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
export default BuyerDashboard;