import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaBoxes,
  FaLayerGroup,
  FaMoneyBillWave,
  FaWarehouse,
} from "react-icons/fa";
import { axiosInstance } from "../../../Hooks/useAxios";

const IndustryStats = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    categories: 0,
    avgPrice: 0,
  });
  const [counters, setCounters] = useState([0, 0, 0, 0]);
  const [statsInView, setStatsInView] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      const response = await axiosInstance.get("/products");
      const items = response?.data?.data || [];
      const totalProducts = items.length;
      const totalStock = items.reduce(
        (sum, item) => sum + Number(item?.available_quantity || 0),
        0,
      );
      const categories = new Set(
        items.map((item) => item?.category).filter(Boolean),
      ).size;
      const avgPrice =
        totalProducts === 0 ? 0 : (
          items.reduce((sum, item) => sum + Number(item?.price || 0), 0) /
          totalProducts
        );

      setStats({
        totalProducts,
        totalStock,
        categories,
        avgPrice,
      });
    };

    loadStats();
  }, []);

  const statsConfig = [
    {
      icon: <FaBoxes />,
      value: stats.totalProducts,
      label: "Live Products",
      suffix: "",
      color: "text-green-600",
    },
    {
      icon: <FaWarehouse />,
      value: stats.totalStock,
      label: "Available Units",
      suffix: "",
      color: "text-violet-600",
    },
    {
      icon: <FaLayerGroup />,
      value: stats.categories,
      label: "Product Categories",
      suffix: "",
      color: "text-indigo-600",
    },
    {
      icon: <FaMoneyBillWave />,
      value: Number(stats.avgPrice.toFixed(2)),
      label: "Average Unit Price",
      suffix: "",
      prefix: "$",
      color: "text-purple-600",
    },
  ];

  useEffect(() => {
    if (!statsInView) return;

    const interval = setInterval(() => {
      setCounters((prev) => {
        const next = [...prev];
        statsConfig.forEach((stat, index) => {
          if (next[index] < stat.value) {
            const increment = Math.max(1, Math.ceil(stat.value / 50));
            next[index] = Math.min(next[index] + increment, stat.value);
          }
        });
        return next;
      });
    }, 50);

    if (
      counters.every((counter, index) => counter >= statsConfig[index].value)
    ) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [statsInView, counters, statsConfig]);

  return (
    <section className="mt-10 lg:mt-15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onViewportEnter={() => setStatsInView(true)}
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
                  Our Impact
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-3xl lg:text-5xl font-bold mb-6"
                >
                  Production Snapshot
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-xl max-w-3xl mx-auto mb-8"
                >
                  Live metrics from your product catalog, inventory depth, and
                  average pricing.
                </motion.p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {statsConfig.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
                    className="custom-bg rounded-4xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-16 h-16 rounded-4xl bg-gradient-to-br ${stat.color.replace("text-", "bg-").replace("-600", "-100")} flex items-center justify-center mb-4`}
                      >
                        <div className={`text-2xl ${stat.color}`}>
                          {stat.icon}
                        </div>
                      </div>

                      <div className="text-4xl font-bold mb-2">
                        {stat.prefix || ""}
                        {index === 3 ?
                          counters[index].toFixed(2)
                        : counters[index].toLocaleString()}
                        {stat.suffix}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-500">
                        {stat.label}
                      </h3>

                      <div className="mt-4 w-12 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustryStats;
