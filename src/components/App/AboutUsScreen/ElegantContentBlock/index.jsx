import "./style.css";
import messages from "./messages.json";

function ElegantContentBlock() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="text-container-flex-box">
      <p className="central-text-styler">
        {isMandarin
          ? "對我們⽽⾔，「永續經營」從來不只是⼝號，⽽是貫徹在產品、流程與夥伴關係中的核⼼信念。\n透過與在地⼯廠及供應商的緊密合作，柏家與共樂⼒提供整合性的布料開發服務，融合⾼機能與設計巧思，致⼒打造兼具⾼品質與環保精神的布料。"
          : "Sustainability isn’t just a word—it’s part of everything we do.\n\n At Corlee, we follow eco-friendly practices in our products, our processes, and how we work with people.\nThanks to our strong partnerships with local factories and suppliers, we offer integrated woven fabric solutions that combine advanced performance with thoughtful design."}
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
