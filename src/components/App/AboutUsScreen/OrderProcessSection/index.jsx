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
                ? "從第一步詢價到最後出貨，我們致力於讓流程更簡單省心，始終以品質為本，讓您全程滿意。"
                : "From initial request to final delivery, we make the process easy, always focused on quality and your satisfaction."}
            </p>
          </div>
        </div>
        <ProductInfoSection />
      </div>
    </div>
  );
}

export default OrderProcessSection;
