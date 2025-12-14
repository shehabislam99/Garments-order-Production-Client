import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement, 
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const BarChart = ({
  data,
  title = "",
  type = "bar",
  height = 300,
  width = "100%",
  showLegend = true,
  showGrid = true,
  showTooltips = true,
  options = {},
  className = "",
}) => {
  // Default chart options
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: "top",
        labels: {
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
        },
      },
      title: {
        display: !!title,
        text: title,
        font: {
          family: "'Inter', sans-serif",
          size: 16,
          weight: "600",
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        enabled: showTooltips,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleFont: {
          family: "'Inter', sans-serif",
          size: 12,
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12,
        },
        padding: 10,
        cornerRadius: 6,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: showGrid,
          drawBorder: false,
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          color: "#6B7280",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: showGrid,
          drawBorder: false,
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          color: "#6B7280",
          callback: function (value) {
            // Format large numbers
            if (value >= 1000) {
              return (value / 1000).toFixed(1) + "k";
            }
            return value;
          },
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 6,
        borderSkipped: false,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return null;
          }

          // Create gradient effect
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top
          );

          if (context.dataIndex % 3 === 0) {
            gradient.addColorStop(0, "rgba(79, 70, 229, 0.8)");
            gradient.addColorStop(1, "rgba(79, 70, 229, 1)");
          } else if (context.dataIndex % 3 === 1) {
            gradient.addColorStop(0, "rgba(16, 185, 129, 0.8)");
            gradient.addColorStop(1, "rgba(16, 185, 129, 1)");
          } else {
            gradient.addColorStop(0, "rgba(245, 158, 11, 0.8)");
            gradient.addColorStop(1, "rgba(245, 158, 11, 1)");
          }

          return gradient;
        },
        borderWidth: 0,
        hoverBackgroundColor: (context) => {
          // Darken on hover
          const originalColor =
            context.dataset.backgroundColor[context.dataIndex];
          if (typeof originalColor === "string") {
            return originalColor
              .replace(/0\.8\)$/, "1)")
              .replace(/0\.\d+\)$/, "1)");
          }
          return originalColor;
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
    // Merge with custom options
    ...options,
  };

  // Prepare chart data with default values
  const chartData = {
    labels: data?.labels || [],
    datasets:
      data?.datasets?.map((dataset) => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor || [
          "rgba(79, 70, 229, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(14, 165, 233, 0.7)",
        ],
        borderColor: dataset.borderColor || [
          "rgb(79, 70, 229)",
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(239, 68, 68)",
          "rgb(139, 92, 246)",
          "rgb(14, 165, 233)",
        ],
        borderWidth: dataset.borderWidth || 1,
        borderRadius: dataset.borderRadius || 6,
        barPercentage: dataset.barPercentage || 0.7,
        categoryPercentage: dataset.categoryPercentage || 0.8,
        hoverBorderWidth: dataset.hoverBorderWidth || 2,
      })) || [],
  };

  // If no data, show placeholder
  if (!data || !data.labels || data.labels.length === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-50 rounded-lg ${className}`}
        style={{ height, width }}
      >
        <div className="text-center">
          <div className="text-gray-400 mb-2">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No data available</p>
          <p className="text-gray-400 text-sm mt-1">
            Add data to display chart
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ height, width }}>
      {type === "doughnut" || type === "pie" ? (
        <Doughnut
          data={chartData}
          options={{
            ...defaultOptions,
            plugins: {
              ...defaultOptions.plugins,
              legend: {
                ...defaultOptions.plugins.legend,
                position: "right",
              },
            },
          }}
        />
      ) : (
        <Bar data={chartData} options={defaultOptions} />
      )}
    </div>
  );
};


export default BarChart;


 
