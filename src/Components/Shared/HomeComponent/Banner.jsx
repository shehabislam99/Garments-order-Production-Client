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
    <div className="relative overflow-hidden ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Premium Quality
              <span className="text-indigo-600 block">Garments Products</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg lg:text-xl text-gray-400 mb-8 max-w-2xl"
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
                className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full hover:bg-red-800 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FaShoppingBag className="mr-3" />
                Book Now
                <FaArrowRight className="ml-3" />
              </Link>
            </motion.div>

          </motion.div>

          
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
                className="absolute bottom-6 left-6 bg-amber-100  rounded-4xl p-4 shadow-lg max-w-xs"
              >
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                  <span className="text-sm text-indigo-600 font-semibold">Trending Now</span>
                </div>
                <h3 className="font-bold text-black">
                  Summer Collection 2025
                </h3>
                <p className="text-sm text-gray-700">Limited edition designs</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
