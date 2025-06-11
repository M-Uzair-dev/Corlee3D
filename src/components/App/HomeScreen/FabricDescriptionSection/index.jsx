import "./style.css";
import messages from "./messages.json";
import messages2 from "./messages2.json";
import { useEffect } from "react";

function FabricDescriptionSection() {
  const isMandarin = localStorage.getItem("isMandarin");

  return (
    <div className="fashion-text-container">
      <div className="global-fashion-styles-container">
        <div className="fashion-statement-text-style">
          <span 
            className="english" 
            style={{ display: 'block' }}
            data-aos="fade-down"
            data-aos-duration="1000"
            data-aos-delay="100"
          >
            Hi, we are Corlee,
          </span>
          <span 
            style={{ display: 'block' }}
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="400"
          >
            {isMandarin
              ? "您值得信賴的機能性布料夥伴。"
              : "Your trusted partner for innovative woven fabric solutions."}
          </span>
        </div>
        <p 
          className="global-fashion-text-styles" 
          data-aos="fade-up" 
          data-aos-duration="1000" 
          data-aos-delay="700"
        >
          {isMandarin
            ? "專注打造兼具功能與美感的機能性布料，幫助您的品牌量身訂製專屬開發方案。"
            : "We make woven textiles that enhance performance and style, helping brands bring high-quality products to life"}
        </p>
      </div>
    </div>
  );
}

export default FabricDescriptionSection;
