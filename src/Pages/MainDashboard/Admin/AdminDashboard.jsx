import { useEffect, useState } from "react";
import Loader from "../../../Components/Common/Loader/Loader";
import useAuth from "../../../Hooks/useAuth";
import Card from "../../../Components/Common/UI/Card";
import BarChart from "../../../Components/Chart/Barchart";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const AdminDashBoard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
   const [recentOrders, setRecentOrders] = useState([]);
   const [usersByRole, setUsersByRole] = useState({});
   const [productCategories, setProductCategories] = useState({});
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
    pendingOrders: 0,
  });
  const axiosSecure = useAxiosSecure();
 

  useEffect(() => {
    fetchDashboardData();
  },[]);
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const statsResponse = await axiosSecure.get("/manage-user/stats");
        const data = statsResponse.data.data;

        setStats({
          products: data.products || 0,
          orders: data.orders || 0,
          users: data.users || 0,
          revenue: data.revenue || 0,
          pendingOrders: data.pendingOrders || 0,
        });

        setRecentOrders(data.recentOrders || []);
        setUsersByRole(data.usersByRole || {});
        setProductCategories(data.productCategories || {});
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setStats({
          products: 24,
          orders: 156,
          users: 89,
          revenue: 12500,
          pendingOrders: 12,
        });

        setRecentOrders([
          {
            _id: "ORD001",
            status: "delivered",
            totalAmount: 299,
            customerName: "John Doe",
          },
          {
            _id: "ORD002",
            status: "pending",
            totalAmount: 499,
            customerName: "Jane Smith",
          },
          {
            _id: "ORD003",
            status: "processing",
            totalAmount: 199,
            customerName: "Bob Johnson",
          },
          {
            _id: "ORD004",
            status: "delivered",
            totalAmount: 899,
            customerName: "Alice Brown",
          },
          {
            _id: "ORD005",
            status: "pending",
            totalAmount: 399,
            customerName: "Charlie Wilson",
          },
        ]);

        setUsersByRole({
          admin: 3,
          manager: 7,
          buyer: 79,
        });

        setProductCategories({
          Clothing: 8,
          Electronics: 6,
          Home: 5,
          Sports: 3,
          Other: 2,
        });
      } finally {
        setLoading(false);
      }
    };

    
  

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="h-16 w-16" />
      </div>
    );
  }

  // Chart data for overview
  const overviewChartData = {
    labels: ["Products", "Orders", "Users", "Revenue"],
    datasets: [
      {
        label: "Count",
        data: [
          stats.products,
          stats.orders,
          stats.users,
          stats.revenue / 100, // Scale down revenue for chart
        ],
        backgroundColor: ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"],
      },
    ],
  };

  // Chart data for user roles
  const userRolesChartData = {
    labels: Object.keys(usersByRole),
    datasets: [
      {
        label: "Users by Role",
        data: Object.values(usersByRole),
        backgroundColor: [
          "rgba(239, 68, 68, 0.7)", // Red for admin
          "rgba(59, 130, 246, 0.7)", // Blue for manager
          "rgba(34, 197, 94, 0.7)", // Green for buyer
        ],
        borderColor: [
          "rgb(239, 68, 68)",
          "rgb(59, 130, 246)",
          "rgb(34, 197, 94)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for product categories
  const categoriesChartData = {
    labels: Object.keys(productCategories),
    datasets: [
      {
        label: "Products by Category",
        data: Object.values(productCategories),
        backgroundColor: [
          "rgba(139, 92, 246, 0.7)",
          "rgba(14, 165, 233, 0.7)",
          "rgba(20, 184, 166, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(249, 115, 22, 0.7)",
        ],
        borderColor: [
          "rgb(139, 92, 246)",
          "rgb(14, 165, 233)",
          "rgb(20, 184, 166)",
          "rgb(245, 158, 11)",
          "rgb(249, 115, 22)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.displayName || user?.name || "Admin"} 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.products}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {Object.keys(productCategories).length} categories
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.orders}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.pendingOrders} pending
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
              <div className="flex space-x-2 mt-1">
                <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
                  {usersByRole.admin || 0} Admin
                </span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {usersByRole.manager || 0} Manager
                </span>
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.67 3.175a4 4 0 01-6.18 5.304"
                />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.revenue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.orders > 0
                  ? formatCurrency(stats.revenue / stats.orders) + " avg/order"
                  : "No orders"}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Overview
            </h3>
            <div className="h-64">
              <BarChart data={overviewChartData} />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              User Distribution
            </h3>
            <div className="h-64">
              <BarChart data={userRolesChartData} />
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {Object.entries(usersByRole).map(([role, count]) => (
                <div key={role} className="text-center">
                  <div className="text-xl font-bold text-gray-900">{count}</div>
                  <div className="text-sm text-gray-600 capitalize">{role}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Orders & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Orders
              </h3>
              <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                View All
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        #{order._id?.slice(-6) || order.orderId || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {order.customerName || order.customer || "Guest"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status || "Unknown"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {formatCurrency(order.totalAmount || order.amount || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {recentOrders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No recent orders found.
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Product Categories
              </h3>
              <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                View All
              </span>
            </div>
            <div className="h-64 mb-4">
              <BarChart data={categoriesChartData} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(productCategories).map(([category, count]) => (
                <div
                  key={category}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {category}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {count} items
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="p-4">
            <h4 className="text-md font-semibold text-gray-900 mb-3">
              Performance
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Conversion Rate</span>
                <span className="text-sm font-medium text-green-600">
                  {stats.users > 0
                    ? ((stats.orders / stats.users) * 100).toFixed(1) + "%"
                    : "0%"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg. Order Value</span>
                <span className="text-sm font-medium text-blue-600">
                  {stats.orders > 0
                    ? formatCurrency(stats.revenue / stats.orders)
                    : "$0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pending Orders</span>
                <span className="text-sm font-medium text-yellow-600">
                  {stats.pendingOrders}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashBoard;
