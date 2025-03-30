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
    { path: "/dashboard", name: "Dashboard", icon: <FaChartBar /> },
    { path: "/dashboard/fabrics", name: "Fabrics", icon: <FaBox /> },
    {
      path: "/dashboard/color-categories",
      name: "Color Categories",
      icon: <FaPalette />,
    },
    {
      path: "/dashboard/fabric-categories",
      name: "Fabric Categories",
      icon: <FaTags />,
    },
    { path: "/dashboard/users", name: "Users", icon: <FaUsers /> },
    { path: "/dashboard/orders", name: "Orders", icon: <FaShoppingCart /> },
    { path: "/dashboard/events", name: "Events", icon: <FaCalendarAlt /> },
    { path: "/dashboard/blogs", name: "Blogs", icon: <FaBlog /> },
    {
      path: "/dashboard/blog-categories",
      name: "Blog Categories",
      icon: <FaList />,
    },
    {
      path: "/dashboard/contact-details",
      name: "Contact Details",
      icon: <FaAddressBook />,
    },
    {
      path: "/dashboard/contact-requests",
      name: "Contact Requests",
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
          {isSidebarOpen && <span>Dashboard</span>}
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
