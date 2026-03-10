import React, { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Components/Common/Loding/Loding";

const CHART_COLORS = ["#2563eb", "#0f766e", "#d97706", "#dc2626", "#7c3aed"];

const formatCurrency = (value) =>
  `$${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

const ChartCard = ({ title, children }) => (
  <div className="rounded-4xl custom-bg p-6 shadow">
    <div className="mb-3">
      <h2 className="text-xl font-semibold ">{title}</h2>
    </div>
    <div className="h-64">{children}</div>
  </div>
);

const AdminAnalytics = () => {
  const axiosSecure = useAxiosSecure();
  const [data, setData] = useState({
    metrics: {},
    categories: [],
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axiosSecure.get("/admin/analytics");
        setData({
          metrics: response?.data?.data?.metrics || {},
          categories: response?.data?.data?.categories || [],
          recentOrders: response?.data?.data?.recentOrders || [],
        });
      } catch (err) {
        console.error("Failed to load admin analytics", err);
        setError("Unable to load analytics data right now.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [axiosSecure]);

  const chartData = useMemo(
    () =>
      data.categories.map((category, index) => ({
        name: category.category || `Segment ${index + 1}`,
        value: Number(category.value ?? 0),
      })),
    [data.categories],
  );

  const lineData = useMemo(() => {
    const grouped = {};
    data.recentOrders.forEach((order) => {
      const dateKey = new Date(order?.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!grouped[dateKey]) {
        grouped[dateKey] = { date: dateKey, revenue: 0, orders: 0 };
      }
      grouped[dateKey].revenue += Number(order?.totalPrice || 0);
      grouped[dateKey].orders += 1;
    });
    return Object.values(grouped).slice(-6);
  }, [data.recentOrders]);

  const statusDistribution = useMemo(() => {
    const map = {};
    data.recentOrders.forEach((order) => {
      const status = (order?.status || "unknown").toLowerCase();
      map[status] = (map[status] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({
      name: name.toUpperCase(),
      value,
    }));
  }, [data.recentOrders]);


  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-3 min-h-screen">
      {error && (
        <div className="mb-4 rounded-3xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="flex flex-wrap mb-5">
        <div>
          <h2 className="text-2xl font-bold"> Analytics</h2>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[
          {
            label: "Total Orders",
            value: data.metrics.totalOrders ?? 0,
          },
          {
            label: "Revenue",
            value: formatCurrency(data.metrics.revenue ?? 0),
          },
          {
            label: "Active Users",
            value: data.metrics.activeUsers ?? 0,
          },
        ].map((metric) => (
          <div
            key={metric.label}
            className="custom-bg rounded-4xl p-6 shadow min-h-[130px]"
          >
            <p className="text-xl font-semibold  text-center">{metric.label}</p>
            <p className="mt-4 text-3xl font-bold text-center text-green-700">
              {metric.value}
            </p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Product Category Revenue">
          {chartData.length ?
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Bar dataKey="value" fill="#2563eb" radius={[10, 10, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          : <p className="text-sm text-gray-500">
              No category breakdown is available yet.
            </p>
          }
        </ChartCard>

        <ChartCard title="Latest six Order Trend">
          {lineData.length ?
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip
                  formatter={(value, name) =>
                    name === "revenue" ? `$${value}` : value
                  }
                />
                <Legend />
                <Bar dataKey="revenue" fill="#16a34a" name="Revenue" />
                <Bar dataKey="orders" fill="#0f766e" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          : <p className="text-sm text-gray-500">
              Not enough order history returned yet.
            </p>
          }
        </ChartCard>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Per-order Status Snapshot">
          {statusDistribution.length ?
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          : <p className="text-sm text-gray-500">
              Status data will appear once orders return statuses.
            </p>
          }
        </ChartCard>

        <div className="rounded-4xl custom-bg p-6 shadow">
          <h2 className="text-xl font-semibold  mb-4">
            Most recent Orders entries
          </h2>
          <div className="space-y-4">
            {data.recentOrders.length === 0 && (
              <p className="text-sm text-gray-500">
                No recent orders available yet.
              </p>
            )}
            {data.recentOrders.map((order) => (
              <div
                key={order?._id}
                className="flex items-center justify-between rounded-3xl border border-gray-100 p-4"
              >
                <div>
                  <p className="text-sm font-semibold ">
                    #{order?._id?.slice(0, 10) || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order?.CustomerEmail || "Unknown customer"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-600">
                    ${Number(order?.totalPrice || 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(
                      order?.createdAt || Date.now(),
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminAnalytics;
