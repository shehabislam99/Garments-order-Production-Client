import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaTrash,
  FaEdit,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaSync,
  FaBox,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEye,
} from "react-icons/fa";
import { MdPayment, MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Loading from "../../../Components/Common/Loding/Loding";
import ReactPaginate from "react-paginate";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [productsPerPage] = useState(6);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = [
        "all",
        ...new Set(products.map((p) => p.category).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
    }
  }, [products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/products");
      const productsData = res.data.data || [];
      setProducts(productsData);
      setTotalProducts(productsData.length);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;

    const matchesStatus =
      filterStatus === "all" || product.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const paginatedProducts = filteredProducts.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedProduct(null);
    setDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      setDeleting(true);
      await axiosSecure.delete(`/products/${selectedProduct._id}`);
      setProducts(products.filter((p) => p._id !== selectedProduct._id));
      toast.success("Product deleted successfully");
      closeDeleteModal();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("all");
    setFilterStatus("all");
    setCurrentPage(0);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "inactive":
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
      case "active":
        return <FaCheckCircle className="mr-1" />;
      case "rejected":
      case "inactive":
        return <FaTimesCircle className="mr-1" />;
      default:
        return <FaBox className="mr-1" />;
    }
  };

  const getPaymentIcon = (paymentMethod) => {
    switch (paymentMethod?.toLowerCase()) {
      case "stripe":
        return <MdPayment className="mr-1" />;
      case "cash on delivery":
        return <FaBox className="mr-1" />;
      default:
        return <MdPayment className="mr-1" />;
    }
  };

  const getPaymentColor = (paymentMethod) => {
    switch (paymentMethod?.toLowerCase()) {
      case "stripe":
        return "bg-green-100 text-green-800 border-green-200";
      case "cash on delivery":
        return "bg-violet-100 text-violet-800 border-violet-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
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
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
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
        <h2 className="text-2xl font-bold ">Manage Products</h2>
        <button
          onClick={fetchProducts}
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
          {(searchTerm ||
            filterCategory !== "all" ||
            filterStatus !== "all") && (
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
              Search Products
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
                placeholder="Search by name or category..."
                className="pl-10 w-full px-3 py-2 border placeholder-green-500 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full px-3 py-2 border border-gray-300 text-green-500 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
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
              className="w-full px-3 py-2 border border-gray-300 text-green-500 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loading className="h-8 w-8" />
          <span className="text-gray-600 ml-3">Loading products...</span>
        </div>
      )}

      {!loading && (
        <>
          {/* Products Table */}
          <div className="mt-4 bg-white rounded-4xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price & Stock
                    </th>
                    <th className="px-9 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-7 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Mode
                    </th>
                    <th className="px-15 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-amber-100 divide-y divide-gray-200">
                  {paginatedProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Product Image & Name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={product.images?.[0]}
                            alt={product.product_name}
                            className="h-12 w-12 rounded-full object-cover border border-gray-300"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.product_name || "Unnamed Product"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {product.category || "Uncategorized"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Details */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="text-gray-900">
                            MOQ: {product.moq || "N/A"}
                          </div>
                          <div className="text-gray-500">
                            ID: #{product._id?.substring(18) || "N/A"}
                          </div>
                        </div>
                      </td>

                      {/* Price & Stock */}
                      <td className="px-8 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm font-semibold text-gray-900">
                            {formatCurrency(product.price)}
                          </span>
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Stock: {product.available_quantity || 0}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full border ${getStatusColor(
                            product.status
                          )}`}
                        >
                          {getStatusIcon(product.status)}
                          {product.status || "Active"}
                        </span>
                      </td>

                      {/* Payment Mode */}
                      <td className="px-9 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full border ${getPaymentColor(
                            product.payment_Options
                          )}`}
                        >
                          {getPaymentIcon(product.payment_Options)}
                          {product.payment_Options || "N/A"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-15 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() =>
                              navigate(`/dashboard/view-product/${product._id}`)
                            }
                            className="px-3 py-1 flex items-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
                            title="View Product"
                          >
                            <FaEye className="mr-1" />
                            View
                          </button>

                          <button
                            onClick={() =>
                              navigate(
                                `/dashboard/update-product/${product._id}`
                              )
                            }
                            className="px-3 py-1 flex items-center rounded-full bg-green-600 text-white hover:bg-green-700"
                            title="Edit Product"
                          >
                            <FaEdit className="mr-1" />
                            Edit
                          </button>

                          <button
                            onClick={() => openDeleteModal(product)}
                            className="px-3 py-1 flex items-center rounded-full bg-red-600 text-white hover:bg-red-700"
                            title="Delete Product"
                          >
                            <FaTrash className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <FaBox className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500">
                  {searchTerm ||
                  filterCategory !== "all" ||
                  filterStatus !== "all"
                    ? "Try changing your search or filter criteria"
                    : "No products available"}
                </p>
                {(searchTerm ||
                  filterCategory !== "all" ||
                  filterStatus !== "all") && (
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
          {Math.ceil(filteredProducts.length / productsPerPage) > 1 && (
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
                pageCount={Math.ceil(filteredProducts.length / productsPerPage)}
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
                  {Math.ceil(filteredProducts.length / productsPerPage)}
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-center text-gray-900 mb-4">
                Delete Product
              </h3>

              <div className="mb-6">
                <p className="ml-3 text-gray-600 mb-2">
                  Are you sure you want to delete this product?
                </p>
                <div className="bg-amber-100 rounded-4xl p-5">
                  <p className="font-medium text-red-800">
                    Product: {selectedProduct.product_name}
                  </p>
                  <p className="text-sm text-red-600">
                    Category: {selectedProduct.category}
                  </p>
                  <p className="text-sm text-red-600">
                    Price: {formatCurrency(selectedProduct.price)}
                  </p>
                </div>
                <p className="text-xs text-gray-500 ml-3 mt-2">
                  This action cannot be undone. All product data will be
                  permanently removed.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-red-800 rounded-full"
                >
                  Keep Product
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-full"
                >
                  {deleting ? "Deleting..." : "Yes, Delete Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
