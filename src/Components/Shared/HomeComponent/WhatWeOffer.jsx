import React from "react";
import { motion } from "framer-motion";
import {
  FaAward,
  FaGlobeAmericas,
  FaHeart,
  FaShippingFast,
  FaTshirt,
  FaUsers,
} from "react-icons/fa";

const WhatWeOffer = () => {
  const ServiceData = [
    {
      icon: <FaTshirt />,
      title: "Custom Production",
      desc: "Tailored garment manufacturing from concept to completion",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: <FaShippingFast />,
      title: "Bulk Manufacturing",
      desc: "Large-scale production with consistent quality control",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <FaHeart />,
      title: "Pattern Making",
      desc: "Expert pattern development and sampling services",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: <FaAward />,
      title: "Quality Assurance",
      desc: "Rigorous inspections and finishing processes",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: <FaGlobeAmericas />,
      title: "Global Logistics",
      desc: "Worldwide shipping and supply chain management",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: <FaUsers />,
      title: "Brand Consultation",
      desc: "Strategic guidance for apparel business success",
      color: "bg-violet-100 text-violet-600",
    },
  ];

  return (
    <section className="mt-10 lg:mt-15">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading Animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >  <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6 }}
                          className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 text-blue-600 font-medium mb-4"
                        >
                          Our Promise
                        </motion.div>
          <h2 className="text-4xl font-bold mb-4">What We Offer</h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Comprehensive garment manufacturing solutions for brands of all
            sizes
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ServiceData.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.15,
                duration: 0.5,
              }}
              whileHover={{ y: -8 }}
              className="custom-bg p-8 rounded-4xl flex flex-col items-center shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${service.color} mb-6`}
              >
                <div className="text-2xl">{service.icon}</div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {service.title}
              </h3>

              <p className="text-center font-medium text-gray-700">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeOffer;
