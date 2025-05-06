import "./style.css";
import messages from "./messages.json";

function ProductInfoDisplay() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="newsletter-container">
      <p className="hero-text-block">
        {isMandarin
          ? " 成为第一个了解产品发布和所有科里信息的人。"
          : "Be the first to know about product releases & all things corlee."}
      </p>
      <p className="corlee-text-snippet">
        {isMandarin
          ? "订阅以获取最新产品发布和 Corlee 的独家资讯。我们将第一时间为您发送新品、活动和特别优惠信息，不容错过！"
          : "Subscribe to get the latest product releases and exclusive Corlee updates. Be the first to hear about new arrivals, events, and special offers—you won’t want to miss it!"}
      </p>
    </div>
  );
}

export default ProductInfoDisplay;
