import React, { useState, useEffect } from "react";
import { FaBox, FaCheckCircle, FaClock, FaEye, FaSearch, FaShoppingCart, FaTimes, FaTimesCircle, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { BsCurrencyDollar } from "react-icons/bs";
import { HiOutlineClipboardList } from "react-icons/hi";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import Loading from "../../../Components/Common/Loding/Loding";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [ordersPerPage] = useState(6);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    delivered: 0,
    cancelled: 0,
  });

  const axiosSecure = useAxiosSecure();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get(
        `/orders?searchText=${searchTerm}&page=${
          currentPage + 1
        }&limit=${ordersPerPage}&status=${filterStatus}`
      );

      if (res.data && res.data?.success) {
        setOrders(res.data?.data || []);
        setTotalPages(
          res?.data?.totalPages ||
            Math.ceil((res.data?.total || 0) / ordersPerPage)
        );
      } else {
        setOrders([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
      setOrders([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderStats = async () => {
    try {
      const res = await axiosSecure.get("admin/order/orders");

      if (res.data?.success) {
        setOrderStats(res.data.data);
      } else {
        setOrderStats({
          totalOrders: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          delivered: 0,
          cancelled: 0,
        });
      }
    } catch (error) {
      console.error("Failed to load order statistics:", error);
      setOrderStats({
        totalOrders: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        delivered: 0,
        cancelled: 0,
      });
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchOrderStats();
  }, [currentPage, searchTerm, filterStatus]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axiosSecure.patch(
        `/admin/orders/status/${orderId}`,
        {
          status: newStatus,
        }
      );

      if (response.data.success) {
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrderStats(); // Refresh stats
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
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
      default:
        return <FaBox className="mr-1" />;
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

  const statusOptions = [
    { value: "pending", label: "Pending", color: "text-yellow-600" },
    { value: "approved", label: "Approved", color: "text-blue-600" },
    { value: "rejected", label: "Rejected", color: "text-red-600" },
    { value: "delivered", label: "Delivered", color: "text-green-600" },
    { value: "cancelled", label: "Cancelled", color: "text-gray-600" },
  ];

  return (
    <div className="p-3">
      <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">All Orders</h2>
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
      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <p className="text-sm font-medium text-gray-600">Rejected</p>
            <p className="text-2xl font-semibold text-red-600">
              {orderStats.rejected}
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
                placeholder="Search by order ID, user, or product..."
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
              <option value="all">All Status</option>
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
                      User
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

                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {order?.user?.photoURL ? (
                              <img
                                className="h-8 w-8 rounded-full"
                                src={order.user.photoURL}
                                alt={order.user.name}
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <FaUser className="h-4 w-4 text-blue-600" />
                              </div>
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {order?.user?.name || "Unknown User"}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <MdEmail className="mr-1" />
                              {order?.user?.email || "No email"}
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
                              <FaShoppingCart className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order?.product?.name || "Unknown Product"}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <BsCurrencyDollar className="mr-1" />$
                              {parseFloat(order?.product?.price || 0).toFixed(
                                2
                              )}
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
                        <div className="flex flex-col space-y-2">
                          <span
                            className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full border ${getStatusColor(
                              order?.status
                            )}`}
                          >
                            {getStatusIcon(order?.status)}
                            {order?.status || "Pending"}
                          </span>
                          {order?.status !== "pending" && (
                            <select
                              value={order?.status}
                              onChange={(e) =>
                                handleUpdateOrderStatus(
                                  order._id,
                                  e.target.value
                                )
                              }
                              className="text-xs border border-gray-300 rounded px-2 py-1"
                            >
                              {statusOptions.map((status) => (
                                <option key={status.value} value={status.value}>
                                  {status.label}
                                </option>
                              ))}
                            </select>
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

                          {/* Quick Actions */}
                          {order?.status === "pending" && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  handleUpdateOrderStatus(order._id, "approved")
                                }
                                className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                                title="Approve Order"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateOrderStatus(order._id, "rejected")
                                }
                                className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                                title="Reject Order"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {order?.status === "approved" && (
                            <button
                              onClick={() =>
                                handleUpdateOrderStatus(order._id, "delivered")
                              }
                              className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                              title="Mark as Delivered"
                            >
                              Deliver
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
                  <HiOutlineClipboardList className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No orders found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
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
    </div>
  );
};

export default AllOrders;
