import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaTshirt,
  FaUsers,
  FaGlobeAmericas,
  FaStar,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const STAsection = () => {
  const [counters, setCounters] = useState([0, 0, 0, 0]);
  const [statsInView, setStatsInView] = useState(false);

  const stats = [
    {
      icon: <FaTshirt />,
      value: 50000,
      label: "Garments Produced",
      suffix: "+",
      color: "text-green-600",
    },
    {
      icon: <FaUsers />,
      value: 500,
      label: "Happy Clients",
      suffix: "+",
      color: "text-violet-600",
    },
    {
      icon: <FaStar />,
      value: 98,
      label: "Client Satisfaction",
      suffix: "%",
      color: "text-indigo-600",
    },
    {
      icon: <FaGlobeAmericas />,
      value: 30,
      label: "Countries Served",
      suffix: "+",
      color: "text-purple-600",
    },
  ];

  useEffect(() => {
    if (statsInView) {
      const interval = setInterval(() => {
        setCounters((prev) => {
          const newCounters = [...prev];
          stats.forEach((stat, index) => {
            if (newCounters[index] < stat.value) {
              const increment = Math.ceil(stat.value / 50); // Animate in 50 steps
              newCounters[index] = Math.min(
                newCounters[index] + increment,
                stat.value
              );
            }
          });
          return newCounters;
        });
      }, 50);

      // Stop when all counters reach their target
      if (counters.every((counter, index) => counter >= stats[index].value)) {
        clearInterval(interval);
      }

      return () => clearInterval(interval);
    }
  }, [statsInView, counters]);

  return (
    <section className="py-16 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onViewportEnter={() => setStatsInView(true)}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 text-blue-600 font-medium mb-6"
                >
                  Our Impact
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-3xl lg:text-5xl font-bold mb-6"
                >
                  Ready to Elevate Your Style?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-xl text-gray-500 max-w-3xl mx-auto mb-8"
                >
                  Join thousands of satisfied customers who have transformed
                  their warhouse with our premium collection
                </motion.p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
                    className="bg-amber-100 rounded-4xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color.replace("text-", "bg-").replace("-600", "-100")} flex items-center justify-center mb-4`}
                      >
                        <div className={`text-2xl ${stat.color}`}>
                          {stat.icon}
                        </div>
                      </div>

                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {counters[index].toLocaleString()}
                        {stat.suffix}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-700">
                        {stat.label}
                      </h3>

                      <div className="mt-4 w-12 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-center"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full hover:bg-red-800 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  About Us
                  
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white  font-semibold rounded-full hover:bg-red-800 transform hover:-translate-y-1 transition-all duration-300 border border-white/20"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default STAsection;
