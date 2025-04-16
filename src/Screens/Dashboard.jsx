import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Dashboard.css";

// Import components
import Sidebar from "../components/Dashboard/Sidebar";
import Header from "../components/Dashboard/Header";
import DashboardHome from "../components/Dashboard/DashboardHome";
import Fabrics from "../components/Dashboard/Fabrics";
import ColorCategories from "../components/Dashboard/ColorCategories";
import FabricCategories from "../components/Dashboard/FabricCategories";
import Users from "../components/Dashboard/Users";
import Orders from "../components/Dashboard/Orders";
import Blogs from "../components/Dashboard/Blogs";
import BlogCategories from "../components/Dashboard/BlogCategories";
import ContactDetails from "../components/Dashboard/ContactDetails";
import ContactRequests from "../components/Dashboard/ContactRequests";
import Events from "../components/Dashboard/Events";

// Import edit pages
import EditFabricPage from "../pages/EditPages/EditFabricPage";
import EditColorCategoryPage from "../pages/EditPages/EditColorCategoryPage";
import EditFabricCategoryPage from "../pages/EditPages/EditFabricCategoryPage";
import EditUserPage from "../pages/EditPages/EditUserPage";
import EditBlogPage from "../pages/EditPages/EditBlogPage";
import EditOrderPage from "../pages/EditPages/EditOrderPage";
import EditBlogCategoryPage from "../pages/EditPages/EditBlogCategoryPage";
import EditContactDetailsPage from "../pages/EditPages/EditContactDetailsPage";
import EditContactRequestPage from "../pages/EditPages/EditContactRequestPage";
import EditEventPage from "../pages/EditPages/EditEventPage";

// Import create pages
import CreateFabricPage from "../pages/CreatePages/CreateFabricPage";
import CreateColorCategoryPage from "../pages/CreatePages/CreateColorCategoryPage";
import CreateFabricCategoryPage from "../pages/CreatePages/CreateFabricCategoryPage";
import CreateUserPage from "../pages/CreatePages/CreateUserPage";
import CreateBlogPage from "../pages/CreatePages/CreateBlogPage";
import CreateOrderPage from "../pages/CreatePages/CreateOrderPage";
import CreateBlogCategoryPage from "../pages/CreatePages/CreateBlogCategoryPage";
import CreateContactDetailsPage from "../pages/CreatePages/CreateContactDetailsPage";
import CreateContactRequestPage from "../pages/CreatePages/CreateContactRequestPage";
import CreateEventPage from "../pages/CreatePages/CreateEventPage";

// Import view pages
import ViewOrderPage from "../pages/ViewPages/ViewOrderPage";
import ViewEventPage from "../pages/ViewPages/ViewEventPage";
import ViewContactRequestPage from "../pages/ViewPages/ViewContactRequestPage";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Check if mobile on mount and window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Get title from current path
  const getTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path === "/dashboard/fabrics") return "Fabrics";
    if (path.match(/\/dashboard\/fabrics\/edit\/\d+/)) return "Edit Fabric";
    if (path === "/dashboard/fabrics/create") return "Create Fabric";
    if (path === "/dashboard/color-categories") return "Color Categories";
    if (path.match(/\/dashboard\/color-categories\/edit\/\d+/))
      return "Edit Color Category";
    if (path === "/dashboard/color-categories/create")
      return "Create Color Category";
    if (path === "/dashboard/fabric-categories") return "Fabric Categories";
    if (path.match(/\/dashboard\/fabric-categories\/edit\/\d+/))
      return "Edit Fabric Category";
    if (path === "/dashboard/fabric-categories/create")
      return "Create Fabric Category";
    if (path === "/dashboard/users") return "Users";
    if (path.match(/\/dashboard\/users\/edit\/\d+/)) return "Edit User";
    if (path === "/dashboard/users/create") return "Create User";
    if (path === "/dashboard/orders") return "Orders";
    if (path.match(/\/dashboard\/orders\/edit\/\d+/)) return "Edit Order";
    if (path === "/dashboard/orders/create") return "Create Order";
    if (path === "/dashboard/blogs") return "Blogs";
    if (path.match(/\/dashboard\/blogs\/edit\/\d+/)) return "Edit Blog";
    if (path === "/dashboard/blogs/create") return "Create Blog";
    if (path === "/dashboard/blog-categories") return "Blog Categories";
    if (path.match(/\/dashboard\/blog-categories\/edit\/\d+/))
      return "Edit Blog Category";
    if (path === "/dashboard/blog-categories/create")
      return "Create Blog Category";
    if (path === "/dashboard/contact-details") return "Contact Details";
    if (path.match(/\/dashboard\/contact-details\/edit\/\d+/))
      return "Edit Contact Details";
    if (path === "/dashboard/contact-details/create")
      return "Create Contact Details";
    if (path === "/dashboard/contact-requests") return "Contact Requests";
    if (path.match(/\/dashboard\/contact-requests\/edit\/\d+/))
      return "Edit Contact Request";
    if (path === "/dashboard/contact-requests/create")
      return "Create Contact Request";
    if (path === "/dashboard/events") return "Events";
    if (path.match(/\/dashboard\/events\/edit\/\d+/)) return "Edit Event";
    if (path === "/dashboard/events/create") return "Create Event";
    return "Dashboard";
  };
  const isAuthenticated = localStorage.getItem("theUserIsAdmin") == "ADMIN";
  if (!isAuthenticated) {
    return <Navigate to="/dashboard-password" />;
  }

  return (
    <div className="dashboard-container">
      {/* Mobile sidebar toggle button */}
      {isMobile && (
        <button className="mobile-sidebar-toggle" onClick={toggleSidebar}>
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      )}

      {/* Mobile sidebar overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="mobile-overlay active"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div className="main-content">
        <Header title={getTitle()} />
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/fabrics" element={<Fabrics />} />
          <Route path="/fabrics/edit/:id" element={<EditFabricPage />} />
          <Route path="/fabrics/create" element={<CreateFabricPage />} />
          <Route path="/color-categories" element={<ColorCategories />} />
          <Route
            path="/color-categories/edit/:id"
            element={<EditColorCategoryPage />}
          />
          <Route
            path="/color-categories/create"
            element={<CreateColorCategoryPage />}
          />
          <Route path="/fabric-categories" element={<FabricCategories />} />
          <Route
            path="/fabric-categories/edit/:id"
            element={<EditFabricCategoryPage />}
          />
          <Route
            path="/fabric-categories/create"
            element={<CreateFabricCategoryPage />}
          />
          <Route path="/users" element={<Users />} />
          <Route path="/users/edit/:id" element={<EditUserPage />} />
          <Route path="/users/create" element={<CreateUserPage />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/create" element={<CreateOrderPage />} />
          <Route path="/orders/edit/:id" element={<EditOrderPage />} />
          <Route path="/orders/:id" element={<ViewOrderPage />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/edit/:id" element={<EditBlogPage />} />
          <Route path="/blogs/create" element={<CreateBlogPage />} />
          <Route path="/blog-categories" element={<BlogCategories />} />
          <Route
            path="/blog-categories/edit/:id"
            element={<EditBlogCategoryPage />}
          />
          <Route
            path="/blog-categories/create"
            element={<CreateBlogCategoryPage />}
          />
          <Route path="/contact-details" element={<ContactDetails />} />
          <Route
            path="/contact-details/edit/:id"
            element={<EditContactDetailsPage />}
          />
          <Route
            path="/contact-details/create"
            element={<CreateContactDetailsPage />}
          />
          <Route path="/contact-requests" element={<ContactRequests />} />
          <Route
            path="/contact-requests/edit/:id"
            element={<EditContactRequestPage />}
          />
          <Route
            path="/contact-requests/:id"
            element={<ViewContactRequestPage />}
          />
          <Route path="/events" element={<Events />} />
          <Route path="/events/edit/:id" element={<EditEventPage />} />
          <Route path="/events/create" element={<CreateEventPage />} />
          <Route path="/events/:id" element={<ViewEventPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
