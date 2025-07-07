import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { api, setAuthToken } from "../config/api";
import { Outlet, useNavigate } from "react-router-dom";
const Token = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);

  if (token) {
    setAuthToken(token);
  }
  
  const getinfo = async () => {
    const response = await api.get("/contact-details/");
    const data = response.data.results[0];
    console.log("WE GOT OUR RESPONSE OF CONTACT DETAILS :", response);
    if (response.status === 200) {
      localStorage.setItem("whatsapp", data.whatsapp);
      localStorage.setItem("postal_code", data.postal_code);
      localStorage.setItem("phone", data.phone);
      localStorage.setItem("longitude", data.longitude);
      localStorage.setItem("line", data.line);
      localStorage.setItem("latitude", data.latitude);
      localStorage.setItem("instagram", data.instagram);
      localStorage.setItem("facebook", data.facebook);
      localStorage.setItem("email", data.email);
      localStorage.setItem("country", data.country);
      localStorage.setItem("address", data.address);
      localStorage.setItem("city", data.city);
      localStorage.setItem("county", data.county);
      localStorage.setItem("country", data.country);
      localStorage.setItem("address_mandarin", data.address_mandarin);
      localStorage.setItem("city_mandarin", data.city_mandarin);
      localStorage.setItem("county_mandarin", data.county_mandarin);
      localStorage.setItem("country_mandarin", data.country_mandarin);
    }
  };
  useEffect(() => {
    getinfo();
  }, []);
  const [emailNotVerified, setEmailNotVerified] = useState(false);

  const isMandarin = localStorage.getItem("isMandarin");

  const getUser = async () => {
    if (localStorage.getItem("token")) {
      const res = await api.get("/user/");
      if (res.status === 200) {
        if (!res.data.is_verified) {
          setEmailNotVerified(true);
        }
        if (!res.data.company_name) {
          navigate("/addCompanyDetails");
          localStorage.setItem("Company", "false");
        } else {
          localStorage.setItem("Company", "true");
        }
      }
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    getUser();

    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleResendEmail = async () => {
    try {
      const response = await api.post("/resend-verification-email/");
      console.log(response);
      if (response.status === 200) {
        toast.success(
          isMandarin
            ? "驗證郵件已重新發送"
            : "Verification email has been resent!"
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        (isMandarin ? "發送郵件時出錯" : "Error sending verification email");
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Toaster position="bottom-left" closeButton />
      {emailNotVerified && (
        <div className="noemailband">
          {isMandarin ? "驗證您的地址" : "Verify your email address."}
          <p onClick={handleResendEmail} className="resend-email-link">
            {isMandarin ? "重新發送郵件" : "Resend Email"}
          </p>
        </div>
      )}
      <Outlet />
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top"
          aria-label="Scroll to top"
        ></button>
      )}
      <style>
        {`
          ${
            isMandarin
              ? `
            *:not(.english):not(.password-container *):not(.material-heading-text-style):not(.fashion-statement-text-style span:nth-child(1)):not(.dashboard-container *):not(.adddiv):not(.imagestext p:nth-child(1)):not(.textdivinbagdetails *:not(:first-child)):not(input):not(.singlecalldetail:nth-child(3)>p):not(.contact-heading):not(.contact-heading-text-style):not(.contact-info-section1 *):not(.textboxdivmain h1):not(*:has(.dropdowndiv) h1), .productdetailsdic h1:not(.english), .horizontal-menu-with-icons-nav *, contact-info-text-style-nav, .product-card-container-nav *, .contact-info-text-style-nav *{
             font-family: "Noto Serif TC", serif !important;
            }
            
.majestic-heading-home,
.majestic-heading1,
.fabric-type-heading,
.fashion-statement-text-style,
.leftsidecontent h1,
.upcoming-events-heading,
.golden-heading,
.hero-title,
.standout-text,
.visionary-heading,
.order-process-title,
.order-process-child,
.order-process-title,
.hero-title-text-style,
.contact-heading-text-style,
.contact-heading,
.request-history-title,
.priceofproduct,
.material-heading-text-style,
.error-message-title,
.email-notification-heading,
.company-details-title,
.password-reset-message-email,
.containerTerms h1,
.loginpopuswrapper h1,.carousel-heading {
font-size: 46px !important;
line-height: 1.2 !important;
}
.hero-text-block. art-noova-heading {
font-size: 36px !important;
}
@media(max-width: 768px) {
.majestic-heading-home,
.majestic-heading1,
.fabric-type-heading,
.fashion-statement-text-style,
.leftsidecontent h1,
.upcoming-events-heading,
.golden-heading,
.hero-title,
.standout-text,
.visionary-heading,
.order-process-title,
.order-process-child,
.order-process-title,
.hero-title-text-style,
.contact-heading-text-style,
.contact-heading,
.request-history-title,
.priceofproduct,
.material-heading-text-style,
.error-message-title,
.email-notification-heading,
.company-details-title,
.password-reset-message-email,
.containerTerms h1,
.loginpopuswrapper h1,
.carousel-heading {
font-size: 36px !important;
}
.hero-text-block. art-noova-heading {
font-size: 26px !important;
}
}
.loginpopupheader::after {
display: none !important;}
.vertical-section-container {
max-height: 550px !important;
}
.english,.material-heading-text-style{
  font-family: "Artnoova", sans-serif !important;
}

          `
              : `.hero-text-block,
.majestic-heading-home,
.art-noova-heading,
.majestic-heading1,
.fabric-type-heading,
.fashion-statement-text-style,
.leftsidecontent h1,
.letsgoanddiscussit,
.upcoming-events-heading,
.tech-card-subtitle-text-style,
.hero-title-text-style-blogs,
.golden-heading,
.hero-title,
.standout-text,
.visionary-heading,
.order-process-title,
.order-process-child,
.order-process-title,
.textdivinnavproductdropdown h1,
.hero-title-text-style,
.contact-heading-text-style,
.contact-heading,
.request-history-title,
.ticket-number-style,
.ticket-number-style,
.color,
.quantityofproduct,
.priceofproduct,
.imagestext p:nth-child(1),
.main-heading-text-style,
.material-heading-text-style,
.headingdiv h1,
.textinbagproduct p,
.productdetailsdic h1,
.colorsinproduct,
.quantitydivinproduct,
.textdiv h2,
.detailsdivmaincontainer > h1,
.thankyoucontainer h1,
.error-message-title,
.email-notification-heading,
.company-details-title,
.password-reset-message-email,
.containerTerms h1,
.fashion-statement-text-style *,
.loginpopuswrapper h1 {
  font-family: "Artnoova", sans-serif !important;
}
`
          }

          .scroll-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background-color: #ffffff;
            color: #2d3436;
            border: 2px solid #e8e8e8;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            box-shadow: 0 6px 16px rgba(45, 52, 54, 0.2);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            opacity: 0;
            animation: slideIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
            z-index: 1000;
          }

          @keyframes slideIn {
            0% {
              opacity: 0;
              transform: translateY(40px) rotate(180deg) scale(0.5);
            }
            60% {
              transform: translateY(-8px) rotate(-20deg) scale(1.1);
            }
            80% {
              transform: translateY(4px) rotate(10deg);
            }
            100% {
              opacity: 1;
              transform: translateY(0) rotate(0) scale(1);
            }
          }

          .scroll-to-top:hover {
            transform: translateY(-5px) scale(1.08);
            box-shadow: 0 8px 20px rgba(45, 52, 54, 0.25);
            background-color: #ffffff;
            border-color: #1a73e8;
          }

          .scroll-to-top::before {
            content: "↑";
            position: relative;
            transition: transform 0.3s ease;
            font-weight: bold;
          }

          .scroll-to-top:hover::before {
            transform: translateY(-3px);
            color: #1a73e8;
          }

          .resend-email-link {
            cursor: pointer;
            color: #007bff;
            text-decoration: underline;
            margin: 0;
            padding: 0;
            margin-left: 10px;
            transition: color 0.2s ease;
          }

          .resend-email-link:hover {
            color:rgb(225, 225, 225);
          }

          .noemailband {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>
    </>
  );
};

export default Token;
