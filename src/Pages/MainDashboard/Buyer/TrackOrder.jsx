import React, { useState, useEffect } from "react";
import axiosInstance from "../../../Hooks/useAxios";


const TrackOrder = () => {
  const [trackingId, setTrackingId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // For recent orders tracking
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const response = await axiosInstance.get("/orders/recent");
      setRecentOrders(response.data.data || []);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
    }
  };

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      setError("Please enter a tracking ID or order number");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setOrder(null);

      const response = await axiosInstance.get(`/orders/track/${trackingId}`);

      if (response.data.success) {
        setOrder(response.data.data);
        setSuccess("Order found successfully!");
      } else {
        setError("Order not found. Please check your tracking ID.");
      }
    } catch (error) {
      setError("Failed to track order. Please try again.");
      console.error("Error tracking order:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-yellow-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "approved":
        return (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "shipped":
        return (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-indigo-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h4v1a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H20a1 1 0 001-1v-4.5c0-.88-.56-1.66-1.39-1.95l-3-1.05A3 3 0 0015 5.5h-2.09c-.38 0-.73.22-.91.56L11 8H9.09c-.38 0-.73.22-.91.56L7.09 10H5.09c-.38 0-.73.22-.91.56L3 12.5V4z" />
            </svg>
          </div>
        );
      case "delivered":
        return (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case "pending":
        return "Your order is being processed";
      case "approved":
        return "Your order has been approved";
      case "shipped":
        return "Your order is on the way";
      case "delivered":
        return "Your order has been delivered";
      default:
        return "Status unknown";
    }
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case "pending":
        return 25;
      case "approved":
        return 50;
      case "shipped":
        return 75;
      case "delivered":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Track Your Order</h2>
        <p className="text-gray-600 mt-2">
          Enter your order number or tracking ID to check the status
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleTrackOrder}>
          <div className="mb-4">
            <label
              htmlFor="trackingId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Order Number or Tracking ID
            </label>
            <div className="flex">
              <input
                type="text"
                id="trackingId"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter order # or tracking ID"
                className="flex-grow px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Tracking...
                  </span>
                ) : (
                  "Track Order"
                )}
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              You can find your order number in your order confirmation email
            </p>
          </div>
        </form>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && !error && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}
      </div>

      {/* Order Tracking Results */}
      {order && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Order Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="font-medium text-gray-900">
                  {order.orderNumber || order._id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-medium text-gray-900">
                  ${order.totalAmount?.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Shipping Address</p>
                <p className="font-medium text-gray-900">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </p>
              </div>
            </div>
          </div>

          {/* Tracking Progress */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Tracking Progress
            </h3>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Order Status
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {getProgressPercentage(order.status)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${getProgressPercentage(order.status)}%` }}
                ></div>
              </div>
            </div>

            {/* Status Steps */}
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              {["pending", "approved", "shipped", "delivered"].map(
                (status, index) => {
                  const isActive =
                    ["pending", "approved", "shipped", "delivered"].indexOf(
                      order.status
                    ) >= index;
                  const isCurrent = order.status === status;

                  return (
                    <div
                      key={status}
                      className="relative flex items-start mb-8"
                    >
                      <div className="flex-shrink-0 mr-4">
                        {getStatusIcon(status)}
                      </div>
                      <div className={`flex-grow ${isCurrent ? "pt-1" : ""}`}>
                        <h4
                          className={`text-sm font-medium ${
                            isActive ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </h4>
                        <p
                          className={`text-sm ${
                            isActive ? "text-gray-600" : "text-gray-400"
                          }`}
                        >
                          {getStatusDescription(status)}
                        </p>
                        {isCurrent && order.updatedAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Updated:{" "}
                            {new Date(order.updatedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Estimated Delivery */}
          {order.estimatedDelivery && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">
                    Estimated Delivery
                  </h4>
                  <p className="text-sm text-blue-700">
                    Your order is estimated to arrive by{" "}
                    {new Date(order.estimatedDelivery).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tracking Number */}
          {order.trackingNumber && (
            <div className="border-t pt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Tracking Information
              </h4>
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Tracking Number
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {order.trackingNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    Carrier: {order.carrier || "Standard Shipping"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    // Open carrier tracking URL
                    window.open(
                      `https://tracking.carrier.com/${order.trackingNumber}`,
                      "_blank"
                    );
                  }}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                >
                  Track on Carrier Website
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Orders
          </h3>
          <div className="space-y-4">
            {recentOrders.map((recentOrder) => (
              <div
                key={recentOrder._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Order #
                    {recentOrder.orderNumber || recentOrder._id.substring(0, 8)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(recentOrder.createdAt).toLocaleDateString()} • $
                    {recentOrder.totalAmount?.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      recentOrder.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : recentOrder.status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : recentOrder.status === "approved"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {recentOrder.status}
                  </span>
                  <button
                    onClick={() =>
                      setTrackingId(recentOrder.orderNumber || recentOrder._id)
                    }
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Track
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
