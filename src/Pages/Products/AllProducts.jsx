import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaRegPlayCircle, FaEye } from "react-icons/fa";
import {  MdCategory } from "react-icons/md";
import { Link } from "react-router-dom";
import Loading from "../../Components/Common/Loding/Loding";
import { axiosInstance } from "../../Hooks/useAxios";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const wasSearching = useRef(false); 

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/products");
      setProducts(res.data.data || []);
      setFilteredProducts(res.data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }

    wasSearching.current = true; 

    const term = searchTerm.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product?.product_name?.toLowerCase().includes(term) ||
        product?.name?.toLowerCase().includes(term) ||
        product?.category?.toLowerCase().includes(term) ||
        product?.description?.toLowerCase().includes(term)
    );

    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  useEffect(() => {
    if (searchTerm === "" && wasSearching.current) {
      fetchProducts();
      wasSearching.current = false;
    }
  }, [searchTerm]);


  const handleSearch = (e) => {
    e.preventDefault();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loading />
          <p className="mt-4 text-lg text-gray-600">Loading all products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 pt-8"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-medium mb-4">
            All Products
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Explore Our Collection
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Discover our complete range of premium garments
          </p>

          <div className="flex justify-end">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search by name, category, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-10 placeholder-green-500 py-3 w-full md:w-96 rounded-full border border-gray-300"
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </form>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loading />
          </div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product?._id}
                  variants={cardVariants}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={
                        product?.images?.[0] ||
                        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                      }
                      alt={product?.product_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex items-center justify-center">
                      <button className="p-2">
                        {product?.demo_video_link && (
                          <a
                            href={product?.demo_video_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2"
                          >
                            <FaRegPlayCircle className="w-12 h-12 text-red-600" />
                          </a>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-amber-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
                       <MdCategory className="mr-1 mt-0.5"/> {product?.category}
                      </span>
                      <div className="flex items-center"></div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                      {product?.product_name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product?.description?.substring(0, 50)}...
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-violet-700 bg-violet-100 px-2 py-1 rounded-4xl">
                        {formatCurrency(product?.price)}
                      </span>

                      <p className="text-lg text-green-500">
                        In Stock:
                        <span className="ml-1 text-lg font-medium text-green-700">
                          {product?.available_quantity}
                        </span>
                      </p>
                    </div>
                    <div className="mt-4 w-full">
                      <Link
                        to={`/products/${product?._id}`}
                        className="inline-flex justify-center w-full text-center items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-red-800 transform hover:scale-105 transition-all duration-300"
                      >
                        <FaEye className="mr-2" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
