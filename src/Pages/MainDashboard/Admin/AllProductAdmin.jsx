import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaEyeSlash,
  FaVideo,
  FaImage,
} from "react-icons/fa";
import { MdImage, MdCategory, MdPerson, MdPayment } from "react-icons/md";
import { BsCurrencyDollar } from "react-icons/bs";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import ReactPaginate from "react-paginate";
import Loader from "../../../Components/Common/Loader/Loader";

const AllProductAdmin = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [productsPerPage] = useState(6);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [productStats, setProductStats] = useState({
    totalProducts: 0,
    categories: {},
    showOnHome: 0,
    hiddenFromHome: 0,
  });

  const axiosSecure = useAxiosSecure();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get(
        `/products?searchText=${searchTerm}&page=${
          currentPage + 1
        }&limit=${productsPerPage}&category=${filterCategory}&status=${filterStatus}`
      );

      if (res.data && res.data?.success) {
        setProducts(res.data?.data || []);
        (res.data?.total || 0);
        setTotalPages(
          res?.data?.totalPages ||
            Math.ceil((res.data?.total || 0) / productsPerPage)
        );
      } else {
        setProducts([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductStats = async () => {
    try {
      const res = await axiosSecure.get("/products/stats");

      if (res.data?.success) {
        setProductStats(res.data.data);
        // Extract categories from stats
        if (res.data.data.categories) {
          setProductStats((prevStats) => ({
            ...prevStats,
            categories: res.data.data.categories,
          }));
        }
      } else {
        // Use default stats if API returns success:false
        setProductStats({
          totalProducts: 0,
          categories: {},
          showOnHome: 0,
          hiddenFromHome: 0,
        });
      }
    } catch (error) {
      console.error("Failed to load statistics:", error);
      setProductStats({
        totalProducts: 0,
        categories: {},
        showOnHome: 0,
        hiddenFromHome: 0,
      });
      // Don't show toast for stats error to avoid annoyance
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchProductStats();
  }, [currentPage, searchTerm, filterCategory, filterStatus]);

  const handleToggleShowOnHome = async (productId, currentValue) => {
    try {
      const response = await axiosSecure.patch(
        `/admin/products/show-on-home/${productId}`,
        { showOnHome: !currentValue }
      );

      if (response.data.success) {
        setProducts(
          products.map((product) =>
            product._id === productId
              ? { ...product, showOnHome: !currentValue }
              : product
          )
        );
        toast.success(
          !currentValue
            ? "Product will now show on home page"
            : "Product removed from home page"
        );
        fetchProductStats(); // Refresh stats
      }
    } catch (error) {
      console.error("Error toggling show on home:", error);
      toast.error("Failed to update product visibility");
    }
  };

  const handleDeleteProduct = async () => {
    if (!editingProduct) return;

    try {
      setUpdating(true);
      const response = await axiosSecure.delete(
        `/admin/products/${editingProduct?._id}`
      );

      if (response.data.success) {
        setProducts(
          products.filter((product) => product._id !== editingProduct._id)
        );
        toast.success("Product deleted successfully");
        setDeleteModalOpen(false);
        setEditingProduct(null);
        fetchProductStats(); // Refresh stats
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateProduct = async (formData) => {
    if (!editingProduct) return;

    try {
      setUpdating(true);
      const response = await axiosSecure.put(
        `/admin/products/${editingProduct._id}`,
        formData
      );

      if (response.data.success) {
        setProducts(
          products.map((product) =>
            product._id === editingProduct._id
              ? { ...product, ...formData }
              : product
          )
        );
        toast.success("Product updated successfully");
        setUpdateModalOpen(false);
        setEditingProduct(null);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setUpdating(false);
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const openDeleteModal = (product) => {
    setEditingProduct(product);
    setDeleteModalOpen(true);
  };

  const openUpdateModal = (product) => {
    setEditingProduct(product);
    setUpdateModalOpen(true);
  };

  const closeDeleteModal = () => {
    setEditingProduct(null);
    setDeleteModalOpen(false);
  };

  const closeUpdateModal = () => {
    setEditingProduct(null);
    setUpdateModalOpen(false);
  };

  const getCategoryColor = (category) => {
    const colors = {
      electronics: "bg-blue-100 text-blue-800 border-blue-200",
      clothing: "bg-purple-100 text-purple-800 border-purple-200",
      furniture: "bg-amber-100 text-amber-800 border-amber-200",
      books: "bg-green-100 text-green-800 border-green-200",
      beauty: "bg-pink-100 text-pink-800 border-pink-200",
      default: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[category?.toLowerCase()] || colors.default;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("all");
    setFilterStatus("all");
    setCurrentPage(0);
  };

  // Payment options constant
  const paymentOptionsList = [
    "Cash on Delivery",
    "Credit Card",
    "Bank Transfer",
  ];
    const categories = [
      "Shirt",
      "Pant",
      "Jacket",
      "Accessories",
      "Shoes",
      "T-Shirt",
      "Jeans",
      "Dress",
    ];

  // Update Product Form with all fields
  const UpdateProductForm = () => {
    const [formData, setFormData] = useState({
      name: editingProduct?.name || "",
      description: editingProduct?.description || "",
      price: editingProduct?.price || "",
      category: editingProduct?.category || "",
      image: editingProduct?.image || "",
      demoVideo: editingProduct?.demoVideo || "",
      paymentOptions: editingProduct?.paymentOptions || [],
    });

    const [imagePreview, setImagePreview] = useState(formData.image);
    const [videoPreview, setVideoPreview] = useState(formData.demoVideo);

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          setFormData({ ...formData, image: reader.result });
        };
        reader.readAsDataURL(file);
      }
    };

    const handleVideoChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setVideoPreview(reader.result);
          setFormData({ ...formData, demoVideo: reader.result });
        };
        reader.readAsDataURL(file);
      }
    };

    const handlePaymentOptionChange = (option) => {
      const updatedOptions = formData.paymentOptions.includes(option)
        ? formData.paymentOptions.filter((opt) => opt !== option)
        : [...formData.paymentOptions, option];
      setFormData({ ...formData, paymentOptions: updatedOptions });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      handleUpdateProduct(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="Enter product description"
          />
        </div>

        {/* Price and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($) *
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Image
          </label>
          <div className="flex items-center space-x-4">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="h-24 w-24 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview("");
                    setFormData({ ...formData, image: "" });
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <FaTimes className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="h-24 w-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                <FaImage className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Upload Image
              </label>
            </div>
          </div>
        </div>

        {/* Demo Video */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Demo Video URL
          </label>
          <div className="flex items-center space-x-4">
            {videoPreview ? (
              <div className="relative">
                <div className="h-24 w-32 bg-gray-900 rounded-md flex items-center justify-center">
                  <FaVideo className="h-8 w-8 text-white" />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setVideoPreview("");
                    setFormData({ ...formData, demoVideo: "" });
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <FaTimes className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="h-24 w-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                <FaVideo className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <input
                type="text"
                value={formData.demoVideo}
                onChange={(e) =>
                  setFormData({ ...formData, demoVideo: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter video URL or upload file"
              />
              <div className="mt-2">
                <input
                  type="file"
                  id="video-upload"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                />
                <label
                  htmlFor="video-upload"
                  className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  Upload video file instead
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Options
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {paymentOptionsList.map((option) => (
              <div key={option} className="flex items-center">
                <input
                  type="checkbox"
                  id={`payment-${option}`}
                  checked={formData.paymentOptions.includes(option)}
                  onChange={() => handlePaymentOptionChange(option)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`payment-${option}`}
                  className="ml-2 text-sm text-gray-700"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            onClick={closeUpdateModal}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updating}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating ? (
              <span className="flex items-center">
                <Loader className="h-4 w-4 mr-2" />
                Updating...
              </span>
            ) : (
              "Update Product"
            )}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="p-3">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage all products in the system
          </p>
        </div>
        <button
          onClick={() => {
            fetchProducts();
            fetchProductStats();
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
            <p className="text-sm font-medium text-gray-600">Total Products</p>
            <p className="text-2xl font-semibold text-gray-900">
              {productStats?.totalProducts || products.length || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Showing {products.length} products
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">On Home Page</p>
            <p className="text-2xl font-semibold text-green-600">
              {productStats?.showOnHome ||
                products.filter((p) => p.showOnHome).length ||
                0}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Hidden</p>
            <p className="text-2xl font-semibold text-red-600">
              {productStats?.hiddenFromHome ||
                products.filter((p) => !p.showOnHome).length ||
                0}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Categories</p>
            <p className="text-2xl font-semibold text-blue-600">
              {Object.keys(productStats?.categories || {}).length ||
                [...new Set(products.map((p) => p.category))].length ||
                0}
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mt-4 bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          {(searchTerm ||
            filterCategory !== "all" ||
            filterStatus !== "all") && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <FaTimes className="mr-1" />
              Clear Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
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
                placeholder="Search by product name..."
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Show on Home Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Show on Home
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
              <option value="show">Show on Home</option>
              <option value="hide">Hidden from Home</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader className="h-8 w-8" />
          <span className="text-gray-600 ml-3">Loading products...</span>
        </div>
      )}

      {/* Products Table */}
      {!loading && (
        <>
          <div className="mt-4 bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Show on Home
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr
                      key={product?._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Product Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {product?.image ? (
                            <img
                              className="h-12 w-12 rounded-md object-cover"
                              src={product.image}
                              alt={product.name}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center">
                              <MdImage className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product?.name || "Unnamed Product"}
                            </div>
                            <div className="text-xs text-gray-500 truncate max-w-xs">
                              {product?.description?.substring(0, 60)}...
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <BsCurrencyDollar className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm font-medium text-gray-900">
                            ${parseFloat(product?.price || 0).toFixed(2)}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getCategoryColor(
                            product?.category
                          )}`}
                        >
                          <MdCategory className="mr-1" />
                          {product?.category || "Uncategorized"}
                        </span>
                      </td>

                      {/* Created By */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MdPerson className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700">
                            {product?.createdBy ||
                              product?.senderEmail ||
                              "Unknown"}
                          </span>
                        </div>
                      </td>

                      {/* Show on Home */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            handleToggleShowOnHome(
                              product._id,
                              product.showOnHome
                            )
                          }
                          className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            product?.showOnHome
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {product?.showOnHome ? (
                            <>
                              <FaEye className="mr-1" />
                              Showing
                            </>
                          ) : (
                            <>
                              <FaEyeSlash className="mr-1" />
                              Hidden
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => openUpdateModal(product)}
                            className="flex items-center text-blue-600 hover:text-blue-800 hover:underline transition-all duration-300"
                            title="Update Product"
                          >
                            <FaEdit className="mr-1" />
                            Update
                          </button>
                          <button
                            onClick={() => openDeleteModal(product)}
                            className="flex items-center text-red-600 hover:text-red-800 hover:underline transition-all duration-300"
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

            {/* Empty State */}
            {products.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MdImage className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
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

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-center text-gray-900 mb-4">
                Delete Product
              </h3>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  Are you sure you want to delete this product?
                </p>
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="font-medium text-red-800">
                    {editingProduct?.name}
                  </p>
                  <p className="text-sm text-red-600">
                    Price: ${parseFloat(editingProduct?.price || 0).toFixed(2)}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  disabled={updating}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
                >
                  {updating ? "Deleting..." : "Delete Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Product Modal */}
      {updateModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Update Product
                </h3>
                <button
                  onClick={closeUpdateModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              <UpdateProductForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProductAdmin;
