import React from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaWhatsapp,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const CTAsection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative z-10">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 font-medium mb-6"
              >
                Get Started
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-3xl lg:text-5xl font-bold text-white mb-6"
              >
                Ready to Elevate Your Style?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
              >
                Join thousands of satisfied customers who have transformed their
                wardrobe with our premium collection
              </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Contact Methods */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-300 mb-6">
                  <FaEnvelope className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Email Us</h3>
                <p className="text-gray-300 mb-4">
                  Get quick responses to your queries
                </p>
                <a
                  href="mailto:support@fashionstore.com"
                  className="text-blue-300 hover:text-blue-200 font-medium"
                >
                  support@fashionstore.com
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/20 text-green-300 mb-6">
                  <FaPhoneAlt className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Call Us</h3>
                <p className="text-gray-300 mb-4">
                  Available 24/7 for your convenience
                </p>
                <a
                  href="tel:+18005551234"
                  className="text-green-300 hover:text-green-200 font-medium"
                >
                  +1 (800) 555-1234
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-600/20 text-green-400 mb-6">
                  <FaWhatsapp className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">WhatsApp</h3>
                <p className="text-gray-300 mb-4">Instant messaging support</p>
                <a
                  href="https://wa.me/18005551234"
                  className="text-green-400 hover:text-green-300 font-medium"
                >
                  Chat with us now
                </a>
              </motion.div>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-center"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/all-products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full hover:from-blue-500 hover:to-blue-600 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Browse Collection
                  <FaArrowRight className="ml-3" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/20 transform hover:-translate-y-1 transition-all duration-300 border border-white/20"
                >
                  Contact Sales Team
                </Link>
              </div>

              {/* Newsletter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-12 max-w-md mx-auto"
              >
                <p className="text-gray-300 mb-4">
                  Subscribe to our newsletter
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-3 rounded-l-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-r-full hover:from-blue-500 hover:to-blue-600 transition-all duration-300">
                    Subscribe
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTAsection;
