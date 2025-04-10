import React, { useState, useEffect } from "react";
import { FaChartLine, FaUsers, FaShoppingCart, FaBox } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import { api } from "../../config/api";
import { toast } from "sonner";
import "chart.js/auto";

const DashboardHome = () => {
  const [analytics, setAnalytics] = useState({
    top_ordered_items: [],
    top_ordered_categories: [],
    total_fabrics: 0,
    total_blogs: 0,
    total_orders: 0,
    total_users: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get("/analytics/");
      setAnalytics(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  const fabricData = {
    labels: analytics.top_ordered_items.map(
      (item) => item.fabric__title || "Unknown"
    ),
    datasets: [
      {
        label: "Total Orders",
        data: analytics.top_ordered_items.map((item) => item.total_orders),
        backgroundColor: "#4285f4",
        maxBarThickness: 40,
      },
    ],
  };

  const categoryData = {
    labels: analytics.top_ordered_categories.map(
      (category) => category.category_name || "Unknown"
    ),
    datasets: [
      {
        label: "Total Orders",
        data: analytics.top_ordered_categories.map(
          (category) => category.total_orders
        ),
        backgroundColor: "#34a853",
        maxBarThickness: 40,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <div className="dashboard-content">
      {/* Stats Grid */}
      <div
        className="stats-grid"
        onClick={() => console.log(categoryData, fabricData)}
      >
        {/* Fabrics Stat */}
        <div className="stat-card stat-primary">
          <div className="stat-header">
            <div className="stat-icon stat-icon-primary">
              <FaBox />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Total Fabrics</h3>
              <p className="stat-value">{analytics.total_fabrics}</p>
            </div>
          </div>
        </div>

        {/* Users Stat */}
        <div className="stat-card stat-secondary">
          <div className="stat-header">
            <div className="stat-icon stat-icon-secondary">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Total Users</h3>
              <p className="stat-value">{analytics.total_users}</p>
            </div>
          </div>
        </div>

        {/* Orders Stat */}
        <div className="stat-card stat-warning">
          <div className="stat-header">
            <div className="stat-icon stat-icon-warning">
              <FaShoppingCart />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Total Orders</h3>
              <p className="stat-value">{analytics.total_orders}</p>
            </div>
          </div>
        </div>

        {/* Blogs Stat */}
        <div className="stat-card stat-danger">
          <div className="stat-header">
            <div className="stat-icon stat-icon-danger">
              <FaChartLine />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Total Blogs</h3>
              <p className="stat-value">{analytics.total_blogs}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="chart-grid" style={{ display: "flex", gap: "20px" }}>
        {/* Top Ordered Fabrics Chart */}
        <div className="chart-card" style={{ flex: 1 }}>
          <div className="chart-header">
            <h3 className="chart-title">Top Ordered Fabrics</h3>
            <div className="chart-actions"></div>
          </div>
          <div
            className="chart-body"
            style={{ width: "100%", height: "250px" }}
          >
            <Bar data={fabricData} options={chartOptions} />
          </div>
        </div>

        {/* Top Ordered Categories Chart */}
        <div className="chart-card" style={{ flex: 1 }}>
          <div className="chart-header">
            <h3 className="chart-title">Top Ordered Categories</h3>
            <div className="chart-actions"></div>
          </div>
          <div
            className="chart-body"
            style={{ width: "100%", height: "250px" }}
          >
            <Bar data={categoryData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
