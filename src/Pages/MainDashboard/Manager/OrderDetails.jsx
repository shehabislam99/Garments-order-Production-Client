import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Loading from "../../../Components/Common/Loding/Loding";
import { FaArrowAltCircleLeft } from "react-icons/fa";
const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const res = await axiosSecure.get(`/order/${id}`);
      if (res.data.success) {
        setOrder(res?.data?.data);
        toast.success("Order details loaded successfully", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to load order details", {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loading></Loading>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link
            to="/dashboard/pending-orders"
            className="text-indigo-600 hover:text-red-800 flex gap-2"
          >
            <FaArrowAltCircleLeft className="mt-1" />
            Back to Orders
          </Link>

          <div className="text-center">
            {" "}
            <h1 className="text-3xl font-bold"> Order Details</h1>
            <p className="text-gray-700 font-medium my-2">
              Order Summary with product details
            </p>{" "}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <div className="custom-bg rounded-4xl shadow-sm border border-gray-200">
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
                    <span className="font-medium">
                      {order?.status || "N/A"}
                    </span>
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
            <div className="custom-bg rounded-4xl shadow-sm border border-gray-200">
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
            <div className="custom-bg rounded-4xl shadow-sm border border-gray-200">
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

            <div className="custom-bg rounded-4xl shadow-sm border border-gray-200">
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
      </div>
    </div>
  );
};

export default OrderDetails;
