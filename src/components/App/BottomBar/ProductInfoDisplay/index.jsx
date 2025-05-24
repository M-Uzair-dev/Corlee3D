import "./style.css";
import messages from "./messages.json";

function ProductInfoDisplay() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="newsletter-container">
      <p className="hero-text-block">
        {isMandarin
          ? " 成為第一個了解產品發布和所有科里信息的人。"
          : "Be the first to know about product releases & all things corlee."}
      </p>
      <p className="corlee-text-snippet">
        {isMandarin
          ? "訂閱以獲取最新產品發布和 Corlee 的獨家資訊。我們將第一時間為您發送新品、活動和特別優惠信息，不容錯過！"
          : "Subscribe to get the latest product releases and exclusive Corlee updates. Be the first to hear about new arrivals, events, and special offers—you won't want to miss it!"}
      </p>
    </div>
  );
}

export default ProductInfoDisplay;
