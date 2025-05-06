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
          <p>{isMandarin ? "询价报价" : "Inquiry quotation"}</p>
        </div>
        <div className="order-process-child">
          <img
            src="https://d2e8m995jm0i5z.cloudfront.net/websiteimages/img_1091_3692_458f26.svg"
            alt=""
            className="image-block"
          />
          <h1>2</h1>
          <p>{isMandarin ? "下订单" : "Place your order"}</p>
        </div>
        <div className="order-process-child">
          <img
            src="https://d2e8m995jm0i5z.cloudfront.net/websiteimages/img_1135_8920_20e63d.svg"
            alt=""
            className="image-block"
          />
          <h1>3</h1>
          <p>{isMandarin ? "制造产品" : "Manufacturing your product"}</p>
        </div>
        <div className="order-process-child">
          <img
            src="https://d2e8m995jm0i5z.cloudfront.net/websiteimages/img_1091_3700_db0891.svg"
            alt=""
            className="image-block"
          />
          <h1>4</h1>
          <p>{isMandarin ? "检验与包装" : "Inspection & packaging"}</p>
        </div>
        <div className="order-process-child">
          <img
            src="https://d2e8m995jm0i5z.cloudfront.net/websiteimages/img_1091_3702_cbd766.svg"
            alt=""
            className="image-block"
          />
          <h1>5</h1>
          <p>{isMandarin ? "送货到您的地址" : "Delivery to your address"}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductInfoSection;
