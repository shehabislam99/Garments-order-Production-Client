import React, { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaTruck,
  FaClock,
  FaBox,
  FaTimes,
} from "react-icons/fa";
import { MdLocationOn} from "react-icons/md";
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
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [viewTrackingModalOpen, setViewTrackingModalOpen] = useState(false);
  const [trackingForm, setTrackingForm] = useState({
    location: "",
    note: "",
    status: "",
    dateTime: new Date().toISOString().slice(0, 16),
  });
 const [addingTracking, setAddingTracking] = useState(false);
 const [trackingTimeline, setTrackingTimeline] = useState([]);
 const [loadingTimeline, setLoadingTimeline] = useState(false);
  const axiosSecure = useAxiosSecure();

  const fetchApprovedOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/orders?status=approved");
      const data = res.data.data || [];
      setOrders(data);
      setCurrentPage(0);
    } catch (err) {
      toast.error("Failed to load approved orders", err, {
        position: "top-center",
        autoClose: 2000,
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedOrders();
  }, []);

  const openAddTrackingModal = (order) => {
    setSelectedOrder(order);
    setTrackingModalOpen(true);
  };
  const openViewTrackingModal = async (order) => {
    setSelectedOrder(order);
    setLoadingTimeline(true);
    setViewTrackingModalOpen(true);

    try {
      const res = await axiosSecure.get(`/track-order/timeline/${order?._id}`);
      const timeline = res?.data?.data?.timeline || [];
      setTrackingTimeline(timeline);
    } catch (err) {
      console.error("Error fetching timeline:", err);
      setTrackingTimeline([]);
    } finally {
      setLoadingTimeline(false);
    }
  };

  const closeModals = () => {
    setTrackingModalOpen(false);
     setViewTrackingModalOpen(false);
    setSelectedOrder(null);
    setTrackingForm({
      location: "",
      note: "",
      status: "Cutting Completed",
      dateTime: new Date().toISOString().slice(0, 16),
    });  setTrackingTimeline([]);
  };

  const handleAddTracking = async () => {
    if (!trackingForm.location) {
      toast.error("Location required", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    try {
      setAddingTracking(true);
      await axiosSecure.post(
        `/orders/tracking/${selectedOrder._id}`,
        trackingForm
      );
      toast.success("Tracking added successfully", {
        position: "top-center",
        autoClose: 2000,
      });
      closeModals();
      fetchApprovedOrders();
    } catch (err) {
      toast.error("Failed to add tracking", err, {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setAddingTracking(false);
    }
  };

  const paginatedOrders = orders.slice(
    currentPage * ordersPerPage,
    (currentPage + 1) * ordersPerPage
  );

  const handlePageClick = (e) => setCurrentPage(e.selected);

   const formatDate = (date) => {
     if (!date) return "Date not available";
     return new Date(date).toLocaleString("en-US", {
       dateStyle: "medium",
       timeStyle: "short",
     });
   };

  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amt || 0);


  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loading />
      </div>
    );

  return (
    <div className="p-3">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Approved Orders</h2>
        <button
          onClick={fetchApprovedOrders}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-red-800 transition-colors flex items-center disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      {/* ORDERS TABLE */}
      <div className="mt-4 bg-white rounded-4xl shadow overflow-hidden">
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
                  Product name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Approve Date
                </th>
                <th className="px-15 py-3 text-left text-xs font-medium text-gray-500 uppercase">
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
                    <div className=" items-center">
                      <div className="text-sm font-semibold text-gray-900">
                        #{order?._id?.substring(0, 12) || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="items-center">
                      <div className="inline-flex text-sm font-semibold text-violet-500">
                        {order?.customer?.firstName || "Unknown"}
                      </div>
                      <div className="text-xs text-gray-600">
                        {order?.CustomerEmail || "No Email"}
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
                        {order?.quantity || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="items-center">
                      <div className="font-medium text-gray-600">
                        {formatDate(
                          order?.approvedAt || order?.createdAt || "N/A"
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-xs font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openAddTrackingModal(order)}
                        className="px-2 py-1 flex items-center rounded-full bg-green-600 text-white hover:bg-green-700"
                      >
                        <FaTruck className="mr-1" />
                        Add Track
                      </button>
                      <button
                        onClick={() => openViewTrackingModal(order)}
                        className="px-2 py-1 flex items-center rounded-full bg-indigo-600 text-white hover:bg-indigo-600"
                      >
                        <FaEye className="mr-1" /> View Track
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
              No Approved orders
            </h3>
          </div>
        )}
      </div>
      {/* PAGINATION */}
      {Math.ceil(orders?.length / ordersPerPage) > 1 && (
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
              {Math.ceil(orders?.length / ordersPerPage)}
            </span>
            {" • "}
            <span className="font-medium">{orders?.length}</span> total orders
          </div>
        </div>
      )}
      {/* ADD TRACKING MODAL */}
      {trackingModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-amber-100 rounded-4xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg ml-25 font-bold text-gray-900">
                  Add Tracking Update
                </h3>
                <button
                  onClick={closeModals}
                  className=" text-red-500 hover:text-red-800"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Order Id: #{selectedOrder?._id?.substring(18) || "N/A"}
                </p>
                <p className="text-sm font-semibold text-gray-600">
                  Product: {selectedOrder?.product_name || "Unknown"}
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
                        status: e.target?.value,
                      })
                    }
                    className="w-full pl-4 pr-4 py-3 text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                    value={trackingForm?.location}
                    onChange={(e) =>
                      setTrackingForm({
                        ...trackingForm,
                        location: e.target?.value,
                      })
                    }
                    placeholder="Enter location"
                    className="w-full pl-4 pr-4 py-3 text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note
                  </label>
                  <textarea
                    value={trackingForm?.note}
                    onChange={(e) =>
                      setTrackingForm({
                        ...trackingForm,
                        note: e.target?.value,
                      })
                    }
                    placeholder="Enter tracking note"
                    rows="3"
                    className="w-full pl-4 pr-4 py-3 text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeModals}
                  className="px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-800 rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTracking}
                  disabled={addingTracking}
                  className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-red-800 disabled:opacity-50 rounded-full transition-colors"
                >
                  {addingTracking ? "Adding..." : "Add Tracking"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}{" "}
      {viewTrackingModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-amber-100 rounded-4xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-gray-900 font-bold">
                    Order Id #{selectedOrder?._id || "N/A"}
                  </p>
                </div>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"
                >
                  <FaTimes className="h-6 w-6 text-red-600" />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-xl font-bold text-gray-800">
                    Production Tracking Timeline
                  </h4>
                  <span className="text-sm text-indigo-600 font-semibold flex items-center">
                    <FaTruck className="mr-2" />
                    {trackingTimeline?.length} Updates
                  </span>
                </div>

                {loadingTimeline ? (
                  <div className="flex justify-center items-center py-10">
                    <Loading />
                  </div>
                ) : trackingTimeline.length > 0 ? (
                  <div className="relative">
                    <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 to-green-200" />

                    <div className="space-y-8">
                      {trackingTimeline.map((track, idx) => (
                        <div key={idx} className="relative flex group">
                          <div
                            className={`absolute left-8 -translate-x-1/2 h-5 w-5 rounded-full border-4 border-white z-10 flex items-center justify-center ${
                              track?.status === "current"
                                ? "bg-blue-600 animate-pulse ring-4 ring-blue-200"
                                : "bg-green-600"
                            }`}
                          >
                            {track?.status === "current" && (
                              <div className="h-2 w-2 bg-white rounded-full"></div>
                            )}
                          </div>

                          <div className="ml-12 w-full">
                            <div>
                              <div className="flex-1 pb-6">
                                <div className="bg-gray-50 rounded-4xl p-5 border border-gray-200 hover:border-blue-200 transition-colors">
                                  <div className="flex items-center mb-3">
                                    <span className="font-bold text-gray-900 text-lg">
                                      {track?.step}
                                    </span>
                                    <span className="ml-auto text-sm font-semibold text-gray-500">
                                      {formatDate(track?.date)}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-sm text-gray-700 mb-2">
                                    <MdLocationOn className="mr-1 w-5 h-5 text-violet-500" />
                                    <span className="font-medium">
                                      {track?.location ||
                                        "Location not specified"}
                                    </span>
                                  </div>
                                  <div className="mt-3 p-3 bg-white rounded-xl border-b-4 border-amber-400">
                                    <p className="text-gray-900">
                                      "{track?.Note || "No additional details"}"
                                    </p>
                                  </div>
                                  {track?.status === "current" && (
                                    <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                                      <FaTruck className="mr-1" />
                                      Currently Active
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <FaClock className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Tracking Updates Pending
                    </h4>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedOrders;
