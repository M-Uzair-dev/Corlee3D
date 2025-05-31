import "./style.css";
import messages from "./messages.json";

function ProductInfoDisplay() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="newsletter-container">
      <p className="hero-text-block">
        {isMandarin
          ? "馬上訂閱共樂力的最新消息"
          : "Be the first to know about all things corlee."}
      </p>
      <p className="corlee-text-snippet">
        {isMandarin
          ? "訂閱電子報，掌握新品資訊、業界動態，以及最新消息！"
          : "Subscribe to our newsletter for updates on new products, industry insights, and the latest from Corlee."}
      </p>
    </div>
  );
}

export default ProductInfoDisplay;
