import "./style.css";
import messages from "./messages.json";
import messages2 from "./messages2.json";

function FabricDescriptionSection() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="fashion-text-container">
      <div className="global-fashion-styles-container">
        <p className="fashion-statement-text-style">
          <span className="english">Hi, we are Corlee,</span> <br />
          {isMandarin
            ? "您值得信賴的機能性布料夥伴。"
            : "Your trusted partner for innovative woven fabric solutions."}
        </p>
        <p className="global-fashion-text-styles">
          {isMandarin
            ? "專注打造兼具功能與美感的機能性布料，幫助您的品牌量身訂製專屬開發方案。"
            : "We make woven textiles that enhance performance and style, helping brands bring high-quality products to life"}
        </p>
      </div>
    </div>
  );
}

export default FabricDescriptionSection;
