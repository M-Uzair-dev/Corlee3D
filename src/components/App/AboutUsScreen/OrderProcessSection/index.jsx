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
            <p className="order-process-title">
              {isMandarin ? "訂單流程" : "Order Process"}
            </p>
            <p className="order-process-description">
              {isMandarin
                ? "從首次詢價到最終交付，我們的流程旨在高效、透明且順暢，確保您每一次都能準時收到高品質面料。"
                : "From your first inquiry to the final delivery, our process is designed to be smooth, transparent, and efficient—ensuring you receive high-quality fabrics on time, every time."}
            </p>
          </div>
        </div>
        <ProductInfoSection />
      </div>
    </div>
  );
}

export default OrderProcessSection;
