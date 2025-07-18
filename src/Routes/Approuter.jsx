import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Home from "../Screens/Home";
import Login from "../Screens/Login";
import ForgotPasswordEnterEmail from "../Screens/ForgotPassword-EnterEmail";
import ForgotPasswordReset from "../Screens/ForgotPasswordReset";
import Signup from "../Screens/Signup";
import Continiewithgoogle from "../Screens/Continiewithgoogle";
import AboutUs from "../Screens/AboutUs";
import Products from "../Screens/Product";
import Favourites from "../Screens/Favourites";
import SingleBlog from "../Screens/SingleBlog";
import Blogs from "../Screens/Blogs";
import Events from "../Screens/Events";
import ContactUs from "../Screens/ContactUs";
import RequestHistory from "../Screens/RequestHistory";
import GeneralEnquiry from "../Screens/GeneralEnquiry";
import ProductEnquiry from "../Screens/ProductEnquiry";
import Terms from "../Screens/terms";
import Privacy from "../Screens/privacy";
import Accessibility from "../Screens/accessibility";
import BagScreen from "../Screens/BagScreen";
import EmailSent from "../Screens/EmailSent";
import EmailNotExists from "../Screens/EmailNotExists";
import PasswordResetSuccess from "../Screens/PasswordResetSuccess";
import Product from "../Screens/singleproduct";
import Protected from "../Screens/Protected";
import Token from "../Screens/Token";
import Smooth from "../Screens/smooth";
import Thankyou from "../Screens/Thankyou";
import ProductRequest from "../Screens/ProductRequest";
import Dashboard from "../Screens/Dashboard";
import DashboardPassword from "../Screens/DashboardPassword";

// Dashboard wrapper component that forces refresh to eliminate smooth scroll issues
function DashboardRefresh({ children }) {
  useEffect(() => {
    // Check if we're navigating to dashboard and need a refresh
    const currentPath = window.location.pathname;
    const isDashboardRoute = currentPath.startsWith('/dashboard');
    const hasRefreshed = sessionStorage.getItem('dashboardRefreshed');
    
    if (isDashboardRoute && !hasRefreshed) {
      // Mark that we've refreshed for this session
      sessionStorage.setItem('dashboardRefreshed', 'true');
      // Force a hard refresh to clear any smooth scroll state
      window.location.reload();
      return;
    }
    
    // Clear the refresh flag when leaving dashboard
    if (!isDashboardRoute && hasRefreshed) {
      sessionStorage.removeItem('dashboardRefreshed');
    }
  }, []);

  return children;
}

function Approuter() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/user" element={<Protected />}>
          <Route element={<Smooth />}>
            <Route element={<Token />}>
              <Route path="bag" element={<BagScreen />} />
              <Route path="favourites" element={<Favourites />} />
              <Route
                path="generalenquiry/:id"
                element={<GeneralEnquiry />}
              />
              <Route
                path="productrequest/:id"
                element={<ProductRequest />}
              />
              <Route
                path="productenquiry/:id"
                element={<ProductEnquiry />}
              />
              <Route path="history" element={<RequestHistory />} />
            </Route>
          </Route>
        </Route>
        <Route path="/" element={<Token />}>
          <Route 
            path="dashboard/*" 
            element={
              <DashboardRefresh>
                <Dashboard />
              </DashboardRefresh>
            } 
          />
          <Route 
            path="dashboard-password" 
            element={
              <DashboardRefresh>
                <DashboardPassword />
              </DashboardRefresh>
            } 
          />
          <Route element={<Smooth />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/addCompanyDetails" element={<Continiewithgoogle />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/events" element={<Events />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:searchterm" element={<Products />} />
            <Route path="/products/:name/:desc" element={<Products />} />
            <Route path="/product/:productid" element={<Product />} />
            <Route path="/blog/:id" element={<SingleBlog />} />
            <Route path="/contact/:value" element={<ContactUs />} />
            <Route path="/thankyou/:id" element={<Thankyou />} />
            <Route path="/forgot" element={<ForgotPasswordEnterEmail />} />
            <Route path="/emailsent/:email" element={<EmailSent />} />
            <Route path="/noemail/:email" element={<EmailNotExists />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route
              path="/newPass/:uid/:token"
              element={<ForgotPasswordReset />}
            />
            <Route path="/success" element={<PasswordResetSuccess />} />
            <Route
              path="/verify-email/:token"
              element={<PasswordResetSuccess isEmailVerified={true} />}
            />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default Approuter;
