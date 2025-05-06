import "./style.css";
import messages from "./messages.json";

function ElegantContentBlock() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="text-container-flex-box">
      <p className="central-text-styler">
        {isMandarin
          ? "我们的愿景是 通过品质、创意与信任，重新定义面料批发行业。我们致力于成为全球设计师、零售商和制造商最值得信赖的优质面料供应商。融合创新与传统，我们希望编织出持久的合作关系和可持续的成功，惠及未来的每一代人。"
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
