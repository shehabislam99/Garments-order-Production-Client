import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaShoppingCart,
  FaUser,
  FaBox,
  FaSync,
} from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import toast from "react-hot-toast";
import ReactPaginate from "react-paginate";
import Loading from "../../../Components/Common/Loding/Loding";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [ordersPerPage] = useState(6);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/orders?status=pending");
      if (res.data && res.data.success) {
        setOrders(res.data.data || []);
        setTotalOrders(res.data.total || res.data.data?.length || 0);
        setTotalPages(
          Math.ceil(
            (res.data.total || res.data.data?.length || 0) / ordersPerPage
          )
        );
      } else {
        setOrders([]);
        setTotalOrders(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching pending orders:", error);
      toast.error("Failed to load pending orders");
      setOrders([]);
      setTotalOrders(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.[0]?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedOrders = filteredOrders.slice(
    currentPage * ordersPerPage,
    (currentPage + 1) * ordersPerPage
  );

  const handleApprove = async (orderId) => {
    try {
      setApproving(true);
      const response = await axiosSecure.put(`/orders/${orderId}/status`, {
        status: "approved",
        approvedAt: new Date().toISOString(),
      });

      if (response.data.success) {
        setOrders(orders.filter((order) => order._id !== orderId));
        toast.success("Order approved successfully");
      }
    } catch (error) {
      console.error("Error approving order:", error);
      toast.error(error?.response?.data?.message || "Failed to approve order");
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async (orderId) => {
    if (!window.confirm("Are you sure you want to reject this order?")) return;

    try {
      setRejecting(true);
      const response = await axiosSecure.put(`/orders/${orderId}/status`, {
        status: "rejected",
        rejectionReason: "Rejected by manager",
      });

      if (response.data.success) {
        setOrders(orders.filter((order) => order._id !== orderId));
        toast.success("Order rejected successfully");
      }
    } catch (error) {
      console.error("Error rejecting order:", error);
      toast.error(error?.response?.data?.message || "Failed to reject order");
    } finally {
      setRejecting(false);
    }
  };

  const openViewModal = (order) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedOrder(null);
    setViewModalOpen(false);
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCurrentPage(0);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <FaClock className="mr-1" />;
      case "approved":
        return <FaCheckCircle className="mr-1" />;
      case "rejected":
        return <FaTimesCircle className="mr-1" />;
      default:
        return <FaBox className="mr-1" />;
    }
  };

  const getPaymentColor = (paymentStatus) => {
    switch (paymentStatus?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "cod":
        return "bg-violet-100 text-violet-800 border-violet-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold ">Pending Orders</h2>
        <button
          onClick={fetchPendingOrders}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-red-800 transition-colors flex items-center disabled:opacity-50"
        >
          <FaSync className={`mr-2 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Filters Section */}
      <div className="mt-4 bg-amber-100 rounded-4xl shadow p-4">
        <div className="flex items-center justify-between mb-4">
          {searchTerm && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-red-800 flex items-center"
            >
              <FaTimes className="mr-1" />
              Clear Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Orders
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(0);
                }}
                placeholder="Search by Order ID, User, or Product..."
                className="pl-10 w-full px-3 py-2 border placeholder-green-500 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Order Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Status
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm bg-yellow-100">
              <div className="flex items-center justify-between">
                <span className="text-yellow-800 font-medium">
                  Pending Orders
                </span>
                <span className="px-2 py-1 text-xs font-bold rounded-full bg-yellow-200 text-yellow-900">
                  {orders.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loading className="h-8 w-8" />
          <span className="text-gray-600 ml-3">Loading pending orders...</span>
        </div>
      )}

      {!loading && (
        <>
          {/* Orders Table */}
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
                    <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-9 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Date
                    </th>
                    <th className="px-15 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      {/* Order ID */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              #
                              {order.orderId ||
                                order._id?.substring(18) ||
                                "N/A"}
                            </div>
                            <div className="text-xs text-gray-500">
                              <span
                                className={`px-2 py-1 inline-flex items-center text-xs rounded-full ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {getStatusIcon(order.status)}
                                {order.status || "Pending"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* User */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaUser className="h-8 w-8 text-gray-400 bg-gray-100 rounded-full p-2 mr-3" />
                          <div>
                            <div className="font-semibold text-gray-900">
                              {order.user?.name || "Unknown User"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.user?.email || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Product */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {order.items?.[0]?.image && (
                            <img
                              src={order.items[0].image}
                              alt={order.items[0].name}
                              className="h-10 w-10 rounded-full object-cover border border-gray-300 mr-3"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.items?.[0]?.name || "Unknown Product"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatCurrency(
                                order.items?.[0]?.price || order.totalAmount
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="px-8 py-4 whitespace-nowrap">
                        <div className="text-center">
                          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {order.items?.reduce(
                              (sum, item) => sum + (item.quantity || 1),
                              0
                            ) || 1}
                          </span>
                        </div>
                      </td>

                      {/* Order Date */}
                      <td className="px-9 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(order.createdAt || order.orderDate)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.paymentStatus && (
                            <span
                              className={`px-2 py-1 inline-flex items-center text-xs rounded-full ${getPaymentColor(
                                order.paymentStatus
                              )}`}
                            >
                              <MdPayment className="mr-1" />
                              {order.paymentStatus}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-15 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => openViewModal(order)}
                            className="px-3 py-1 flex items-center rounded-full bg-indigo-500 text-white hover:bg-red-800"
                            title="View Order Details"
                          >
                            <FaEye className="mr-1" />
                            View
                          </button>

                          <button
                            onClick={() => handleApprove(order._id)}
                            disabled={approving}
                            className="px-3 py-1 flex items-center rounded-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                            title="Approve Order"
                          >
                            <FaCheckCircle className="mr-1" />
                            {approving ? "Approving..." : "Approve"}
                          </button>

                          <button
                            onClick={() => handleReject(order._id)}
                            disabled={rejecting}
                            className="px-3 py-1 flex items-center rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                            title="Reject Order"
                          >
                            <FaTimesCircle className="mr-1" />
                            {rejecting ? "Rejecting..." : "Reject"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <FaShoppingCart className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No pending orders found
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Try changing your search criteria"
                    : "All orders have been processed"}
                </p>
                {searchTerm && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-red-800"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {Math.ceil(filteredOrders.length / ordersPerPage) > 1 && (
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
                pageCount={Math.ceil(filteredOrders.length / ordersPerPage)}
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
                pageLinkClassName="px-3 py-1 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                activeClassName="hidden sm:block"
                activeLinkClassName="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                previousClassName="px-3 py-1 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md border border-gray-300"
                previousLinkClassName="flex items-center px-2 py-1"
                nextClassName="px-3 py-1 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md border border-gray-300"
                nextLinkClassName="flex items-center px-2 py-1"
                breakClassName="hidden sm:block"
                breakLinkClassName="px-3 py-1 text-sm font-medium text-gray-700"
                disabledClassName="opacity-50 cursor-not-allowed"
                disabledLinkClassName="text-gray-400 hover:text-gray-400 hover:bg-transparent"
              />

              <div className="ml-0 md:ml-4 text-sm text-gray-700">
                Page <span className="font-medium">{currentPage + 1}</span> of{" "}
                <span className="font-medium">
                  {Math.ceil(filteredOrders.length / ordersPerPage)}
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {/* View Order Modal */}
      {viewModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Order Details - #
                  {selectedOrder.orderId || selectedOrder._id?.substring(18)}
                </h3>
                <button
                  onClick={closeViewModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="bg-amber-50 rounded-2xl p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Customer Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FaUser className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium">
                          {selectedOrder.user?.name || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedOrder.user?.email || "N/A"}
                        </p>
                      </div>
                    </div>
                    {selectedOrder.user?.phone && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Phone:</span>{" "}
                        {selectedOrder.user.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Status */}
                <div className="bg-amber-50 rounded-2xl p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Order Status
                  </h4>
                  <div className="space-y-2">
                    <span
                      className={`px-4 py-2 inline-flex items-center text-base font-semibold rounded-full ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status || "Pending"}
                    </span>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Order Date:</span>{" "}
                      {formatDate(selectedOrder.createdAt)}
                    </p>
                    {selectedOrder.paymentStatus && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Payment:</span>
                        <span
                          className={`ml-2 px-2 py-1 inline-flex items-center text-xs rounded-full ${getPaymentColor(
                            selectedOrder.paymentStatus
                          )}`}
                        >
                          <MdPayment className="mr-1" />
                          {selectedOrder.paymentStatus}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Order Items
                </h4>
                <div className="bg-amber-50 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-amber-200">
                      <thead className="bg-amber-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-amber-800 uppercase">
                            Product
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-amber-800 uppercase">
                            Quantity
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-amber-800 uppercase">
                            Price
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-amber-800 uppercase">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-200">
                        {selectedOrder.items?.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-10 w-10 rounded-full object-cover mr-3"
                                  />
                                )}
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {item.name}
                                  </p>
                                  {item.description && (
                                    <p className="text-xs text-gray-500">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                                {item.quantity || 1}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {formatCurrency(item.price)}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                              {formatCurrency(
                                (item.price || 0) * (item.quantity || 1)
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="mt-6 bg-amber-50 rounded-2xl p-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Order Summary
                  </h4>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(selectedOrder.totalAmount)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total Items:{" "}
                      {selectedOrder.items?.reduce(
                        (sum, item) => sum + (item.quantity || 1),
                        0
                      ) || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              {selectedOrder.shippingAddress && (
                <div className="mt-6 bg-amber-50 rounded-2xl p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Shipping Address
                  </h4>
                  <p className="text-gray-700">
                    {selectedOrder.shippingAddress.street},<br />
                    {selectedOrder.shippingAddress.city},{" "}
                    {selectedOrder.shippingAddress.state}
                    <br />
                    {selectedOrder.shippingAddress.zipCode},{" "}
                    {selectedOrder.shippingAddress.country}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={closeViewModal}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-full"
                >
                  Close
                </button>
                <button
                  onClick={() => handleApprove(selectedOrder._id)}
                  disabled={approving}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-full disabled:opacity-50"
                >
                  {approving ? "Approving..." : "Approve Order"}
                </button>
                <button
                  onClick={() => handleReject(selectedOrder._id)}
                  disabled={rejecting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-full disabled:opacity-50"
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
