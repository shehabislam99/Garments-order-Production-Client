import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaBox,
} from "react-icons/fa";
import toast from "react-hot-toast";
import ReactPaginate from "react-paginate";
import Loading from "../../../Components/Common/Loding/Loding";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [ordersPerPage] = useState(6);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/orders?status=pending");
      if (res.data?.success) {
        setOrders(res.data.data || []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      toast.error("Failed to load pending orders",error);
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
       toast.success("Order approved successfully");
       if (viewModalOpen) closeViewModal();
     } else {
       toast.error(res.data?.message || "Failed to approve order");
     }
   } catch (error) {
     console.error("Approve error:", error.response?.data || error.message);
     toast.error(error.response?.data?.message || "Failed to approve order");
   } finally {
     setApproving(false);
   }
 };

  const handleReject = async (orderId) => {
    const reason = window.prompt("Please provide a reason for rejection:");
    if (reason === null) return;
    if (!reason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      setRejecting(true);

      const res = await axiosSecure.put(`/order/status/${orderId}`, {
        status: "rejected",
        rejectionReason: reason,
        rejectedAt: new Date().toISOString(),
      });

      

      if (res.data?.success) {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
        toast.success("Order rejected successfully");
        if (viewModalOpen) closeViewModal();
      } else {
        toast.error(res.data?.message || "Failed to reject order");
      }
    } catch (error) {
      console.error("Reject error:", error);

      if (error.response) {
        toast.error(error.response.data?.message || "Server error occurred");
      } else if (error.request) {
        toast.error("No response from server");
      } else {
        toast.error("Error: " + error.message);
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

  const openViewModal = (order) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedOrder(null);
    setViewModalOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);

  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-3">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quanttity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Date
                </th>
                <th className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-amber-100 divide-y divide-gray-200">
              {paginatedOrders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    #{order.orderId.substring(0,10)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex text-sm font-semibold text-gray-900">
                      {order.customer?.firstName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.CustomerEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                      {order.product_name}
  
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                      {order.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openViewModal(order)}
                        className="px-3 py-1 flex items-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                      >
                        <FaEye className="mr-1" /> View
                      </button>
                      <button
                        onClick={() => handleApprove(order._id)}
                        disabled={approving}
                        className="px-3 py-1 flex items-center rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <FaCheckCircle className="mr-1" /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(order._id)}
                        disabled={rejecting}
                        className="px-3 py-1 flex items-center rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
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

        {orders.length === 0 && (
          <div className="text-center py-12 bg-amber-100">
            <FaBox className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No pending orders
            </h3>
          </div>
        )}
      </div>

      {Math.ceil(orders.length / ordersPerPage) > 1 && (
        <div className="flex justify-center mt-6">
          <ReactPaginate
            breakLabel="..."
            nextLabel={
              <div className="flex items-center">
                Next <FaChevronRight className="ml-1 h-3 w-3" />
              </div>
            }
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={Math.ceil(orders.length / ordersPerPage)}
            previousLabel={
              <div className="flex items-center">
                <FaChevronLeft className="mr-1 h-3 w-3" /> Previous
              </div>
            }
            containerClassName="flex items-center justify-center space-x-2"
            pageClassName="hidden sm:block"
            pageLinkClassName="px-3 py-1 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md border"
            activeLinkClassName="bg-blue-600 text-white border-blue-600 hover:text-white"
            previousClassName="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md border"
            nextClassName="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md border"
            disabledClassName="opacity-50 cursor-not-allowed"
          />
        </div>
      )}

      {viewModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  Order Details - #{selectedOrder.orderId}
                </h3>
                <button
                  onClick={closeViewModal}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <h4 className="font-bold flex items-center mb-2">
                    <FaUser className="mr-2" /> User Info
                  </h4>
                  <p className="text-sm">Name: {selectedOrder.user?.name}</p>
                  <p className="text-sm">Email: {selectedOrder.user?.email}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <h4 className="font-bold flex items-center mb-2">
                    <FaBox className="mr-2" /> Summary
                  </h4>
                  <p className="text-sm">
                    Total: {formatCurrency(selectedOrder.totalAmount)}
                  </p>
                  <p className="text-sm">
                    Date: {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleApprove(selectedOrder._id)}
                  disabled={approving}
                  className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50"
                >
                  {approving ? "Approving..." : "Confirm Approval"}
                </button>
                <button
                  onClick={() => handleReject(selectedOrder._id)}
                  disabled={rejecting}
                  className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50"
                >
                  {rejecting ? "Rejecting..." : "Reject Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingOrders;
