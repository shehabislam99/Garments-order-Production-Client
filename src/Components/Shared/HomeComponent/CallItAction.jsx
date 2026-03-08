import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CallItAction = () => {
  return (
    <section className="mt-10 lg:mt-15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-10"
            >
              <div className="text-center mb-10">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-medium mb-4"
                >
                  Action Now
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
                  className="text-xl  max-w-3xl mx-auto mb-8"
                >
                  Join thousands of satisfied customers who have transformed
                  their warhouse with our premium collection
                </motion.p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-center"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-15">
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full hover:bg-red-800 transform hover:-translate-y-1 transition-all duration-300 shadow-md  hover:shadow-xl"
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

export default CallItAction;
