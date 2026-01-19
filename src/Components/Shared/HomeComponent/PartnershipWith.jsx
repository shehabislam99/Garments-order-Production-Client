import React from "react";
import { motion } from "framer-motion";
import {
  FaHandshake,
  FaChartLine,
  FaGlobeAmericas,
  FaUsers,
  FaLightbulb,
  FaShieldAlt,
  FaGift,
  FaHeadset,
} from "react-icons/fa";
import {
  MdTrendingUp,
  MdAttachMoney,
  MdWorkspacePremium,
} from "react-icons/md";

const PartnershipWith = () => {
  const partnerBenefits = [
    {
      icon: <FaHandshake />,
      title: "Strategic Partnership",
      description: "Build long-term relationships with mutual growth",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <FaChartLine />,
      title: "Revenue Growth",
      description: "Increase sales with our proven business model",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: <FaGlobeAmericas />,
      title: "Global Reach",
      description: "Access to international markets and customers",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <FaUsers />,
      title: "Dedicated Support",
      description: "Personal account manager for your brand",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: <FaLightbulb />,
      title: "Innovation",
      description: "Stay ahead with cutting-edge fashion trends",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: <MdTrendingUp />,
      title: "Market Insights",
      description: "Access to analytics and consumer data",
      color: "from-red-500 to-red-600",
    },
    {
      icon: <MdAttachMoney />,
      title: "Competitive Margin",
      description: "Attractive profit margins for partners",
      color: "from-green-500 to-green-600",
    },
    {
      icon: <FaShieldAlt />,
      title: "Brand Protection",
      description: "Strong intellectual property protection",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      icon: <MdWorkspacePremium />,
      title: "Premium Positioning",
      description: "Position your brand in premium market segments",
      color: "from-teal-500 to-teal-600",
    },
  ];

  const brands = [
    { name: "FashionHub", logo: "FH", color: "bg-pink-500" },
    { name: "UrbanStyle", logo: "US", color: "bg-blue-500" },
    { name: "EcoWear", logo: "EW", color: "bg-green-500" },
    { name: "LuxeApparel", logo: "LA", color: "bg-purple-500" },
    { name: "ModernThreads", logo: "MT", color: "bg-amber-500" },
    { name: "StyleCraft", logo: "SC", color: "bg-indigo-500" },
  ];

  return (
    <section className="py-16 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-medium mb-4">
            Partnership With
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Partner with Leading Brands
          </h2>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            Join our network of premium brands and grow together in the fashion
            industry
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            Our Trusted Partners
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {brands.map((brand, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-amber-100 rounded-4xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center"
              >
                <div
                  className={`${brand.color} w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4`}
                >
                  {brand.logo}
                </div>
                <h4 className="font-semibold text-gray-800">{brand.name}</h4>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partnerBenefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              className="relative group"
            >
              <div className="relative bg-amber-100 rounded-4xl flex flex-col items-center p-8 shadow-xl group-hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-transparent">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.color} text-white mb-6`}
                >
                  <div className="text-2xl">{benefit.icon}</div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-center font-medium text-gray-700">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnershipWith;
