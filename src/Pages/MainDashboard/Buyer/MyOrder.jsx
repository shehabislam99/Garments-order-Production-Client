import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaShoppingCart,
} from "react-icons/fa";
import { MdImage, MdPayment, MdCancel } from "react-icons/md";
import { BsCurrencyDollar } from "react-icons/bs";
import { HiOutlineClipboardList } from "react-icons/hi";
import useAuth from "../../../Hooks/useAuth";
import toast from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Components/Common/Loding/Loding";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [ordersPerPage] = useState(6);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    delivered: 0,
    cancelled: 0,
  });
const axiosSecure = useAxiosSecure()
  const { user } = useAuth();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get(
        `/my-orders?searchText=${searchTerm}&page=${
          currentPage + 1
        }&limit=${ordersPerPage}&status=${filterStatus}`
      );

      if (res.data && res.data?.success) {
        setOrders(res.data?.data || []);
        setTotalOrders(res.data?.total || 0);
        setTotalPages(
          res?.data?.totalPages ||
            Math.ceil((res.data?.total || 0) / ordersPerPage)
        );
      } else {
        setOrders([]);
        setTotalOrders(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
      setOrders([]);
      setTotalOrders(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderStats = async () => {
    try {
      const res = await axiosSecure.get("/my-orders/stats");

      if (res.data?.success) {
        setOrderStats(res.data.data);
      } else {
        // Calculate stats from current orders
        const stats = {
          totalOrders: orders.length,
          pending: orders.filter((o) => o.status === "pending").length,
          approved: orders.filter((o) => o.status === "approved").length,
          rejected: orders.filter((o) => o.status === "rejected").length,
          delivered: orders.filter((o) => o.status === "delivered").length,
          cancelled: orders.filter((o) => o.status === "cancelled").length,
        };
        setOrderStats(stats);
      }
    } catch (error) {
      console.error("Failed to load order statistics:", error);
      // Calculate from current orders
      const stats = {
        totalOrders: orders.length,
        pending: orders.filter((o) => o.status === "pending").length,
        approved: orders.filter((o) => o.status === "approved").length,
        rejected: orders.filter((o) => o.status === "rejected").length,
        delivered: orders.filter((o) => o.status === "delivered").length,
        cancelled: orders.filter((o) => o.status === "cancelled").length,
      };
      setOrderStats(stats);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, currentPage, searchTerm, filterStatus]);

  useEffect(() => {
    if (orders.length > 0) {
      fetchOrderStats();
    }
  }, [orders]);

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    try {
      setCancelling(true);
      const response = await axiosSecure.patch(
        `/my-orders/${selectedOrder._id}/cancel`
      );

      if (response.data.success) {
        setOrders(
          orders.map((order) =>
            order._id === selectedOrder._id
              ? { ...order, status: "cancelled" }
              : order
          )
        );
        toast.success("Order cancelled successfully");
        setCancelModalOpen(false);
        setSelectedOrder(null);
        fetchOrderStats(); // Refresh stats
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const openCancelModal = (order) => {
    setSelectedOrder(order);
    setCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setSelectedOrder(null);
    setCancelModalOpen(false);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setCurrentPage(0);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200";
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
      case "delivered":
        return <FaTruck className="mr-1" />;
      case "cancelled":
        return <MdCancel className="mr-1" />;
      default:
        return <FaBox className="mr-1" />;
    }
  };

  const getPaymentColor = (paymentStatus) => {
    switch (paymentStatus?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "refunded":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
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

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="p-3">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
          <p className="text-gray-600 text-sm mt-1">
            View and manage your orders
          </p>
        </div>
        <button
          onClick={() => {
            fetchOrders();
            fetchOrderStats();
          }}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Stats Summary */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Orders</p>
            <p className="text-2xl font-semibold text-gray-900">
              {orderStats.totalOrders}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-2xl font-semibold text-yellow-600">
              {orderStats.pending}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Approved</p>
            <p className="text-2xl font-semibold text-blue-600">
              {orderStats.approved}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Delivered</p>
            <p className="text-2xl font-semibold text-green-600">
              {orderStats.delivered}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Cancelled</p>
            <p className="text-2xl font-semibold text-gray-600">
              {orderStats.cancelled}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Spent</p>
            <p className="text-2xl font-semibold text-purple-600">
              {formatCurrency(
                orders.reduce(
                  (total, order) => total + (order.totalAmount || 0),
                  0
                )
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mt-4 bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          {(searchTerm || filterStatus !== "all") && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <FaTimes className="mr-1" />
              Clear Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
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
                placeholder="Search by order ID or product name..."
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loading className="h-8 w-8" />
          <span className="text-gray-600 ml-3">Loading orders...</span>
        </div>
      )}

      {/* Orders Table */}
      {!loading && (
        <>
          <div className="mt-4 bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr
                      key={order?._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Order ID */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <HiOutlineClipboardList className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              #
                              {order?.orderId ||
                                order?._id?.substring(18) ||
                                "N/A"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(order?.createdAt)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {order?.product?.image ? (
                            <img
                              className="h-10 w-10 rounded-md object-cover mr-3"
                              src={order.product.image}
                              alt={order.product.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center mr-3">
                              <MdImage className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order?.product?.name || "Unknown Product"}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <BsCurrencyDollar className="mr-1" />
                              {formatCurrency(order?.product?.price)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-center">
                          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {order?.quantity || 1}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full border ${getStatusColor(
                            order?.status
                          )}`}
                        >
                          {getStatusIcon(order?.status)}
                          {order?.status || "Pending"}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span
                            className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full border ${getPaymentColor(
                              order?.paymentStatus
                            )}`}
                          >
                            <MdPayment className="mr-1" />
                            {order?.paymentStatus || "Pending"}
                          </span>
                          {order?.totalAmount && (
                            <span className="text-xs text-gray-500">
                              {formatCurrency(order.totalAmount)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          {/* View Button */}
                          <Link
                            to={`/dashboard/order-details/${order._id}`}
                            className="flex items-center text-blue-600 hover:text-blue-800 hover:underline transition-all duration-300"
                            title="View Order Details"
                          >
                            <FaEye className="mr-1" />
                            View
                          </Link>

                          {/* Cancel Button - Only show for pending orders */}
                          {order?.status === "pending" && (
                            <button
                              onClick={() => openCancelModal(order)}
                              className="flex items-center text-red-600 hover:text-red-800 hover:underline transition-all duration-300"
                              title="Cancel Order"
                            >
                              <FaTimesCircle className="mr-1" />
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {orders.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <FaShoppingCart className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No orders found
                </h3>
                <p className="text-gray-500">
                  {user
                    ? "You haven't placed any orders yet."
                    : "Please login to view your orders."}
                </p>
                {!user && (
                  <Link
                    to="/login"
                    className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Login to View Orders
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* React Paginate Component */}
          {totalPages > 1 && (
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
                pageCount={totalPages}
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

              {/* Page info */}
              <div className="ml-0 md:ml-4 text-sm text-gray-700">
                Page <span className="font-medium">{currentPage + 1}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-center text-gray-900 mb-4">
                Cancel Order
              </h3>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  Are you sure you want to cancel this order?
                </p>
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="font-medium text-red-800">
                    Order: #
                    {selectedOrder?.orderId ||
                      selectedOrder?._id?.substring(18)}
                  </p>
                  <p className="text-sm text-red-600">
                    Product: {selectedOrder?.product?.name}
                  </p>
                  <p className="text-sm text-red-600">
                    Amount: {formatCurrency(selectedOrder?.totalAmount)}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  This action cannot be undone. Any payment will be refunded
                  according to our policy.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeCancelModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
                >
                  {cancelling ? "Cancelling..." : "Yes, Cancel Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
