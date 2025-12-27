import React, { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaBox,
  FaCheckCircle,
  FaTruck,
  FaClock,
  FaWarehouse,
  FaClipboardCheck,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { BsClockHistory } from "react-icons/bs";
import { HiOutlineClipboardList } from "react-icons/hi";
import { TbTruckDelivery } from "react-icons/tb";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Components/Common/Loding/Loding";

/* ---------------- ICON MAP ---------------- */
const iconComponents = {
  cutting: <FaClipboardCheck />,
  sewing: <FaWarehouse />,
  finishing: <FaCheckCircle />,
  qc: <FaClipboardCheck />,
  packed: <FaBox />,
  shipped: <FaTruck />,
};

const TrackOrder = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [order, setOrder] = useState(null);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [estimatedDelivery, setEstimatedDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH ORDER ---------------- */
  useEffect(() => {
    if (user && orderId) {
      fetchOrder();
    }
  }, [user, orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get(`/track-order/${orderId}/timeline`);

      if (res.data.success) {
        const { order, trackingHistory } = res.data.data;
        setOrder(order);
        setTrackingHistory(trackingHistory || []);
        setEstimatedDelivery(
          order.estimatedDelivery ||
            new Date(
              new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000
            )
        );
      } else {
        toast.error("Failed to load order");
      }
    } catch (err) {
      toast.error("Unable to load tracking information");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- HELPERS ---------------- */
  const formatDate = (date) =>
    new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const getIcon = (name) => iconComponents[name] || <FaBox />;

  const getRemainingTime = (date) => {
    if (!date) return "Calculating...";
    const diff = new Date(date) - new Date();
    if (diff <= 0) return "Delivered";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return days > 0 ? `${days} days ${hours} hrs` : `${hours} hrs`;
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  /* ---------------- NOT FOUND ---------------- */
  if (!order) {
    return (
      <div className="p-6 text-center">
        <HiOutlineClipboardList className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold">Order Not Found</h3>
        <Link
          to="/dashboard/my-orders"
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Track Order</h2>
          <p className="text-sm text-gray-600">Follow your order progress</p>
        </div>
        <Link
          to="/dashboard/my-orders"
          className="flex items-center gap-2 text-sm bg-gray-100 px-4 py-2 rounded"
        >
          <FaChevronLeft /> Back
        </Link>
      </div>

      {/* ORDER SUMMARY */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="font-semibold mb-3">Order Summary</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <p>
            <strong>Order ID:</strong> {order.orderId}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Payment:</strong> {order.paymentStatus}
          </p>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="bg-white rounded-lg shadow p-5 mb-6">
        <div className="flex justify-between mb-6">
          <h3 className="font-semibold">Production & Shipping Timeline</h3>
          <span className="text-sm text-blue-600 flex items-center">
            <BsClockHistory className="mr-1" />
            Live
          </span>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

          <div className="space-y-8">
            {trackingHistory.map((item, idx) => (
              <div key={idx} className="relative flex">
                <div
                  className={`absolute left-4 -translate-x-1/2 h-4 w-4 rounded-full border-4 border-white ${
                    item.status === "current"
                      ? "bg-blue-500 animate-pulse"
                      : item.status === "completed"
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />

                <div className="ml-10 w-full">
                  <div
                    className={`p-4 rounded-lg border ${
                      item.status === "current"
                        ? "bg-blue-50 border-blue-200"
                        : item.status === "completed"
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between">
                      <div className="flex gap-3 items-center">
                        <div className="p-2 bg-gray-100 rounded-full">
                          {getIcon(item.icon)}
                        </div>
                        <div>
                          <p className="font-medium">{item.step}</p>
                          <p className="text-xs text-gray-500">
                            <MdLocationOn className="inline mr-1" />
                            {item.location}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatDate(item.date)}
                      </p>
                    </div>

                    {item.description && (
                      <p className="mt-2 text-sm text-gray-600">
                        {item.description}
                      </p>
                    )}

                    {item.status === "current" && (
                      <div className="mt-3 text-sm text-blue-700 flex items-center">
                        <FaClock className="mr-1" />
                        Currently in progress
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ESTIMATED DELIVERY */}
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <TbTruckDelivery className="mx-auto h-10 w-10 text-blue-600 mb-2" />
        <p className="text-xl font-bold">
          {getRemainingTime(estimatedDelivery)}
        </p>
        <p className="text-sm text-gray-600">
          Expected by {formatDate(estimatedDelivery)}
        </p>
      </div>
    </div>
  );
};

export default TrackOrder;
