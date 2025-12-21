import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaTruck,
  FaCalendarAlt,
  FaBox,
  FaCheckCircle,
  FaSync,
  FaUser,
  FaMapMarkerAlt,
  FaClipboardCheck,
  FaShippingFast,
  FaHome,
} from "react-icons/fa";
import { MdPayment, MdLocalShipping } from "react-icons/md";
import toast from "react-hot-toast";
import ReactPaginate from "react-paginate";
import Loading from "../../../Components/Common/Loding/Loding";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const ApprovedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [ordersPerPage] = useState(6);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [viewTrackingModalOpen, setViewTrackingModalOpen] = useState(false);
  const [trackingForm, setTrackingForm] = useState({
    location: "",
    note: "",
    status: "Cutting Completed",
    dateTime: new Date().toISOString().slice(0, 16),
  });
  const [addingTracking, setAddingTracking] = useState(false);
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrder: 0,
  });

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetchApprovedOrders();
  }, [filter]);

  const fetchApprovedOrders = async () => {
    try {
      setLoading(true);
      let url = "/orders?status=approved";

      if (filter !== "all") {
        const date = new Date();
        let startDate;

        switch (filter) {
          case "today":
            startDate = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate()
            );
            break;
          case "week":
            startDate = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case "month":
            startDate = new Date(date.getFullYear(), date.getMonth(), 1);
            break;
          default:
            startDate = null;
        }

        if (startDate) {
          url += `&startDate=${startDate.toISOString()}`;
        }
      }

      const response = await axiosSecure.get(url);
      const ordersData = response.data.data || [];
      setOrders(ordersData);
      calculateStats(ordersData);
    } catch (error) {
      console.error("Error fetching approved orders:", error);
      toast.error("Failed to load approved orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersList) => {
    const totalOrders = ordersList.length;
    const totalRevenue = ordersList.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );
    const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    setStats({
      totalOrders,
      totalRevenue,
      averageOrder,
    });
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

  const openAddTrackingModal = (order) => {
    setSelectedOrder(order);
    setTrackingForm({
      location: "",
      note: "",
      status: "Cutting Completed",
      dateTime: new Date().toISOString().slice(0, 16),
    });
    setTrackingModalOpen(true);
  };

  const openViewTrackingModal = (order) => {
    setSelectedOrder(order);
    setViewTrackingModalOpen(true);
  };

  const closeModals = () => {
    setSelectedOrder(null);
    setTrackingModalOpen(false);
    setViewTrackingModalOpen(false);
  };

  const handleAddTracking = async () => {
    if (!selectedOrder || !trackingForm.location.trim()) {
      toast.error("Please enter location");
      return;
    }

    try {
      setAddingTracking(true);
      const response = await axiosSecure.post(
        `/orders/${selectedOrder._id}/tracking`,
        trackingForm
      );

      if (response.data.success) {
        toast.success("Tracking update added successfully");
        closeModals();
        fetchApprovedOrders();
      }
    } catch (error) {
      console.error("Error adding tracking:", error);
      toast.error(error?.response?.data?.message || "Failed to add tracking");
    } finally {
      setAddingTracking(false);
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCurrentPage(0);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(0);
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
      default:
        return <FaBox className="mr-1" />;
    }
  };

  const getTrackingStatusIcon = (status) => {
    switch (status) {
      case "Cutting Completed":
        return <FaBox className="mr-1" />;
      case "Sewing Started":
        return <FaClipboardCheck className="mr-1" />;
      case "Finishing":
        return <FaCheckCircle className="mr-1" />;
      case "QC Checked":
        return <FaClipboardCheck className="mr-1" />;
      case "Packed":
        return <FaBox className="mr-1" />;
      case "Shipped":
        return <FaShippingFast className="mr-1" />;
      case "Out for Delivery":
        return <FaTruck className="mr-1" />;
      default:
        return <FaMapMarkerAlt className="mr-1" />;
    }
  };

  const trackingStatusOptions = [
    "Cutting Completed",
    "Sewing Started",
    "Finishing",
    "QC Checked",
    "Packed",
    "Shipped",
    "Out for Delivery",
  ];

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
        <h2 className="text-2xl font-bold ">Approved Orders</h2>
        <button
          onClick={fetchApprovedOrders}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-red-800 transition-colors flex items-center disabled:opacity-50"
        >
          <FaSync className={`mr-2 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
              <FaBox className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
              <MdPayment className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-full p-3">
              <FaCalendarAlt className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Order</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats.averageOrder)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="mt-4 bg-amber-100 rounded-4xl shadow p-4">
        <div className="flex items-center justify-between mb-4">
          {(searchTerm || filter !== "all") && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-red-800 flex items-center"
            >
              <FaTimes className="mr-1" />
              Clear Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Date
            </label>
            <div className="flex space-x-1">
              {["all", "today", "week", "month"].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => handleFilterChange(filterOption)}
                  className={`px-3 py-2 text-sm font-medium rounded-xl capitalize ${
                    filter === filterOption
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  {filterOption}
                </button>
              ))}
            </div>
          </div>

          {/* Order Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Summary
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm bg-green-50">
              <div className="flex items-center justify-between">
                <span className="text-green-800 font-medium">
                  Showing {paginatedOrders.length} of {filteredOrders.length}{" "}
                  orders
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  Approved Date
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
                          #{order.orderId || order._id?.substring(18) || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">
                          <span
                            className={`px-2 py-1 inline-flex items-center text-xs rounded-full ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            Approved
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

                  {/* Approved Date */}
                  <td className="px-9 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(
                        order.approvedAt || order.updatedAt || order.createdAt
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.approvedBy && `By ${order.approvedBy}`}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-15 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => openViewTrackingModal(order)}
                        className="px-3 py-1 flex items-center rounded-full bg-indigo-500 text-white hover:bg-red-800"
                        title="View Tracking"
                      >
                        <FaEye className="mr-1" />
                        View Tracking
                      </button>

                      <button
                        onClick={() => openAddTrackingModal(order)}
                        className="px-3 py-1 flex items-center rounded-full bg-green-600 text-white hover:bg-green-700"
                        title="Add Tracking"
                      >
                        <FaTruck className="mr-1" />
                        Add Tracking
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
              <FaCheckCircle className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No approved orders found
            </h3>
            <p className="text-gray-500">
              {searchTerm || filter !== "all"
                ? "Try changing your search or filter criteria"
                : "No orders have been approved yet"}
            </p>
            {(searchTerm || filter !== "all") && (
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

      {/* Add Tracking Modal */}
      {trackingModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-center text-gray-900 mb-4">
                Add Tracking Update
              </h3>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Order: #
                  {selectedOrder.orderId || selectedOrder._id?.substring(18)}
                </p>
                <p className="text-sm text-gray-600">
                  Product: {selectedOrder.items?.[0]?.name || "Unknown"}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={trackingForm.status}
                    onChange={(e) =>
                      setTrackingForm({
                        ...trackingForm,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {trackingStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={trackingForm.location}
                    onChange={(e) =>
                      setTrackingForm({
                        ...trackingForm,
                        location: e.target.value,
                      })
                    }
                    placeholder="Enter location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note
                  </label>
                  <textarea
                    value={trackingForm.note}
                    onChange={(e) =>
                      setTrackingForm({ ...trackingForm, note: e.target.value })
                    }
                    placeholder="Enter tracking note"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={trackingForm.dateTime}
                    onChange={(e) =>
                      setTrackingForm({
                        ...trackingForm,
                        dateTime: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTracking}
                  disabled={addingTracking}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-red-800 rounded-full"
                >
                  {addingTracking ? "Adding..." : "Add Tracking"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Tracking Modal */}
      {viewTrackingModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Tracking History - #
                  {selectedOrder.orderId || selectedOrder._id?.substring(18)}
                </h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6 bg-amber-50 rounded-2xl p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Order Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Product</p>
                    <p className="text-gray-900">
                      {selectedOrder.items?.[0]?.name || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Customer
                    </p>
                    <p className="text-gray-900">
                      {selectedOrder.user?.name || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Tracking Timeline
                </h4>
                {selectedOrder.tracking?.length > 0 ? (
                  <div className="space-y-4">
                    {selectedOrder.tracking.map((track, index) => (
                      <div key={index} className="flex">
                        <div className="flex flex-col items-center mr-4">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              index === 0 ? "bg-green-500" : "bg-blue-500"
                            }`}
                          ></div>
                          {index < selectedOrder.tracking.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="bg-amber-50 rounded-xl p-4">
                            <div className="flex items-center mb-2">
                              {getTrackingStatusIcon(track.status)}
                              <span className="font-medium text-gray-900">
                                {track.status}
                              </span>
                              <span className="ml-auto text-sm text-gray-500">
                                {formatDate(track.dateTime)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-1">
                              <FaMapMarkerAlt className="inline mr-1" />
                              {track.location}
                            </p>
                            {track.note && (
                              <p className="text-sm text-gray-600">
                                {track.note}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaTruck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">
                      No tracking updates available
                    </p>
                    <button
                      onClick={() => {
                        closeModals();
                        openAddTrackingModal(selectedOrder);
                      }}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-red-800"
                    >
                      Add First Tracking Update
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-full"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedOrders;
