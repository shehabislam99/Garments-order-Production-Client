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

const TrackOrder = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
    const [order, setOrder] = useState(null);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const standardSteps = [
    "Cutting Completed",
    "Sewing Started",
    "Finishing",
    "QC Checked",
    "Packed",
    "Shipped",
    "Out for Delivery",
  ];

  useEffect(() => {
    if (user && orderId) {
      fetchOrderTimeline();
    }
  }, [user, orderId]);

  const fetchOrderTimeline = async () => {
    try {
      setLoading(true);
      const timelineRes = await axiosSecure.get(
        `/track-order/timeline/${orderId}`
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
           toast.success("tracking and Order details loaded successfully", {
             position: "top-center",
             autoClose: 2000,
           });
         } else {
           setTrackingHistory([]);
         }
       } else {
         toast.error("No tracking history found");
       }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to load order information");
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

  const getProgressPercentage = () => {
    if (trackingHistory.length === 0) return 0;

    const totalSteps = standardSteps.length;
    const currentStep = getCurrentStep();

    if (!currentStep) return 0;

    const currentStepIndex = standardSteps.findIndex((step) =>
      currentStep.step.toLowerCase().includes(step.toLowerCase().split(" ")[0])
    );

    return Math.max(
      10,
      Math.min(100, ((currentStepIndex + 1) / totalSteps) * 100)
    );
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  const currentStep = getCurrentStep();
  const progressPercentage = getProgressPercentage();

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Link
        to="/dashboard/my-orders"
        className="text-indigo-600 hover:text-red-800 flex gap-2"
      >
        <FaArrowAltCircleLeft className="mt-1" /> Back to Orders
      </Link>

      <div className="flex justify-center items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Order Tracking</h2>
          <p className="text-gray-700 font-medium mt-2 text-center">
            Here is summary of order and Production progress
          </p>
        </div>
      </div>

      <div className="bg-amber-100 rounded-4xl shadow-lg p-6 mb-8">
        <h3 className="font-semibold text-center text-xl mb-4 text-gray-900">
          Order Summary
        </h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <p className="text-gray-600 mb-2 text-sm">Order ID</p>
            <p className="font-medium text-lg text-gray-900">
              {orderId?.substring(0, 12) || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-2 text-sm">Current Status</p>
            <span className="inline-block text-violet-600 uppercase text-sm font-semibold">
              {currentStep?.step || "Processing"}
            </span>
          </div>
          <div>
            <p className="text-gray-600 mb-2 text-sm">Payment Status</p>
            <span className="inline-block  text-sm font-semibold text-green-600">
              {order?.paymentStatus?.toUpperCase() || "PENDING"}
            </span>
          </div>
          <div>
            <p className="text-gray-600 mb-2 text-sm">Order Date</p>
            <p className="font-medium text-gray-900">
              {formatDate(order?.createdAt || new Date())}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-700 font-medium">Production Progress</p>
            <p className="text-blue-600 font-bold">
              {Math.round(progressPercentage)}%
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Order Placed</span>
            <span>Cutting & Sewing</span>
            <span>Packing</span>
            <span>Shipping & Delivery</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-amber-100 rounded-4xl shadow-lg p-6 mb-6">
            <div className="text-center mb-6">
              <h3 className="font-semibold text-xl text-gray-900 mb-1">
                Production Tracking Timeline
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

        <div className="space-y-6">
          <div className="bg-amber-100 rounded-4xl shadow-lg p-6">
            <div className="flex justify-center items-center gap-3 mb-4">
              <h3 className="font-semibold  text-lg text-gray-900">
                Current Step
              </h3>
            </div>
            {currentStep ? (
              <div className="p-6">
                <div className=" p-4 bg-gray-50 rounded-4xl">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product Now:</span>
                    <span className="font-medium">
                      {currentStep?.step || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-4xl">
                  <div className="">
                    <span className="text-gray-600">Note: </span>
                    <span className="font-medium">
                      {currentStep?.Note || "Progressing as planned"}
                    </span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-4xl">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Timeline Created:</span>
                    <span className="font-medium">
                      {formatDate(currentStep?.date) || new Date()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">Awaiting first update...</p>
              </div>
            )}
          </div>

          <div className="bg-amber-100 rounded-4xl shadow-lg p-6">
            <h3 className="font-semibold text-center text-xl text-gray-900 mb-4">
              Next Steps
            </h3>
            <div className="space-y-3">
              {standardSteps
                .filter((step) => {
                  if (!currentStep) return true;
                  const stepIndex = standardSteps.indexOf(step);
                  const currentStepIndex = standardSteps.findIndex((s) =>
                    currentStep?.step
                      ?.toLowerCase()
                      .includes(s.toLowerCase().split(" ")[0])
                  );
                  return stepIndex > currentStepIndex;
                })
                .slice(0, 3)
                .map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {step || "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
