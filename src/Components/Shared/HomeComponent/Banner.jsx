import React from "react";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaShoppingBag,
  FaTruck,
  FaHeadset,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-medium mb-6"
            >
              <FaTruck className="mr-2" />
              Free Shipping on All Orders
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
            >
              Premium Quality
              <span className="text-blue-600 block">Fashion Products</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg lg:text-xl text-gray-600 mb-8 max-w-2xl"
            >
              Discover our exclusive collection of handcrafted fashion items.
              Each product is designed with attention to detail and made from
              premium materials.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/all-products"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-red-800 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FaShoppingBag className="mr-3" />
                Shop Now
                <FaArrowRight className="ml-3" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-800 font-semibold rounded-full hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 border-2 border-gray-200"
              >
                Learn More
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-12 grid grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">500+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">100+</div>
                <div className="text-gray-600">Products</div>
              </div>
              <div className="text-center lg:col-span-1">
                <div className="text-3xl font-bold text-blue-600">24/7</div>
                <div className="text-gray-600">Support</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Fashion Collection"
                className="w-full h-full object-cover"
              />
              {/* Overlay Elements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg max-w-xs"
              >
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-semibold">Trending Now</span>
                </div>
                <h3 className="font-bold text-gray-900">
                  Summer Collection 2024
                </h3>
                <p className="text-sm text-gray-600">Limited edition designs</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute top-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg"
              >
                <FaHeadset className="w-8 h-8" />
              </motion.div>
            </div>

            {/* Floating Elements */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute -bottom-6 -left-6 bg-amber-500 text-white rounded-2xl p-4 shadow-lg z-10"
            >
              <div className="text-2xl font-bold">30% OFF</div>
              <div className="text-sm">On First Order</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
};

export default Banner;
