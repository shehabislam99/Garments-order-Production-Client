import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaBox, FaTasks, FaUsers } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const DashboardOverview = ({ stats }) => (
  <div className="p-6">
    <div className="mb-8 text-center">
      <h2 className="text-3xl flex justify-center font-bold">Welcome back</h2>
      <p className="mt-2">Admin operations at a glance</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="custom-bg rounded-4xl shadow p-6">
        <div className="ml-4 text-center">
          <p className="text-xl font-medium">Total Products</p>
          <p className="text-2xl mt-1 font-semibold text-blue-500">
            {stats?.allProducts || 0}
          </p>
        </div>
      </div>

      <div className="custom-bg rounded-4xl shadow p-6">
        <div className="ml-4 text-center">
          <p className="text-xl font-medium">Total Users</p>
          <p className="text-2xl mt-1 font-semibold text-purple-900">
            {stats?.allUsers || 0}
          </p>
        </div>
      </div>

      <div className="custom-bg rounded-4xl shadow p-6">
        <div className="ml-4 text-center">
          <p className="text-xl font-medium">Revenue</p>
          <p className="text-2xl mt-1 font-semibold text-green-600">
            ${stats?.totalRevenue?.toFixed(2) || "0.00"}
          </p>
        </div>
      </div>
    </div>

      <h3 className="text-lg font-bold text-center">Quick Actions</h3>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <Link to="/dashboard/manage-users">
          <button className="flex items-center custom-bg p-3 rounded-4xl hover:bg-red-400">
            <div className="flex-shrink-0 text-blue-500 bg-blue-100 rounded-lg p-3 mr-4">
              <FaUsers className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-lg font-semibold">Manage Users</p>
              <p className="text-lg">Review roles and suspensions</p>
            </div>
          </button>
        </Link>

        <Link to="/dashboard/all-product">
          <button className="flex items-center custom-bg p-3 rounded-4xl hover:bg-red-400">
            <div className="flex-shrink-0 text-green-500 bg-green-100 rounded-lg p-3 mr-4">
              <FaBox className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-lg font-semibold">All Products</p>
              <p className="text-lg">Check catalog and inventory</p>
            </div>
          </button>
        </Link>

        <Link to="/dashboard/all-orders">
          <button className="flex items-center custom-bg p-3 rounded-4xl hover:bg-red-400">
            <div className="flex-shrink-0 text-purple-500 bg-purple-100 rounded-lg p-3 mr-4">
              <FaTasks className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-lg font-semibold">All Orders</p>
              <p className="text-lg">Track status and fulfillment</p>
            </div>
          </button>
        </Link>
      </div>
    
  </div>
);

const AdminDashBoard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState({
    allProducts: 0,
    allUsers: 0,
    totalRevenue: 0,
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartRange, setChartRange] = useState(6);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, ordersRes] = await Promise.all([
          axiosSecure.get("/admin/stats"),
          axiosSecure.get("/orders?limit=12&status=all"),
        ]);

        setStats(statsRes?.data?.data || stats);
        setOrders(ordersRes?.data?.data || []);
      } catch (error) {
        console.error("Error loading admin dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosSecure]);

  const chartData = useMemo(() => {
    const sliced = orders.slice(0, chartRange);
    return {
      labels: sliced.map((order) =>
        new Date(order?.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      ),
      datasets: [
        {
          label: "Order Revenue(Latest Orders)",
          data: sliced.map((order) => Number(order?.totalPrice) || 0),
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.15)",
          tension: 0.4,
          fill: true,
          pointRadius: 4,
        },
      ],
    };
  }, [orders, chartRange]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { position: "top" },
      },
      scales: {
        y: {
          ticks: {
            callback: (value) => `$${value}`,
          },
        },
      },
    }),
    [],
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="custom-bg rounded-4xl shadow">
          <div className="px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold ">Dashboard</h1>
              <p className="text-sm ">
                Welcome, <span className="font-medium">{user?.email}</span>
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <DashboardOverview stats={stats} />
          <div className="px-6">
            <div className="custom-bg rounded-4xl shadow p-4">
              <h2 className="text-xl text-center font-semibold">
                Revenue chart
              </h2>
              <div className="my-2 text-sm text-center">
                Showing the latest {chartRange} orders. You can change this
                value in the chart config if needed.
              </div>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashBoard;
