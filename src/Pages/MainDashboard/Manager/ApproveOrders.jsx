import React, { useState, useEffect } from "react";
import {
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
  FaTimes,
} from "react-icons/fa";
import toast from "react-hot-toast";
import ReactPaginate from "react-paginate";
import Loading from "../../../Components/Common/Loding/Loding";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const ApprovedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const ordersPerPage = 6;

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingTimeline, setTrackingTimeline] = useState([]);

  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [viewTrackingModalOpen, setViewTrackingModalOpen] = useState(false);

  const [trackingForm, setTrackingForm] = useState({
    location: "",
    note: "",
    status: "Cutting Completed",
    dateTime: new Date().toISOString().slice(0, 16),
  });
  const [addingTracking, setAddingTracking] = useState(false);

  const axiosSecure = useAxiosSecure();

  const fetchApprovedOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/orders?status=approved");
      const data = res.data.data || [];
      setOrders(data);
      setCurrentPage(0);
    } catch (err) {
      toast.error("Failed to load approved orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedOrders();
  }, []);

  const paginatedOrders = orders.slice(
    currentPage * ordersPerPage,
    (currentPage + 1) * ordersPerPage
  );

  const handlePageClick = (e) => setCurrentPage(e.selected);

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

  const openViewTrackingModal = async (order) => {
    setSelectedOrder(order);
    setViewTrackingModalOpen(true);
    try {
      const res = await axiosSecure.get(
        `/track-order/${order.orderId || order.trackingId}/timeline`
      );
      setTrackingTimeline(res.data.data || []);
    } catch {
      toast.error("Failed to load tracking timeline");
      setTrackingTimeline([]);
    }
  };

  const closeModals = () => {
    setSelectedOrder(null);
    setTrackingModalOpen(false);
    setViewTrackingModalOpen(false);
    setTrackingTimeline([]);
  };

  const handleAddTracking = async () => {
    if (!trackingForm.location) {
      toast.error("Location required");
      return;
    }
    try {
      setAddingTracking(true);
      await axiosSecure.post(
        `/orders/${selectedOrder._id}/tracking`,
        trackingForm
      );
      toast.success("Tracking added");
      closeModals();
      fetchApprovedOrders();
    } catch (err) {
      toast.error("Failed to add tracking");
    } finally {
      setAddingTracking(false);
    }
  };

  /* ---------------- HELPER FUNCTIONS ---------------- */
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
        return <FaCalendarAlt className="mr-1" />;
      case "approved":
        return <FaCheckCircle className="mr-1" />;
      default:
        return <FaBox className="mr-1" />;
    }
  };

  /* ---------------- OTHER HELPERS ---------------- */
  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";

  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amt || 0);

  const getTrackingStatusIcon = (status) => {
    switch (status) {
      case "CUTTING COMPLETED":
        return <FaBox className="mr-1" />;
      case "SEWING STARTED":
        return <FaClipboardCheck className="mr-1" />;
      case "FINISHING":
        return <FaCheckCircle className="mr-1" />;
      case "QC CHECKED":
        return <FaClipboardCheck className="mr-1" />;
      case "PACKED":
        return <FaBox className="mr-1" />;
      case "SHIPPED":
        return <FaShippingFast className="mr-1" />;
      case "OUT FOR DELIVERY":
        return <FaTruck className="mr-1" />;
      default:
        return <FaMapMarkerAlt className="mr-1" />;
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loading />
      </div>
    );

  return (
    <div className="p-3">
      {/* HEADER - SIMPLIFIED */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Approved Orders</h2>
        <button
          onClick={fetchApprovedOrders}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-full flex items-center hover:bg-blue-700 disabled:opacity-50"
        >
          <FaSync className={`mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
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
                  Approved Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
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
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => openViewTrackingModal(order)}
                        className="px-3 py-1 flex items-center rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
                        title="View Tracking"
                      >
                        <FaEye className="mr-1" />
                        View Tracking
                      </button>

                      <button
                        onClick={() => openAddTrackingModal(order)}
                        className="px-3 py-1 flex items-center rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
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

        {orders.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaCheckCircle className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No approved orders found
            </h3>
            <p className="text-gray-500">No orders have been approved yet</p>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {Math.ceil(orders.length / ordersPerPage) > 1 && (
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
            pageCount={Math.ceil(orders.length / ordersPerPage)}
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
              {Math.ceil(orders.length / ordersPerPage)}
            </span>
            {" • "}
            <span className="font-medium">{orders.length}</span> total orders
          </div>
        </div>
      )}

      {/* ADD TRACKING MODAL */}
      {trackingModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Add Tracking Update
                </h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Cutting Completed">Cutting Completed</option>
                    <option value="Sewing Started">Sewing Started</option>
                    <option value="Finishing">Finishing</option>
                    <option value="QC Checked">QC Checked</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTracking}
                  disabled={addingTracking}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
                >
                  {addingTracking ? "Adding..." : "Add Tracking"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW TRACKING MODAL */}
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

              <div className="mb-6 bg-blue-50 rounded-lg p-4">
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
                {trackingTimeline.length > 0 ? (
                  <div className="space-y-4">
                    {trackingTimeline.map((track, index) => (
                      <div key={index} className="flex">
                        <div className="flex flex-col items-center mr-4">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              index === 0 ? "bg-green-500" : "bg-blue-500"
                            }`}
                          ></div>
                          {index < trackingTimeline.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="bg-gray-50 rounded-lg p-4">
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
                              {track.location || "Factory"}
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
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add First Tracking Update
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
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
