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
} from "react-icons/fa";
import { MdEmail, MdImage } from "react-icons/md";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import ReactPaginate from "react-paginate";
import Loading from "../../../Components/Common/Loding/Loding";
import { axiosInstance } from "../../../Hooks/useAxios";
import { useNavigate } from "react-router";

const AllProductAdmin = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [productsPerPage] = useState(6);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState([]); 

  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/products?searchText=${searchTerm}&page=${
          currentPage + 1
        }&limit=${productsPerPage}&category=${filterCategory}&status=${filterStatus}`
      );

      if (res.data && res.data?.success) {
        setProducts(res.data?.data || []);
        setTotalProducts(res.data?.total || 0);
        setTotalPages(
          res?.data?.totalPages ||
            Math.ceil((res.data?.total || 0) / productsPerPage)
        );

       
        const uniqueCategories = [
          ...new Set(res.data?.data?.map((p) => p.category)),
        ].filter(Boolean);
        setCategories(uniqueCategories);
      } else {
        setProducts([]);
        setTotalProducts(0);
        setTotalPages(0);
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(0);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    fetchProducts();
  
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
        `/products/${editingProduct?._id}`
      );

      if (response.data.success) {
        setProducts(
          products.filter((product) => product._id !== editingProduct._id)
        );
        toast.success("Product deleted successfully");
        setDeleteModalOpen(false);
        setEditingProduct(null);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
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

  const closeDeleteModal = () => {
    setEditingProduct(null);
    setDeleteModalOpen(false);
  };


 

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("all");
    setFilterStatus("all");
    setCurrentPage(0);
  };


  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return Array.isArray(product.images) ? product.images[0] : product.images;
    }
    return null;
  };


  return (
    <div className="p-3">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
        <button
          onClick={() => {
            fetchProducts();
          }}
          disabled={loading}
          className="px-4 py-2  bg-indigo-600 text-white rounded-full hover:bg-red-800 transition-colors flex items-center disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      {/* Filters and Search */}
      <div className="mt-4 bg-amber-100  rounded-4xl shadow p-4">
        <div className="flex items-center justify-between mb-4">
          {(searchTerm ||
            filterCategory !== "all" ||
            filterStatus !== "all") && (
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:text-red-800 flex items-center"
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
                className="pl-10 w-full px-3 py-2 placeholder-green-500 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border text-green-500 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category || "Uncategorized"}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-green-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="show">Show on Home</option>
              <option value="hide">Hidden from Home</option>
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
          <div className="mt-4  rounded-4xl shadow overflow-hidden">
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
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Show on Home
                    </th>
                    <th className="px-14 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-amber-100 divide-y divide-gray-200">
                  {products.map((product) => {
                    const productImage = getProductImage(product);
                    return (
                      <tr
                        key={product?._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={
                                productImage || "https://via.placeholder.com/48"
                              }
                            />

                            <div className="inline-flex ml-4">
                              <div className="text-sm  font-medium text-gray-900">
                                {product?.product_name || "Unnamed Product"}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              ${product?.price || 0}
                            </span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className="px-3 py-1 inline-flex text-xs leading-5 
                            font-semibold rounded-full bg-green-100 text-greeen-600
                              
                            "
                          >
                            {product?.category || "Uncategorized"}
                          </span>
                        </td>

                        {/* Created By - This might not exist in your backend */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MdEmail className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-700">
                              {product.createdBy || "Unknown"}
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
                            className={`flex items-center px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
                              product?.showOnHome
                                ? "bg-green-600 text-white hover:bg-red-800"
                                : "bg-gray-600 text-white hover:bg-red-800"
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
                              onClick={() =>
                                navigate(
                                  `/dashboard/update-product/${product?._id}`
                                )
                              }
                              className="flex items-center rounded-full px-3 py-1 text-white bg-blue-600 hover:bg-red-800 hover:underline transition-all duration-300"
                              title="Update Product"
                            >
                              <FaEdit className="mr-1" />
                              Update
                            </button>
                            <button
                              onClick={() => openDeleteModal(product)}
                              className="flex items-center px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-800 hover:underline transition-all duration-300"
                              title="Delete Product"
                            >
                              <FaTrash className="mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
                {" • "}
                <span className="font-medium">{totalProducts}</span> total
                products
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
                    {editingProduct?.product_name || "Unnamed Product"}
                  </p>
                  <p className="text-sm text-red-600">
                    Price: ${editingProduct?.price || 0}
                  </p>
                  <p className="text-sm text-red-600">
                    Category: {editingProduct?.category || "Uncategorized"}
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
    </div>
  );
};

export default AllProductAdmin;
