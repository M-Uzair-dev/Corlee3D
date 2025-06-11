import ProductInfoSection from "../ProductInfoSection";
import "./style.css";
import messages from "./messages.json";

function OrderProcessSection() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="order-process-section">
      <div className="order-process-flow-container">
        <div className="vertical-centered-container">
          <div className="order-process-container">
            <p className="order-process-title english">They trust our work</p>
            <p className="order-process-description">
              {isMandarin
                ? "我們的產品透過策略夥伴，成功打入多個知名品牌供應鏈"
                : "Our products are trusted by leading brands, thanks to strategic partners."}
            </p>
          </div>
        </div>
        <ProductInfoSection />
      </div>
    </div>
  );
}

export default OrderProcessSection;
