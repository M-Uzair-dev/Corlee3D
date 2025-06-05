import ImageListContainer from "../ImageListContainer";
import "./style.css";
import messages from "./messages.json";

function ProductInfoSection() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="vertical-flow-container">
      <div className="order-process-parent">
        <div className="order-process-child">
          <img
            src="https://d2e8m995jm0i5z.cloudfront.net/websiteimages/img_1135_8915_714d59.svg"
            alt=""
            className="image-block"
          />
          <h1 className="containsline">1</h1>
          <p>{isMandarin ? "詢問價格" : "Inquiry quotation"}</p>
        </div>
        <div className="order-process-child">
          <img
            src="https://d2e8m995jm0i5z.cloudfront.net/websiteimages/img_1091_3692_458f26.svg"
            alt=""
            className="image-block"
          />
          <h1>2</h1>
          <p>{isMandarin ? "準備下單" : "Place your order"}</p>
        </div>
        <div className="order-process-child">
          <img
            src="https://d2e8m995jm0i5z.cloudfront.net/websiteimages/img_1135_8920_20e63d.svg"
            alt=""
            className="image-block"
          />
          <h1>3</h1>
          <p>{isMandarin ? "開始製造" : "Manufacturing your product"}</p>
        </div>
        <div className="order-process-child">
          <img
            src="https://d2e8m995jm0i5z.cloudfront.net/websiteimages/img_1091_3700_db0891.svg"
            alt=""
            className="image-block"
          />
          <h1>4</h1>
          <p>{isMandarin ? "品檢包裝" : "Inspection & packaging"}</p>
        </div>
        <div className="order-process-child">
          <img
            src="https://d2e8m995jm0i5z.cloudfront.net/websiteimages/img_1091_3702_cbd766.svg"
            alt=""
            className="image-block"
          />
          <h1>5</h1>
          <p>{isMandarin ? "完⼯出貨" : "Completion & Shipment"}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductInfoSection;
