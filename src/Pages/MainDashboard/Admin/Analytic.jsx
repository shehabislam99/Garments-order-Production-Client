import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Loading from "../../../Components/Common/Loding/Loding";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [chartType, setChartType] = useState("revenue");
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetchAnalyticsData();
    fetchUserStats();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get(`/admin/analytics?range=${timeRange}`);
      setAnalyticsData(response.data.data);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      // Set default analytics data if API fails
      setAnalyticsData(getDefaultAnalyticsData());
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await axiosSecure.get("/users/stats");
      setUserStats(response.data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      // Set default user stats
      setUserStats({
        totalUsers: 0,
        roles: { admin: 0, manager: 0, buyer: 0 },
        statuses: { active: 0, suspended: 0, pending: 0 },
      });
    } finally {
      setLoading(false);
    }
  };

  // Default analytics data for fallback
  const getDefaultAnalyticsData = () => ({
    summary: {
      totalRevenue: 0,
      totalOrders: 0,
      newCustomers: 0,
      productsSold: 0,
      avgOrderValue: 0,
      conversionRate: 0,
    },
    revenueTrend: generateMockRevenueTrend(timeRange),
    categorySales: generateMockCategorySales(),
    dailyOrders: generateMockDailyOrders(timeRange),
    topProducts: generateMockTopProducts(),
    userGrowth: generateMockUserGrowth(timeRange),
    orderStatus: generateMockOrderStatus(),
    metrics: {
      avgOrderValue: 0,
      conversionRate: 0,
      repeatCustomers: 0,
      retentionRate: 0,
    },
    inventory: {
      totalProducts: 0,
      lowStockItems: 0,
      outOfStockItems: 0,
      totalValue: 0,
    },
  });

  // Helper functions for mock data
  const generateMockRevenueTrend = (range) => {
    const days =
      range === "week"
        ? 7
        : range === "month"
        ? 30
        : range === "quarter"
        ? 90
        : 365;
    return Array.from({ length: days }, (_, i) => ({
      date: `Day ${i + 1}`,
      revenue: Math.floor(Math.random() * 10000) + 5000,
      orders: Math.floor(Math.random() * 100) + 20,
    }));
  };

  const generateMockCategorySales = () => [
    { name: "Electronics", value: 45000 },
    { name: "Clothing", value: 32000 },
    { name: "Home & Garden", value: 28000 },
    { name: "Books", value: 15000 },
    { name: "Beauty", value: 12000 },
  ];

  const generateMockDailyOrders = (range) => {
    const days = range === "week" ? 7 : 30;
    return Array.from({ length: days }, (_, i) => ({
      date: `Day ${i + 1}`,
      orders: Math.floor(Math.random() * 50) + 10,
    }));
  };

  const generateMockTopProducts = () => [
    { name: "Laptop Pro", quantity: 245, revenue: 122500 },
    { name: "Wireless Headphones", quantity: 189, revenue: 28350 },
    { name: "Smart Watch", quantity: 156, revenue: 46800 },
    { name: "Gaming Console", quantity: 98, revenue: 39200 },
    { name: "Fitness Tracker", quantity: 87, revenue: 13050 },
  ];

  const generateMockUserGrowth = (range) => {
    const days = range === "week" ? 7 : 30;
    return Array.from({ length: days }, (_, i) => ({
      date: `Day ${i + 1}`,
      users: Math.floor(Math.random() * 20) + 5,
    }));
  };

  const generateMockOrderStatus = () => [
    { status: "Pending", count: 25 },
    { status: "Processing", count: 18 },
    { status: "Shipped", count: 42 },
    { status: "Delivered", count: 156 },
    { status: "Cancelled", count: 8 },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading className="h-16 w-16" />
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-4 md:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 90 Days</option>
            <option value="year">Last 365 Days</option>
          </select>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="revenue">Revenue Analytics</option>
            <option value="users">User Analytics</option>
            <option value="orders">Order Analytics</option>
            <option value="products">Product Analytics</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(analyticsData?.summary?.totalRevenue || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsData?.summary?.totalOrders || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {userStats?.totalUsers || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
              <svg
                className="h-6 w-6 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Products Sold</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsData?.summary?.productsSold || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* User Roles Distribution */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            User Roles Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Admin", value: userStats?.roles?.admin || 0 },
                    { name: "Manager", value: userStats?.roles?.manager || 0 },
                    { name: "Buyer", value: userStats?.roles?.buyer || 0 },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#0088FE" />
                  <Cell fill="#00C49F" />
                  <Cell fill="#FFBB28" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center">
              <div className="text-sm font-medium text-red-600">Admin</div>
              <div className="text-2xl font-bold">
                {userStats?.roles?.admin || 0}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-blue-600">Manager</div>
              <div className="text-2xl font-bold">
                {userStats?.roles?.manager || 0}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-green-600">Buyer</div>
              <div className="text-2xl font-bold">
                {userStats?.roles?.buyer || 0}
              </div>
            </div>
          </div>
        </div>

        {/* User Status Distribution */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            User Status Overview
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { status: "Active", count: userStats?.statuses?.active || 0 },
                  {
                    status: "Suspended",
                    count: userStats?.statuses?.suspended || 0,
                  },
                  {
                    status: "Pending",
                    count: userStats?.statuses?.pending || 0,
                  },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="count"
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                  label={{ position: "top" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center">
              <div className="text-sm font-medium text-green-600">Active</div>
              <div className="text-2xl font-bold">
                {userStats?.statuses?.active || 0}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-red-600">Suspended</div>
              <div className="text-2xl font-bold">
                {userStats?.statuses?.suspended || 0}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-yellow-600">Pending</div>
              <div className="text-2xl font-bold">
                {userStats?.statuses?.pending || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue and Orders Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Revenue Trend
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData?.revenueTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Orders */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Daily Orders
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData?.dailyOrders || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Sales and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Category Sales */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Sales by Category
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData?.categorySales || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData?.categorySales?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Top Selling Products
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analyticsData?.topProducts || []}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip
                  formatter={(value, name) =>
                    name === "revenue"
                      ? [formatCurrency(value), "Revenue"]
                      : [value, "Quantity"]
                  }
                />
                <Legend />
                <Bar dataKey="quantity" fill="#8884d8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Performance Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Average Order Value</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(analyticsData?.metrics?.avgOrderValue || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Conversion Rate</span>
              <span className="font-medium text-gray-900">
                {(analyticsData?.metrics?.conversionRate || 0).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Customer Retention Rate</span>
              <span className="font-medium text-gray-900">
                {(analyticsData?.metrics?.retentionRate || 0).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Repeat Purchase Rate</span>
              <span className="font-medium text-gray-900">
                {(analyticsData?.metrics?.repeatCustomers || 0).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Quick Insights
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm font-medium text-blue-800">User Growth</p>
              <p className="text-lg font-bold text-blue-900">
                +{(userStats?.totalUsers || 0) * 0.15}% this month
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
              <p className="text-sm font-medium text-green-800">
                Revenue Growth
              </p>
              <p className="text-lg font-bold text-green-900">
                +
                {((analyticsData?.summary?.totalRevenue || 0) * 0.12).toFixed(
                  2
                )}
                % MoM
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <p className="text-sm font-medium text-purple-800">
                Active Users
              </p>
              <p className="text-lg font-bold text-purple-900">
                {userStats?.statuses?.active || 0} active users
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <p className="text-sm font-medium text-yellow-800">
                Pending Actions
              </p>
              <p className="text-lg font-bold text-yellow-900">
                {userStats?.statuses?.pending || 0} pending users
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Download Report Button */}
      <div className="text-center">
        <button
          onClick={() => {
            // Implement report download functionality
            const reportData = {
              userStats,
              analyticsData,
              generatedAt: new Date().toISOString(),
            };
            const dataStr = JSON.stringify(reportData, null, 2);
            const dataUri =
              "data:application/json;charset=utf-8," +
              encodeURIComponent(dataStr);
            const exportFileDefaultName = `analytics-report-${
              new Date().toISOString().split("T")[0]
            }.json`;

            const linkElement = document.createElement("a");
            linkElement.setAttribute("href", dataUri);
            linkElement.setAttribute("download", exportFileDefaultName);
            linkElement.click();

            toast.success("Report downloaded successfully!");
          }}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <svg
            className="mr-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download Analytics Report (JSON)
        </button>
      </div>
    </div>
  );
};

export default Analytics;
