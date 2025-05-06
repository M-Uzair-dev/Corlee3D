import React from "react";
import Navbar from "../components/App/Navbar";
import BottomBar from "../components/App/BottomBar";

const terms = () => {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div>
      <Navbar />
      <div className="containerTerms">
        <h1>{isMandarin ? "条款和条件" : "Terms and Services"}</h1>
        <p>
          {isMandarin
            ? "使用 Corlee 网站，您同意遵守我们的服务条款。所有内容，包括产品图片、描述和价格，都是 Corlee 的财产，未经许可不得使用。通过我们的网站下订单受限于可用性和我们酌情取消或修改订单的权利。我们保留随时更改价格或条款的权利。客户有责任提供准确信息并遵守当地进口或批发法律。"
            : "By using the Corlee website, you agree to abide by our terms of service. All content, including product images, descriptions, and pricing, is the property of Corlee and may not be used without permission. Orders placed through our website are subject to availability and may be canceled or modified at our discretion. We reserve the right to change prices or terms at any time. Customers are responsible for providing accurate information and complying with local import or wholesale laws."}
        </p>
      </div>
      <BottomBar />
    </div>
  );
};

export default terms;
