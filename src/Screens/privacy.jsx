import React from "react";
import Navbar from "../components/App/Navbar";
import BottomBar from "../components/App/BottomBar";

const terms = () => {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div>
      <Navbar />
      <div className="containerTerms">
        <h1>{isMandarin ? "隐私政策" : "Privacy Policy"}</h1>
        <p>
          {isMandarin
            ? "在 Corlee，我们重视您的隐私。您提供的任何个人信息，如您的姓名、电子邮件或公司名称，仅用于处理订单和增强您的购物体验。我们不向第三方出售或分享您的信息，除非必要以履行服务（例如，支付处理或运输）。我们的网站使用cookies来改善功能并分析流量。通过使用我们的网站，您同意我们的隐私做法。您可以随时联系我们以审查或删除您的数据。"
            : "At Corlee, we value your privacy. Any personal information you provide, such as your name, email, or company name, is collected solely for processing orders and enhancing your shopping experience. We do not sell or share your information with third parties, except where necessary to fulfill services (e.g., payment processing or shipping). Our site uses cookies to improve functionality and analyze traffic. By using our site, you consent to our privacy practices. You can contact us at any time to review or delete your data."}
        </p>
      </div>
      <BottomBar />
    </div>
  );
};

export default terms;
