import React, { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaTruck,
  FaBox,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaShippingFast,
  FaWarehouse,
  FaClipboardCheck,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { MdLocationOn,  } from "react-icons/md";
import {  BsClockHistory } from "react-icons/bs";
import { HiOutlineClipboardList, HiLocationMarker } from "react-icons/hi";
import { TbTruckDelivery } from "react-icons/tb";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../../Components/Common/Loader/Loader";

// Icon mapping object
const iconComponents = {
  FaClipboardCheck: <FaClipboardCheck className="h-5 w-5" />,
  FaWarehouse: <FaWarehouse className="h-5 w-5" />,
  FaCheckCircle: <FaCheckCircle className="h-5 w-5" />,
  FaTruck: <FaTruck className="h-5 w-5" />,
  FaShippingFast: <FaShippingFast className="h-5 w-5" />,
  FaBox: <FaBox className="h-5 w-5" />,
};

const TrackOrder = () => {
  const [order, setOrder] = useState(null);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [estimatedDelivery, setEstimatedDelivery] = useState(null);

  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { orderId } = useParams();

  useEffect(() => {
    if (user && orderId) {
      fetchOrderDetails();
    }
  }, [user, orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);

      const response = await axiosSecure.get(`/track-order/${orderId}`);

      if (response.data.success) {
        const { order, trackingHistory } = response.data.data;

        setOrder(order);
        setTrackingHistory(trackingHistory);
        setCurrentLocation(
          order.currentLocation || {
            city: "Processing Center",
            country: "Unknown",
          }
        );
        setEstimatedDelivery(
          order.estimatedDelivery ||
            new Date(
              new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000
            )
        );
      } else {
        toast.error(response.data.message || "Failed to load order details");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to load order tracking information"
      );
      setLoading(false);
    }
  };

  // Get icon component from string
  const getIconComponent = (iconName) => {
    return iconComponents[iconName] || <FaBox className="h-5 w-5" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeRemaining = (deliveryDate) => {
    if (!deliveryDate) return "Calculating...";
    const now = new Date();
    const delivery = new Date(deliveryDate);
    const diffTime = delivery - now;

    if (diffTime <= 0) return "Delivered";

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (diffDays > 0) return `${diffDays} days ${diffHours} hours`;
    return `${diffHours} hours`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "completed":
        return "text-green-600 bg-green-100";
      case "shipped":
      case "current":
        return "text-blue-600 bg-blue-100";
      case "processing":
        return "text-yellow-600 bg-yellow-100";
      case "pending":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "Completed";
      case "current":
        return "In Progress";
      case "pending":
        return "Upcoming";
      default:
        return "Unknown";
    }
  };

  // Real map integration (using Google Maps)
  const LocationMap = () => {
    const [mapUrl, setMapUrl] = useState("");

    useEffect(() => {
      if (currentLocation?.latitude && currentLocation?.longitude) {
        // Generate Google Maps static image URL
        const apiKey = import.meta.env.VITE_google_map_key;
        const url = `https://maps.googleapis.com/maps/api/staticmap?center=${currentLocation.latitude},${currentLocation.longitude}&zoom=12&size=600x300&markers=color:red%7C${currentLocation.latitude},${currentLocation.longitude}&key=${apiKey}`;
        setMapUrl(url);
      }
    }, [currentLocation]);

    if (!currentLocation?.latitude || !currentLocation?.longitude) {
      return (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Location Tracking
          </h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Location data not available</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Current Location
          </h3>
          <span className="flex items-center text-sm text-blue-600">
            <FaMapMarkerAlt className="mr-1" />
            Live Tracking
          </span>
        </div>

        <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
          {mapUrl ? (
            <img
              src={mapUrl}
              alt="Package Location"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="h-32 w-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                    <HiLocationMarker className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 animate-pulse">
                    <FaTruck className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-medium text-gray-900">
                    {currentLocation?.city}, {currentLocation?.country}
                  </p>
                  <p className="text-sm text-gray-600">Loading map...</p>
                </div>
              </div>
            </div>
          )}

          <div className="absolute bottom-4 right-4 flex space-x-2">
            <a
              href={`https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white rounded-full shadow hover:bg-gray-50 flex items-center justify-center"
            >
              <span className="text-sm">🗺️</span>
            </a>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-600">Carrier</p>
            <p className="font-medium">
              {order?.carrier || "Express Logistics"}
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-gray-600">Tracking Number</p>
            <p className="font-medium">{order?.trackingNumber || "N/A"}</p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="h-16 w-16" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-3">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <HiOutlineClipboardList className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Order Not Found
          </h3>
          <p className="text-gray-500 mb-4">
            The order you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Link
            to="/dashboard/my-orders"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Track Order</h2>
          <p className="text-gray-600 text-sm mt-1">
            Monitor your order's journey from factory to your doorstep
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to="/dashboard/my-orders"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <FaChevronLeft className="mr-2" />
            Back to Orders
          </Link>
        </div>
      </div>

      {/* Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Order Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{order.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order Date:</span>
              <span className="font-medium">{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.paymentStatus === "paid"
                    ? "text-green-600 bg-green-100"
                    : "text-red-600 bg-red-100"
                }`}
              >
                {order.paymentStatus?.charAt(0).toUpperCase() +
                  order.paymentStatus?.slice(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-medium">
                ${parseFloat(order.totalAmount).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Product Information
          </h3>
          <div className="flex items-center">
            <img
              src={order.product?.image}
              alt={order.product?.name}
              className="h-16 w-16 rounded-md object-cover mr-4"
            />
            <div>
              <p className="font-medium text-gray-900">{order.product?.name}</p>
              <p className="text-sm text-gray-600">
                Quantity: {order.quantity}
              </p>
              {order.product?.size && (
                <p className="text-sm text-gray-600">
                  Size: {order.product.size}
                </p>
              )}
              {order.product?.color && (
                <p className="text-sm text-gray-600">
                  Color: {order.product.color}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Delivery Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <MdLocationOn className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">{order.shippingAddress?.name}</p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress?.street}
                </p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                  {order.shippingAddress?.zipCode}
                </p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress?.country}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <FaPhone className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm">{order.shippingAddress?.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Production & Shipping Timeline
              </h3>
              <div className="flex items-center text-sm text-blue-600">
                <BsClockHistory className="mr-1" />
                Updated in real-time
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              {/* Timeline items */}
              <div className="space-y-8">
                {trackingHistory.map((item, index) => (
                  <div key={index} className="relative flex items-start">
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-6 transform -translate-x-1/2 z-10 ${
                        item.status === "completed"
                          ? "bg-green-500"
                          : item.status === "current"
                          ? "bg-blue-500 animate-pulse"
                          : "bg-gray-300"
                      } h-4 w-4 rounded-full border-4 border-white`}
                    ></div>

                    {/* Content */}
                    <div className="ml-12 flex-1">
                      <div
                        className={`p-4 rounded-lg border ${
                          item.status === "current"
                            ? "border-blue-200 bg-blue-50"
                            : item.status === "completed"
                            ? "border-green-200 bg-green-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <div
                                className={`p-2 rounded-full ${
                                  item.status === "completed"
                                    ? "bg-green-100 text-green-600"
                                    : item.status === "current"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-gray-100 text-gray-600"
                                } mr-3`}
                              >
                                {getIconComponent(item.icon)}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {item.step}
                                </h4>
                                <div className="flex items-center mt-1">
                                  <MdLocationOn className="h-3 w-3 text-gray-400 mr-1" />
                                  <span className="text-xs text-gray-600">
                                    {item.location}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="mt-2 text-sm text-gray-600">
                              {item.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : item.status === "current"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {getStatusText(item.status)}
                            </span>
                            <p className="mt-2 text-xs text-gray-500">
                              {formatShortDate(item.date)}
                            </p>
                          </div>
                        </div>

                        {/* Additional info for current step */}
                        {item.status === "current" && (
                          <div className="mt-3 pt-3 border-t border-blue-200">
                            <div className="flex items-center text-sm text-blue-700">
                              <FaClock className="mr-1" />
                              <span>
                                Estimated completion:{" "}
                                {getTimeRemaining(estimatedDelivery)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map and Delivery Info */}
        <div className="space-y-6">
          <LocationMap />

          {/* Estimated Delivery Card */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Estimated Delivery
            </h3>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-green-400 to-blue-500 mb-4">
                <TbTruckDelivery className="h-10 w-10 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                {getTimeRemaining(estimatedDelivery)}
              </p>
              <p className="text-sm text-gray-600">
                Expected by {formatDate(estimatedDelivery)}
              </p>
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <FaClock className="inline mr-1" />
                  Delivery window: 9:00 AM - 6:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Support Card */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Need Help?
            </h3>
            <div className="space-y-3">
              <a
                href="tel:+18001234567"
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <FaPhone className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Call Support</p>
                  <p className="text-sm text-gray-600">+1 (800) 123-4567</p>
                </div>
              </a>
              <a
                href="mailto:support@example.com"
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <FaEnvelope className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Email Support</p>
                  <p className="text-sm text-gray-600">support@example.com</p>
                </div>
              </a>
              <Link
                to="/dashboard/my-orders"
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <HiOutlineClipboardList className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Order History</p>
                  <p className="text-sm text-gray-600">View all your orders</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Information */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Tracking Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-600 uppercase">Tracking Number</p>
            <p className="font-medium text-lg">
              {order.trackingNumber || "Not assigned"}
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-gray-600 uppercase">Carrier</p>
            <p className="font-medium text-lg">
              {order.carrier || "Pending assignment"}
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-xs text-gray-600 uppercase">Service Level</p>
            <p className="font-medium text-lg">Express Delivery</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-gray-600 uppercase">Last Update</p>
            <p className="font-medium text-lg">
              {formatShortDate(order.updatedAt || order.createdAt)}
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">
            Tracking Instructions:
          </h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>
              You can also track your package on the carrier's website using the
              tracking number above
            </li>
            <li>For real-time updates, download the carrier's mobile app</li>
            <li>
              If there are any delays, you'll receive an email notification
            </li>
            <li>Signature may be required upon delivery</li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-white rounded-lg shadow">
        <div className="mb-4 sm:mb-0">
          <p className="text-sm text-gray-600">
            Questions about your order? We're here to help!
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Print Tracking
          </button>
          <button
            onClick={() => {
              const shareText = `Track my order ${order.orderId}: ${window.location.href}`;
              navigator.clipboard.writeText(shareText);
              toast.success("Tracking link copied to clipboard!");
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Share Tracking
          </button>
          <button
            onClick={fetchOrderDetails}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
