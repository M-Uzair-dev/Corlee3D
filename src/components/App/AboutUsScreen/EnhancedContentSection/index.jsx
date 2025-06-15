import StylishContainer from "../StylishContainer";
import OrderProcessSection from "../OrderProcessSection";
import ImageContainer1 from "../ImageContainer1";
import "./style.css";
import messages from "./messages.json";

function EnhancedContentSection() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="vision-section">
      <StylishContainer />
      <OrderProcessSection />
      <div className="client-satisfaction-section">
        <div className="order-process-container">
          <p className="order-process-title">
            <span className="english">
            They trust our work
            </span>
          </p>
          <p className="order-process-description">
            {isMandarin
              ? "我們的產品透過策略夥伴，成功打入多個知名品牌供應鏈。"
              : "Our products are trusted by leading brands, thanks to strategic partners."}
          </p>
        </div>
      </div>
      <ImageContainer1 />
    </div>
  );
}

export default EnhancedContentSection;
