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
              ? "多年來，我們憑藉優質的產品、可靠的服務和穩定的交付，與全球客戶建立了長期合作關係。"
              : "Over the years, we've built lasting relationships with clients around the world by delivering quality, reliability, and unmatched service in every order."}
          </p>
        </div>
      </div>
      <ImageContainer1 />
    </div>
  );
}

export default EnhancedContentSection;
