import React, { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaTruck,
  FaBox,
  FaSync,
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
    status: "",
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
      toast.error("Failed to load approved orders", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedOrders();
  }, []);

  // --- MODAL HANDLERS ---
  const openAddTrackingModal = (order) => {
    setSelectedOrder(order);
    setTrackingModalOpen(true);
  };

  const openViewTrackingModal = async (order) => {
    setSelectedOrder(order);
    setViewTrackingModalOpen(true);

    try {
      const res = await axiosSecure.get(`/track-order/${order._id}/timeline`);
      

      // Check if data exists in the expected format
      if (res.data.success && res.data.data) {
        setTrackingTimeline(res.data.data);
      } else {
        toast.error("No tracking history found");
        setTrackingTimeline([]);
      }
    } catch (err) {
      console.error("Error fetching timeline:", err);
      toast.error("Failed to load tracking history");
      setTrackingTimeline([]);
    }
  };

  const closeModals = () => {
    setTrackingModalOpen(false);
    setViewTrackingModalOpen(false);
    setSelectedOrder(null);
    setTrackingTimeline([]);
    // Reset form
    setTrackingForm({
      location: "",
      note: "",
      status: "Cutting Completed",
      dateTime: new Date().toISOString().slice(0, 16),
    });
  };

  // --- API ACTIONS ---
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
      toast.success("Tracking added successfully");
      closeModals();
      fetchApprovedOrders();
    } catch (err) {
      toast.error("Failed to add tracking", err);
    } finally {
      setAddingTracking(false);
    }
  };

  // --- HELPERS ---
  const paginatedOrders = orders.slice(
    currentPage * ordersPerPage,
    (currentPage + 1) * ordersPerPage
  );

  const handlePageClick = (e) => setCurrentPage(e.selected);

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
    const s = status?.toUpperCase();
    if (s?.includes("CUTTING")) return <FaBox className="mr-1" />;
    if (s?.includes("SEWING")) return <FaClipboardCheck className="mr-1" />;
    if (s?.includes("SHIPPED")) return <FaShippingFast className="mr-1" />;
    if (s?.includes("DELIVERY")) return <FaTruck className="mr-1" />;
    return <FaMapMarkerAlt className="mr-1" />;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loading />
      </div>
    );

  return (
    <div className="p-3">
      {/* Title & Refresh */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Approved Orders</h2>
        <button
          onClick={fetchApprovedOrders}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
        >
          <FaSync />
        </button>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Qty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.orderId?.substring(0, 10) || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.user?.name ||
                      order.customer?.firstName ||
                      "Customer"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      {order.items?.[0]?.name ||
                        order.product_name ||
                        "Product"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatCurrency(order.totalAmount || order.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                      {order.items?.[0]?.quantity || order.quantity || 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(order.approvedAt || order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => openViewTrackingModal(order)}
                        className="px-3 py-1 flex items-center rounded-full bg-indigo-500 text-white hover:bg-indigo-600"
                      >
                        <FaEye className="mr-1" /> View
                      </button>
                      <button
                        onClick={() => openAddTrackingModal(order)}
                        className="px-3 py-1 flex items-center rounded-full bg-green-600 text-white hover:bg-green-700"
                      >
                        <FaTruck className="mr-1" /> Track
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                  Tracking History - #{selectedOrder.orderId?.substring(0, 10)}
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
                    <p className="text-sm font-medium text-gray-700">
                      Latest Status
                    </p>
                    <p className="text-gray-900 font-bold">
                      {/* Show the most recent status from the timeline */}
                      {trackingTimeline[0]?.step || "Approved"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Current Location
                    </p>
                    <p className="text-gray-900 font-bold">
                      {trackingTimeline[0]?.location || "Factory"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Tracking Timeline
                </h4>
                {trackingTimeline.length > 0 ? (
                  <div className="space-y-4">
                    {trackingTimeline.map((track, index) => (
                      <div key={track.id || index} className="flex">
                        <div className="flex flex-col items-center mr-4">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              track.status === "current"
                                ? "bg-green-500"
                                : "bg-blue-500"
                            }`}
                          ></div>
                          {index < trackingTimeline.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              {getTrackingStatusIcon(track.step)}
                              <span className="font-medium text-gray-900">
                                {track.step}
                              </span>
                              <span className="ml-auto text-sm text-gray-500">
                                {formatDate(track.date)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-1">
                              <FaMapMarkerAlt className="inline mr-1" />
                              {track.location}
                            </p>
                            {track.description &&
                              track.description !== "No additional details" && (
                                <p className="text-sm text-gray-600 italic">
                                  "{track.description}"
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
                    <p className="text-gray-500">No tracking updates yet</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
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
