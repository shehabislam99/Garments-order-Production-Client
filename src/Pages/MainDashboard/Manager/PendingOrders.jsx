import React, { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaBox,
} from "react-icons/fa";
import toast from "react-hot-toast";
import ReactPaginate from "react-paginate";
import Loading from "../../../Components/Common/Loding/Loding";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import useAuth from "../../../Hooks/useAuth";

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [ordersPerPage] = useState(6);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const navigate = useNavigate();
   const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
     fetchPendingOrders();
  }, []);

  useEffect(() => {
    const UserSuspended = async () => {
      if (!user) {
        toast.error("Please login to place an order");
        navigate("/login");
        return;
      }

      try {
        const res = await axiosSecure.get("/users?status=suspended");
        const suspended = res.data?.data || [];
        const isSuspended = suspended.find((u) => u.email === user.email);

        if (isSuspended) {
          toast.error("Your account is suspended. You cannot approve or reject order");
          navigate("/dashboard/profile");
          return;
        }
      } catch (err) {
        toast.error("Failed to verify user status", err);
        navigate("/dashboard/profile");
        return;
      }
    };

    UserSuspended();
  }, [user, navigate, axiosSecure]);


  const fetchPendingOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/orders?status=pending");
      if (res.data?.success) {
        setOrders(res.data?.data || []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      toast.error("Failed to load pending orders", error, {
        position: "top-center",
        autoClose: 2000,
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (orderId) => {
 
    try {
      setApproving(true);
      const res = await axiosSecure.put(`/orders/status/${orderId}`, {
        status: "approved",
        approvedAt: new Date().toISOString(),
      });
      if (res.data?.success) {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
        toast.success("Order approved successfully", {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        toast.error(res.data?.message || "Failed to approve order", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Approve error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to approve order", {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async (orderId) => {

    const reason = window.prompt("Please provide a reason for rejection:");
    if (reason === null) return;
    if (!reason.trim()) {
      toast.error("Please provide a rejection reason", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      setRejecting(true);
      const res = await axiosSecure.put(`/orders/status/${orderId}`, {
        status: "rejected",
        rejectionReason: reason,
        rejectedAt: new Date().toISOString(),
      });

      if (res.data?.success) {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
        toast.success("Order rejected successfully");
      } else {
        toast.error(res.data?.message || "Failed to reject order", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Reject error:", error);

      if (error.response) {
        toast.error(error.response.data?.message || "Server error occurred", {
          position: "top-center",
          autoClose: 2000,
        });
      } else if (error.request) {
        toast.error("No response from server", {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        toast.error("Error: " + error.message, {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } finally {
      setRejecting(false);
    }
  };



  const paginatedOrders = orders.slice(
    currentPage * ordersPerPage,
    (currentPage + 1) * ordersPerPage
  );

  const handlePageClick = (event) => setCurrentPage(event.selected);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPaymentColor = (payment_Status) => {
    const paymentStatus = payment_Status?.toString?.().toLowerCase() || "";
    switch (paymentStatus) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "cod":
        return "bg-violet-100 text-purple-800 border-violet-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const pageCount = Math.ceil(orders.length / ordersPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-3 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pending Orders</h2>
        <button
          onClick={fetchPendingOrders}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-red-800 transition-colors flex items-center disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="mt-4 bg-white rounded-4xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase  whitespace-nowrap">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase  whitespace-nowrap">
                  Order Date
                </th>
                <th className="px-13 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-amber-100 divide-y divide-gray-200">
              {paginatedOrders.map((order) => (
                <tr
                  key={order?._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="items-center">
                      <div className="text-sm font-semibold text-gray-900">
                        #{order?._id?.substring(0, 12) || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="inline-flex text-sm font-semibold text-violet-500">
                      {order?.customer?.firstName || "Unknown"}
                    </div>
                    <div className="text-xs text-gray-600">
                      {order?.CustomerEmail || "No Email"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                      {order?.product_name || "Unnamed Product"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                      {order?.quantity || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full border ${getPaymentColor(
                        order?.paymentStatus
                      )}`}
                    >
                      {order?.paymentStatus || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="items-center">
                      <div className="font-medium text-gray-600">
                        {formatDate(order?.createdAt || "N/A")}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/order-details/${order?._id}`)
                        }
                        className="px-2 py-1 flex items-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                      >
                        <FaEye className="mr-1" /> View Order
                      </button>
                      <button
                        onClick={() => handleApprove(order?._id)}
                        disabled={approving}
                        className="px-2 py-1 flex items-center rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <FaCheckCircle className="mr-1" /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(order?._id)}
                        disabled={rejecting}
                        className="px-2 py-1 flex items-center rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        <FaTimesCircle className="mr-1" /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders?.length === 0 && (
          <div className="text-center py-12 bg-amber-100">
            <FaBox className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No pending orders
            </h3>
          </div>
        )}
      </div>

      {pageCount > 1 && (
        <div className="flex flex-col md:flex-row justify-center items-center mt-6">
          <ReactPaginate
            breakLabel="..."
            nextLabel={
              <div className="flex items-center">
                Next
                <FaChevronRight className="ml-1 h-3 w-3" />
              </div>
            }
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            forcePage={currentPage}
            previousLabel={
              <div className="flex items-center">
                <FaChevronLeft className="mr-1 h-3 w-3" />
                Previous
              </div>
            }
            renderOnZeroPageCount={null}
            containerClassName="flex items-center justify-center space-x-1 md:space-x-2 mb-4 md:mb-0"
            pageClassName="hidden sm:block"
            pageLinkClassName="px-3 py-1 text-sm font-medium text-gray-700 rounded-full transition-colors hover:bg-gray-100"
            activeClassName="hidden sm:block"
            activeLinkClassName="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700"
            previousClassName="px-3 py-1 text-sm font-medium text-white bg-green-800 hover:bg-red-800 rounded-full border border-gray-300 transition-colors"
            previousLinkClassName="flex items-center px-2 py-1"
            nextClassName="px-3 py-1 text-sm font-medium text-white bg-green-800 hover:bg-red-800 rounded-full border border-gray-300 transition-colors"
            nextLinkClassName="flex items-center px-2 py-1"
            breakClassName="hidden sm:block"
            breakLinkClassName="px-3 py-1 text-sm font-medium text-gray-700 rounded-full hover:bg-gray-100"
            disabledClassName="opacity-50 cursor-not-allowed"
            disabledLinkClassName="text-gray-400 hover:text-gray-400 hover:bg-transparent"
          />
        </div>
      )}
    </div>
  );
};

export default PendingOrders;
