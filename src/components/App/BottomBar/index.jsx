import NewsletterSubscriptionSection from "./NewsletterSubscriptionSection";
import SvgIcon1 from "./icons/SvgIcon1";
import SvgIcon2 from "./icons/SvgIcon2";
import SvgIcon3 from "./icons/SvgIcon3";
import SvgIcon4 from "./icons/SvgIcon4";
import "./style.css";
import messages from "./messages.json";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function BottomBar(props) {
  const navigate = useNavigate();
  const isMandarin = localStorage.getItem("isMandarin");
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [modalAnimation, setModalAnimation] = useState(false);

  useEffect(() => {
    if (showLanguageModal) {
      setTimeout(() => {
        setModalAnimation(true);
      }, 10);
    } else {
      setModalAnimation(false);
    }
  }, [showLanguageModal]);

  const closeModal = () => {
    setModalAnimation(false);
    setTimeout(() => {
      setShowLanguageModal(false);
    }, 300);
  };

  const handleLanguageChange = (language) => {
    if (language === "mandarin") {
      localStorage.setItem("isMandarin", "true");
    } else {
      localStorage.removeItem("isMandarin");
    }

    // Check if current path starts with /products/
    if (window.location.pathname.startsWith("/products/")) {
      window.location.href = "/"; // Redirect to home page
    } else {
      window.location.reload(); // Otherwise just reload
    }
  };

  return (
    <div
      className={
        props.home
          ? "newsletter-section-bb"
          : props.contact
          ? "newsletter-section-bb contactbottombar"
          : props.history
          ? "newsletter-section-bb historybottombar"
          : "newsletter-section-bb nothome"
      }
    >
      <div className="hero-section-bb">
        <NewsletterSubscriptionSection />
        <div className="flex-container-with-icons-bb">
          <div className="navigation-bar-bb">
            <p
              className="unique-text-block-bb"
              onClick={() => {
                navigate("/products");
                window.scrollTo(0, 0);
              }}
              style={{
                cursor: "pointer",
              }}
            >
              {isMandarin ? "產品" : "Products"}
            </p>
            <p
              className="unique-text-block-bb"
              onClick={() => {
                navigate("/events");
                window.scrollTo(0, 0);
              }}
              style={{
                cursor: "pointer",
              }}
            >
              {isMandarin ? "活動" : "Events"}
            </p>
            <p
              className="unique-text-block-bb"
              onClick={() => {
                navigate("/about");
                window.scrollTo(0, 0);
              }}
              style={{
                cursor: "pointer",
              }}
            >
              {isMandarin ? "品牌故事" : "About us"}
            </p>
            <p
              className="unique-text-block-bb"
              onClick={() => {
                navigate("/blogs");
                window.scrollTo(0, 0);
              }}
              style={{
                cursor: "pointer",
              }}
            >
              {isMandarin ? "⽂章" : "Blogs"}
            </p>
          </div>
          <div className="sidebar-container-bb" onClick={() => navigate("/")}>
            <img
              src="/images/logo.png"
              style={{ filter: "invert(1)" }}
              className="image-container-bb"
            />
          </div>
          <div className="flex-box-section-bb">
            <SvgIcon1 className="svg-container-bb" />
            <SvgIcon2 className="svg-container-bb" />
            <SvgIcon3 className="svg-container1-bb" />
            <SvgIcon4 className="svg-container1-bb" />
          </div>
        </div>
        <div className="contact-info-section1-bb">
          <div className="contact-info-container-bb">
            <div className="contact-info-container1-bb">
              <p className="unique-text-block-bb english">
                {localStorage.getItem("phone")}
              </p>
              <div className="vertical-divider-bb" />
              <p className="unique-text-block-bb english">
                {localStorage.getItem("email")}
              </p>
            </div>
            <p
              className={`contact-info-section-bb ${
                isMandarin && localStorage.getItem("address_mandarin")
                  ? ""
                  : "english"
              }`}
            >
              {isMandarin && localStorage.getItem("address_mandarin")
                ? localStorage.getItem("address_mandarin")
                : localStorage.getItem("address")}
            </p>
          </div>
        </div>
        <p className="footer-copyright-text-bb">
          <span className="brand-text-style-bb english">
            © {new Date().getFullYear()}
            {isMandarin
              ? " corlee & co. 保留所有權利。"
              : " corlee & co. All Rights Reserved."}
          </span>{" "}
          <a
            onClick={(e) => {
              e.preventDefault();
              navigate("/terms");
              window.scrollTo(0, 0);
            }}
            className="link-underline-white-bb"
          >
            {isMandarin ? "隱私權" : "Terms"}
          </a>
          <span className="brand-text-style-bb">, </span>
          <a
            onClick={(e) => {
              e.preventDefault();
              navigate("/privacy");
              window.scrollTo(0, 0);
            }}
            className="link-underline-white-bb"
          >
            {isMandarin ? "條款" : "Privacy"}
          </a>
          <span className="brand-text-style-bb"> &amp; </span>
          <a
            onClick={(e) => {
              e.preventDefault();
              navigate("/accessibility");
              window.scrollTo(0, 0);
            }}
            className="link-underline-white-bb"
          >
            {isMandarin ? "無障礙" : "Accessibility"}
          </a>
          <br />{" "}
          <a
            className="link-underline-white-bb"
            style={{
              marginTop: "5px !important",
              display: "block",
              cursor: "pointer",
            }}
            onClick={() => setShowLanguageModal(true)}
          >
            <span className="english">English / </span>中文
          </a>
        </p>

        {showLanguageModal && (
          <div
            className="language-modal"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              opacity: modalAnimation ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
            onClick={closeModal}
          >
            <div
              style={{
                backgroundColor: "#f4f4f4",
                padding: "30px",
                borderRadius: "16px",
                width: "300px",
                color: "black",
                textAlign: "center",
                position: "relative",
                transform: modalAnimation
                  ? "translateY(0)"
                  : "translateY(30px)",
                opacity: modalAnimation ? 1 : 0,
                transition: "transform 0.4s ease, opacity 0.3s ease",
                boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={() => handleLanguageChange("english")}
                  style={{
                    padding: "14px 30px",
                    width: "100%",
                    border: "none",
                    backgroundColor: "black",
                    color: "white",
                    borderRadius: "50px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "bold",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#333";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "black";
                  }}
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageChange("mandarin")}
                  style={{
                    padding: "14px 30px",
                    width: "100%",
                    border: "none",
                    backgroundColor: "black",
                    color: "white",
                    borderRadius: "50px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "bold",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#333";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "black";
                  }}
                >
                  中文
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BottomBar;
