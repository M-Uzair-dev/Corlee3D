import React from "react";
import {
  FaChartLine,
  FaUsers,
  FaShoppingCart,
  FaBox,
  FaChartArea,
  FaChartPie,
} from "react-icons/fa";

const DashboardHome = () => {
  return (
    <div className="dashboard-content">
      {/* Stats Grid */}
      <div className="stats-grid">
        {/* Sales Stat */}
        <div className="stat-card stat-primary">
          <div className="stat-header">
            <div className="stat-icon stat-icon-primary">
              <FaChartLine />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Total Sales</h3>
              <p className="stat-value">$24,500</p>
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
              <p className="stat-value">1,234</p>
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
              <p className="stat-value">456</p>
            </div>
          </div>
        </div>

        {/* Products Stat */}
        <div className="stat-card stat-danger">
          <div className="stat-header">
            <div className="stat-icon stat-icon-danger">
              <FaBox />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Total Products</h3>
              <p className="stat-value">789</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="chart-grid">
        {/* Sales Overview Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Sales Overview</h3>
            <div className="chart-actions"></div>
          </div>
          <div className="chart-body">
            <FaChartArea />
          </div>
        </div>

        {/* Revenue Distribution Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Revenue Distribution</h3>
            <div className="chart-actions"></div>
          </div>
          <div className="chart-body">
            <FaChartPie />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
