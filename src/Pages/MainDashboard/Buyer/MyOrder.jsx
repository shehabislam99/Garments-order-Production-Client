import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaTruck,
  FaTimesCircle,
  FaShoppingCart,
} from "react-icons/fa";
import useAuth from "../../../Hooks/useAuth";
import toast from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import Loading from "../../../Components/Common/Loding/Loding";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

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
  const [totalPages, setTotalPages] = useState(0);
  const axiosSecure = useAxiosSecure();
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

      setOrders([]);
      
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };
  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    try {
      setCancelling(true);
      const response = await axiosSecure.patch(
        `/my-orders/cancel/${selectedOrder._id}`
      );

      if (response.data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === selectedOrder._id ? { ...order } : order
          )
        );

        toast.success("Order cancelled successfully", {
          position: "top-center",
          autoClose: 2000,
        });
        setCancelModalOpen(false);
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error?.response?.data?.message || "Failed to cancel order", {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setCancelling(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
      setOrders([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const timeoutId = setTimeout(() => {
        fetchOrders();
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [currentPage, searchTerm, filterStatus, user]);

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
        return "bg-gray-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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
    { value: "all", label: "All Order Status" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "cancelld", label: "Cancelled" },
  ];

  return (
    <div className="p-3">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold ">My Orders</h2>
        <button
          onClick={() => {
            fetchOrders();
          }}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-red-800 transition-colors flex items-center disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      <div className="mt-4 bg-amber-100 rounded-4xl shadow p-4">
        <div className="flex items-center justify-between mb-4">
          {(searchTerm || filterStatus !== "all") && (
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
                  setSearchTerm(e.target?.value);
                  setCurrentPage(0);
                }}
                placeholder="Search by order ID or product name..."
                className="pl-10 w-full px-3 py-2 border placeholder-green-500 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target?.value);
                setCurrentPage(0);
              }}
              className="w-full px-3 py-2 border border-gray-300 text-green-500 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map((status) => (
                <option key={status?.value} value={status?.value}>
                  {status?.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loading className="h-8 w-8" />
          <span className="text-gray-600 ml-3">Loading orders...</span>
        </div>
      )}

      {!loading && (
        <>
          <div className="mt-4 bg-white rounded-4xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Product name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-7 py-3 text-left text-xs font-medium text-gray-500 uppercase ">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order Status
                    </th>
                    <th className="px-7 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Payment Status
                    </th>
                    <th className="px-11 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-amber-100 divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr
                      key={order?._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              #{order?._id?.substring(0, 12) || "N/A"}
                            </div>
                            <div className="text-sm font-medium  text-gray-500">
                              {formatDate(order?.createdAt)}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="items-center">
                          <div className="font-semibold text-gray-900">
                            {order?.product_name || "Unknown Product"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className=" items-center">
                          <div className="px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-blue-100 text-green-800">
                            {formatCurrency(order?.price || 0)}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-center">
                          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {order?.quantity || 1}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full border ${getStatusColor(
                            order?.status
                          )}`}
                        >
                          {order?.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span
                            className={`px-3 py-1 inline-flex text-center text-xs  leading-5 font-semibold rounded-full border ${getPaymentColor(
                              order?.paymentStatus
                            )}`}
                          >
                            {order?.paymentStatus || "Pending"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <Link
                            to={`/track-order/${order?._id}`}
                            className="px-3 py-1 flex items-center rounded-full bg-indigo-600 text-white hover:bg-red-800"
                            title="View Order Details"
                          >
                            <FaEye className="mr-1" />
                            View
                          </Link>

                          {order?.status === "pending" && (
                            <button
                              onClick={() => openCancelModal(order)}
                              className="px-2 py-1 flex items-center rounded-full bg-red-500 text-white hover:bg-red-800"
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

            {orders?.length === 0 && !loading && (
              <div className="text-center bg-amber-100 py-12">
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

                <Link
                  to="/all-products"
                  className="mt-1 inline-block px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-red-800"
                >
                  Order now
                </Link>
              </div>
            )}
          </div>

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

              <div className="ml-0 md:ml-4 text-sm text-gray-700">
                Page <span className="font-medium">{currentPage + 1}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </div>
            </div>
          )}
        </>
      )}

      {cancelModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-center text-gray-900 mb-4">
                Cancel Order
              </h3>

              <div className="mb-6">
                <p className="ml-3  text-gray-600 mb-2">
                  Are you sure you want to cancel this order?
                </p>
                <div className="bg-amber-100 rounded-4xl p-5">
                  <p className="font-medium text-red-800">
                    Order: #
                    {
                      selectedOrder?._id?.substring(18)|| "N/A"}
                  </p>
                  <p className="text-sm text-red-600">
                    Product: {selectedOrder?.product_name}
                  </p>
                  <p className="text-sm text-red-600">
                    Amount: {formatCurrency(selectedOrder?.totalPrice)}
                  </p>
                </div>
                <p className="text-xs text-gray-500 ml-3 mt-2">
                  This action cannot be undone. Payment will be refunded
                  according to our policy.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeCancelModal}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-red-800 rounded-full"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-800 rounded-full"
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
