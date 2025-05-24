import React from "react";
import Navbar from "../components/App/Navbar";
import BottomBar from "../components/App/BottomBar";

const terms = () => {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div>
      <Navbar />
      <div className="containerTerms">
        <h1>{isMandarin ? "條款和條件" : "Terms and Services"}</h1>
        <p>
          {isMandarin
            ? "使用 Corlee 網站，您同意遵守我們的服務條款。所有內容，包括產品圖片、描述和價格，都是 Corlee 的財產，未經許可不得使用。通過我們的網站下訂單受限於可用性和我們酌情取消或修改訂單的權利。我們保留隨時更改價格或條款的權利。客戶有責任提供準確信息並遵守當地進口或批發法律。"
            : "By using the Corlee website, you agree to comply with our terms of service. All content, including product images, descriptions, and prices, are the property of Corlee and may not be used without permission. Orders placed through our website are subject to availability and our right to cancel or modify orders at our discretion. We reserve the right to change prices or terms at any time. Customers are responsible for providing accurate information and complying with local import or wholesale laws."}
        </p>
      </div>
      <BottomBar />
    </div>
  );
};

export default terms;
