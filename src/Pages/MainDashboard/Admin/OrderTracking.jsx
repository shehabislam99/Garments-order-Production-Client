import React, { useEffect, useState } from "react";
import {
  FaClock,
  FaTruck,
  FaArrowAltCircleLeft,
} from "react-icons/fa";
import {  MdLocationOn } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Components/Common/Loding/Loding";

const OrderTracking = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [order, setOrder] = useState(null);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (user && orderId) {
      fetchOrderTimeline();
    }
  }, [user, orderId]);

  const fetchOrderTimeline = async () => {
    try {
      setLoading(true);
      const timelineRes = await axiosSecure.get(
        `/admin/orderTracking/${orderId}`
      );

      if (timelineRes.data.success) {
        if (timelineRes.data.data.order) {
          setOrder(timelineRes.data.data.order);
        }

        if (timelineRes.data.data.timeline) {
          const processedTimeline = processTimelineData(
            timelineRes.data.data.timeline
          );
          setTrackingHistory(processedTimeline);
          toast.success("Order details and Traking history loaded successfully", {
            position: "top-center",
            autoClose: 2000,
          });
        } else {
          setTrackingHistory([]);
        }
      } else {
        toast.error("No Order and Tracking history found");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to load Order and Tracking  information");
    } finally {
      setLoading(false);
    }
  };

  const processTimelineData = (rawData) => rawData;

  const formatDate = (date) => {
    if (!date) return "Date not available";
    return new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getCurrentStep = () => {
    if (trackingHistory.length === 0) return null;

    const currentStep = trackingHistory.find(
      (item) => item.status === "current"
    );
    if (currentStep) return currentStep;

    const completedSteps = trackingHistory.filter(
      (item) => item.status === "completed"
    );
    return completedSteps.length > 0 ? completedSteps[0] : trackingHistory[0];
  };

  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  const currentStep = getCurrentStep();
 

  return (
    <div className="p-4 max-w-6xl mx-auto min-h-screen">
      <Link
        to="/dashboard/all-orders"
        className="text-indigo-600 hover:text-red-800 flex gap-2"
      >
        <FaArrowAltCircleLeft className="mt-1" /> Back to Orders
      </Link>

      <div className="flex justify-center items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Order Details & Tracking History
          </h2>
          <p className="text-gray-700 font-medium mt-2 text-center">
            Here is order details summary and Traking history
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-amber-100 rounded-4xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Order Summary
              </h2>
            </div>
            <div className="p-6">
              <div className=" p-4 bg-gray-50 rounded-4xl">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Id:</span>
                  <span className="font-medium">{order?._id || "N/A"}</span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-4xl">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium">{order?.status || "N/A"}</span>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-4xl">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className="font-medium">
                    {order?.paymentStatus || "N/A"}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-4xl">
                {" "}
                <div className="flex justify-between">
                  <span className="text-gray-600">Order At:</span>
                  <span className="font-medium">
                    {formatDate(order?.createdAt) || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-amber-100 rounded-4xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Product Summary
              </h2>
            </div>
            <div className="p-6">
              <div className="p-4 bg-gray-50 rounded-4xl">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product Name:</span>
                  <span className="font-medium">
                    {order?.product_name || "Unknown Product"}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-4xl">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">{order?.price || 0}</span>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-4xl">
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{order?.quantity || 0}</span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-4xl">
                {" "}
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="inline-flex text-lg font-bold text-purple-600">
                    {order?.totalPrice || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-amber-100 rounded-4xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Customer Information
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-4xl">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email :</span>
                    <span className="font-medium">
                      {order?.CustomerEmail || "Unknown Email"}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-4xl">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name :</span>
                    <span className="font-medium">
                      {order?.customer?.firstName || "Unknown Name"}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="p-4 bg-gray-50 rounded-4xl">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone :</span>
                      <span className="font-medium">
                        {order?.customer?.contactNumber || "Unknown Phone"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-4xl">
                  <span className="text-gray-600">Address: </span>
                  <span className=" font-medium">
                    {order?.customer?.address || "Unknown Address"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-100 rounded-4xl shadow-sm border border-gray-200 mb-3">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Payment Information
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-4xl">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method :</span>
                    <span className="font-medium">
                      {order?.payment_method || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-4xl">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status :</span>
                    <span className="font-medium">
                      {order?.paymentStatus || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-4xl">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600"> Trasn ID :</span>
                    <span className="text-xs font-medium ">
                      {order?.transactionId || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-4xl">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Paid At :</span>
                    <span className="text-xs font-medium">
                      {formatDate(order?.paidAt) || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-100 rounded-4xl shadow-lg p-6 mb-6">
        <div className="text-center mb-6">
          <h3 className="font-semibold text-xl text-gray-900 mb-1">
            Tracking History
          </h3>
        </div>

        {trackingHistory.length > 0 ? (
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 to-green-200" />

            <div className="space-y-8">
              {trackingHistory.map((track, idx) => (
                <div key={idx} className="relative flex group">
                  <div
                    className={`absolute left-8 -translate-x-1/2 h-5 w-5 rounded-full border-4 border-white z-10 flex items-center justify-center ${
                      track?.status === "current"
                        ? "bg-blue-600 animate-pulse ring-4 ring-blue-200"
                        : "bg-green-600"
                    }`}
                  >
                    {track?.status === "current" && (
                      <div className="h-2 w-2 bg-white rounded-full"></div>
                    )}
                  </div>

                  <div className="ml-12 w-full">
                    <div>
                      <div className="flex-1 pb-6">
                        <div className="bg-gray-50 rounded-4xl p-5 border border-gray-200 hover:border-blue-200 transition-colors">
                          <div className="flex items-center mb-3">
                            <span className="font-bold text-gray-900 text-lg">
                              {track?.step}
                            </span>
                            <span className="ml-auto text-sm font-semibold text-gray-500">
                              {formatDate(track?.date)}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-700 mb-2">
                            <MdLocationOn className="mr-1 w-5 h-5 text-violet-500" />
                            <span className="font-medium">
                              {track?.location || "Location not specified"}
                            </span>
                          </div>
                          <div className="mt-3 p-3 bg-white rounded-xl border-b-4 border-amber-400">
                            <p className="text-gray-900">
                              "{track?.Note || "No additional details"}"
                            </p>
                          </div>
                          {track?.status === "current" && (
                            <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                              <FaTruck className="mr-1" />
                              Currently Active
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FaClock className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Tracking Updates Pending
            </h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;