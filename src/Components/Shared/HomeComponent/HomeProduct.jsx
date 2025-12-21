import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaStar, FaShoppingCart, FaEye, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Components/Common/Loding/Loding";

const HomeProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get(
        "/products?limit=6&sort=createdAt&order=desc"
      );
      setProducts(res.data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
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
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-medium mb-4">
            Our Collection
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium fashion items
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loading />
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  variants={cardVariants}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={
                        product.images?.[0] ||
                        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                      }
                      alt={product.product_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4">
                      {product.status === "featured" && (
                        <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                          Featured
                        </span>
                      )}
                      {product.available_quantity < 10 && (
                        <span className="ml-2 px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                          Low Stock
                        </span>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                        <FaShoppingCart className="w-5 h-5 text-gray-700" />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
                        {product.category}
                      </span>
                      <div className="flex items-center">
                        <FaStar className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">4.8</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                      {product.product_name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description?.substring(0, 100)}...
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">
                          {formatCurrency(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            {formatCurrency(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      <Link
                        to={`/product-details/${product._id}`}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-red-800 transform hover:scale-105 transition-all duration-300"
                      >
                        <FaEye className="mr-2" />
                        View Details
                      </Link>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Stock: {product.available_quantity || 0}</span>
                        <span>MOQ: {product.moq || 100}+</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* View All Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-center mt-12"
            >
              <Link
                to="/all-products"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full hover:from-red-700 hover:to-red-800 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View All Products
                <FaArrowRight className="ml-3" />
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default HomeProduct;
