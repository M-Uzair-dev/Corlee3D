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
            {isMandarin ? "500+ 滿意客戶" : messages["500_happy_clients"]}
          </p>
          <p className="order-process-description">
            {isMandarin
              ? "一起認識那些選擇共樂力的品牌，也邀請您成為我們下一位合作夥伴！"
              : "Discover the brands that choose Corlee for their fabric needs, and build a trusted partnership with us!"}
          </p>
        </div>
      </div>
      <ImageContainer1 />
    </div>
  );
}

export default EnhancedContentSection;
