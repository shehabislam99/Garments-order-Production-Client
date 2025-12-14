import React, { useState, useEffect } from "react";
import axiosInstance from "../../../Hooks/useAxios";

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/orders?status=pending");
      setOrders(response.data.data || []);
    } catch (error) {
      setError("Failed to fetch pending orders");
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (orderId) => {
    try {
      const response = await axiosInstance.put(`/orders/${orderId}/status`, {
        status: "approved",
      });

      if (response.data.success) {
        setOrders(orders.filter((order) => order._id !== orderId));
        setSuccess("Order approved successfully");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      setError("Failed to approve order");
      console.error("Error approving order:", error);
    }
  };

  const handleReject = async (orderId) => {
    if (window.confirm("Are you sure you want to reject this order?")) {
      try {
        const response = await axiosInstance.put(`/orders/${orderId}/status`, {
          status: "rejected",
          rejectionReason: "Rejected by manager",
        });

        if (response.data.success) {
          setOrders(orders.filter((order) => order._id !== orderId));
          setSuccess("Order rejected successfully");
          setTimeout(() => setSuccess(""), 3000);
        }
      } catch (error) {
        setError("Failed to reject order");
        console.error("Error rejecting order:", error);
      }
    }
  };

  const getTotalItems = (order) => {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pending Orders</h2>
        <div className="text-sm text-gray-500">
          {orders.length} pending order{orders.length !== 1 ? "s" : ""}
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No pending orders
          </h3>
          <p className="text-gray-500">All orders have been processed</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Order #{order.orderNumber || order._id.substring(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()} at{" "}
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Customer Details
                  </h4>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Name:</span>{" "}
                      {order.customer?.name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span>{" "}
                      {order.customer?.email || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Phone:</span>{" "}
                      {order.customer?.phone || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Order Summary
                  </h4>
                  <div className="space-y-2">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600 truncate">
                          {item.name}
                        </span>
                        <span className="text-gray-800 font-medium">
                          {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="text-sm text-gray-500 text-center">
                        +{order.items.length - 3} more items
                      </div>
                    )}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 font-medium">
                          Total Items:
                        </span>
                        <span className="text-gray-800">
                          {getTotalItems(order)}
                        </span>
                      </div>
                      <div className="flex justify-between text-base mt-1">
                        <span className="text-gray-800 font-bold">
                          Total Amount:
                        </span>
                        <span className="text-gray-900 font-bold">
                          ${parseFloat(order.totalAmount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Shipping Address
                  </h4>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress?.street},{" "}
                    {order.shippingAddress?.city},{" "}
                    {order.shippingAddress?.state}{" "}
                    {order.shippingAddress?.zipCode}
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleApprove(order._id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(order._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingOrders;
