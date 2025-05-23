import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaChartBar,
  FaBox,
  FaPalette,
  FaTags,
  FaUsers,
  FaShoppingCart,
  FaBlog,
  FaList,
  FaAddressBook,
  FaEnvelope,
  FaBars,
  FaTimes,
  FaCalendarAlt,
} from "react-icons/fa";

const Sidebar = ({ isSidebarOpen, toggleSidebar, isMobile }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", name: "後台管理", icon: <FaChartBar /> },
    { path: "/dashboard/fabrics", name: "布料", icon: <FaBox /> },
    {
      path: "/dashboard/color-categories",
      name: "顏色",
      icon: <FaPalette />,
    },
    {
      path: "/dashboard/fabric-categories",
      name: "布種",
      icon: <FaTags />,
    },
    { path: "/dashboard/users", name: "使用者", icon: <FaUsers /> },
    { path: "/dashboard/orders", name: "訂單", icon: <FaShoppingCart /> },
    { path: "/dashboard/events", name: "活動", icon: <FaCalendarAlt /> },
    { path: "/dashboard/blogs", name: "文章", icon: <FaBlog /> },
    {
      path: "/dashboard/blog-categories",
      name: "文章分類",
      icon: <FaList />,
    },
    {
      path: "/dashboard/contact-details",
      name: "聯絡資訊",
      icon: <FaAddressBook />,
    },
    {
      path: "/dashboard/contact-requests",
      name: "聯絡請求",
      icon: <FaEnvelope />,
    },
  ];

  return (
    <div
      className={`sidebar ${
        isSidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"
      }`}
    >
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">
            <FaChartBar />
          </span>
          {isSidebarOpen && <span>Corlee</span>}
        </div>
        {!isMobile && (
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        )}
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-nav-item ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => {
              if (isMobile) {
                toggleSidebar();
              }
            }}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            {isSidebarOpen && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
