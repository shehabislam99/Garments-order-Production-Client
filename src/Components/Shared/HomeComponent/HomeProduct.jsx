import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaRegPlayCircle, FaEye, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import {} from "react-icons/fa";
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
      const res = await axiosSecure.get("/products?limit=6&Pstatus=show");
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
    <section className="mt-10 lg:mt-15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-medium mb-4">
            Our Collection
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold  mb-4">
            Featured Products
          </h2>
          <p className="text-lg  max-w-2xl mx-auto">
            Discover our premium garments items
          </p>
        </motion.div>

        {loading ?
          <div className="flex justify-center items-center h-64">
            <Loading />
          </div>
        : <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product?._id}
                  variants={cardVariants}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="group bg-white rounded-3xl overflow-hidden shadow-md  hover:shadow-2xl transition-all duration-300"
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

                  <div className="p-6 custom-bg">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                      {product?.product_name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product?.description?.substring(0, 50)}...
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-violet-700 bg-violet-100 px-2 py-1 rounded-4xl">
                          {formatCurrency(product?.price)}
                        </span>
                      </div>

                      <Link
                        to={`/products/${product?._id}`}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-red-800 transform hover:scale-105 transition-all duration-300"
                      >
                        <FaEye className="mr-2" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-center mt-10"
            >
              <Link
                to="/all-products"
                className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full hover:from-red-700 hover:to-red-800 transform hover:-translate-y-1 transition-all duration-300 shadow-md  hover:shadow-xl"
              >
                View All Products
                <FaArrowRight className="ml-3" />
              </Link>
            </motion.div>
          </>
        }
      </div>
    </section>
  );
};

export default HomeProduct;
