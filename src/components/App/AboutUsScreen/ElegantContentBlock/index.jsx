import "./style.css";
import messages from "./messages.json";

function ElegantContentBlock() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="text-container-flex-box">
      <p className="central-text-styler">
        {isMandarin
          ? "我們的願景是 通過品質、創意與信任，重新定義面料批發行業。我們致力於成為全球設計師、零售商和製造商最值得信賴的優質面料供應商。融合創新與傳統，我們希望編織出持久的合作關係和可持續的成功，惠及未來的每一代人。"
          : "Our vision is to redefine the fabric wholesale industry through quality, creativity, and trust. We strive to become the most reliable source for premium textiles, empowering designers, retailers, and manufacturers across the globe. By combining innovation with tradition, we aim to weave lasting relationships and sustainable success for generations to come."}
      </p>
      <div className="content-wrapper">
        <img
          src="https://d2e8m995jm0i5z.cloudfront.net/websiteimages/img_1091_3662_efbf6c.svg"
          alt=""
          className="image-container1"
        />
      </div>
    </div>
  );
}

export default ElegantContentBlock;
