import React from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaShoppingCart,
  FaCreditCard,
  FaTruck,
  FaCheckCircle,
} from "react-icons/fa";

const HowWorks = () => {
  const steps = [
    {
      icon: <FaSearch />,
      title: "Browse Products",
      description: "Explore our extensive collection of premium garments items",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <FaShoppingCart />,
      title: "Add to Cart",
      description: "Select your favorite products and add them to your cart",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: <FaCreditCard />,
      title: "Secure Checkout",
      description: "Complete your purchase with our secure payment system",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: <FaTruck />,
      title: "Fast Delivery",
      description: "Receive your order with our express shipping service",
      color: "bg-amber-100 text-amber-600",
    },
    {
      icon: <FaCheckCircle />,
      title: "Enjoy & Review",
      description: "Share your experience and help others make better choices",
      color: "bg-red-100 text-red-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-16 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-medium mb-4">
            Easy Process
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Simple steps to get your favorite garment items delivered to your
            doorstep?
          </p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={stepVariants}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                className="relative"
              >
           
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-white border-4 border-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-700 z-10">
                  {index + 1}
                </div>
                <div className="bg-amber-100 rounded-4xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${step?.color} mb-6`}
                  >
                    <div className="text-2xl">{step?.icon}</div>
                  </div>

                  <h3 className="text-xl font-bold text-black mb-3">
                    {step?.title}
                  </h3>

                  <p className="text-gray-700">{step?.description}</p>
                  {index < steps.length - 1 && (
                    <div className="lg:hidden absolute -right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowWorks;
