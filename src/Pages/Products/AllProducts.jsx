import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { useProduct } from "../../Hooks/useProduct"; // Adjust the import path as needed
import Loader from "../../Components/Common/Loader/Loader";
import { FaSearch } from "react-icons/fa";
import { LuRefreshCcw } from "react-icons/lu";

const AllProducts = () => {
  const {
    products,
    loading,
    fetchProducts,
  } = useProduct();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.productName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.trackingId
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.senderEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [products, searchTerm]);



  const handleRefresh = () => {
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader></Loader>
          <p className="mt-2 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl text-center font-bold ">All Products</h1>
        <p className="text-gray-500 text-center text-lg">Explore our all products</p>
      </div>

      <div className="flex justify-between items-center py-6">
        <div>
          <p className="text-lg font-medium mt-1">
            Total Products (
            <span className=" font-bold text-green-500">{products.length}</span>
            ){searchTerm && `(Filtered: ${filteredProducts.length})`}
          </p>
        </div>

        <div className=" lg:flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="mt-1 lg:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-red-800 transition-colors flex items-center"
          >
            <LuRefreshCcw className="mr-1" />
            Refresh
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No products found
          </h3>
          <p className="mt-1 text-gray-500">
            {searchTerm
              ? `No products match "${searchTerm}". Try a different search term.`
              : "No products available. Add your first product!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProducts;
