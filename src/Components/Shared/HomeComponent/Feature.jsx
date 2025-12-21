import React from "react";
import { motion } from "framer-motion";
import {
  FaShieldAlt,
  FaLeaf,
  FaTruck,
  FaRecycle,
  FaAward,
  FaHeadset,
} from "react-icons/fa";

const Feature = () => {
  const features = [
    {
      icon: <FaShieldAlt />,
      title: "Premium Quality",
      description: "All products made with highest quality materials",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <FaLeaf />,
      title: "Eco-Friendly",
      description: "Sustainable materials and ethical production",
      color: "from-green-500 to-green-600",
    },
    {
      icon: <FaTruck />,
      title: "Fast Shipping",
      description: "Free shipping on orders above $100",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: <FaRecycle />,
      title: "Easy Returns",
      description: "30-day return policy, no questions asked",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <FaAward />,
      title: "Award Winning",
      description: "Recognized for excellence in craftsmanship",
      color: "from-red-500 to-red-600",
    },
    {
      icon: <FaHeadset />,
      title: "24/7 Support",
      description: "Round-the-clock customer support",
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-600 font-medium mb-4">
            Why Choose Us
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Experience the Difference
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to providing the best shopping experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              className="relative group"
            >
              <div
                className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl blur-xl"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, ${feature.color})`,
                }}
              />

              <div className="relative bg-white rounded-3xl p-8 shadow-xl group-hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-6`}
                >
                  <div className="text-2xl">{feature.icon}</div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>

                {/* Animated Border */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent group-hover:via-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;
