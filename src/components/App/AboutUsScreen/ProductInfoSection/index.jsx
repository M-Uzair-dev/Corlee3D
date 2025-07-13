import ImageListContainer from "../ImageListContainer";
import "./style.css";
import messages from "./messages.json";

function ProductInfoSection() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="vertical-flow-container">
      <div className="order-process-parent">
        <div className="order-process-child">
          <img src="/svgs/5.svg" alt="" className="image-block" />
          <h1 className="containsline english">1</h1>
          <p>{isMandarin ? "詢問價格" : "Inquiry quotation"}</p>
        </div>
        <div className="order-process-child">
          <img src="/svgs/4.svg" alt="" className="image-block" />
          <h1 className="containsline english">2</h1>
          <p>{isMandarin ? "準備下單" : "Place your order"}</p>
        </div>
        <div className="order-process-child">
          <img src="/svgs/1.svg" alt="" className="image-block" />
          <h1 className="containsline english">3</h1>
          <p>{isMandarin ? "開始製造" : "Manufacturing your product"}</p>
        </div>
        <div className="order-process-child">
          <img src="/svgs/2.svg" alt="" className="image-block" />
          <h1 className="containsline english">4</h1>
          <p>{isMandarin ? "品檢包裝" : "Inspection & packaging"}</p>
        </div>
        <div className="order-process-child fifth-child">
          <img src="/svgs/3.svg" alt="" className="image-block" />
          <h1 className="english">5</h1>
          <p>{isMandarin ? "完⼯出貨" : "Completion & Shipment"}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductInfoSection;
