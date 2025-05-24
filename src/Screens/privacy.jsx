import React from "react";
import Navbar from "../components/App/Navbar";
import BottomBar from "../components/App/BottomBar";

const terms = () => {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div>
      <Navbar />
      <div className="containerTerms">
        <h1>{isMandarin ? "隱私政策" : "Privacy Policy"}</h1>
        <p>
          {isMandarin
            ? "在 Corlee，我們重視您的隱私。您提供的任何個人信息，如您的姓名、電子郵件或公司名稱，僅用於處理訂單和增強您的購物體驗。我們不向第三方出售或分享您的信息，除非必要以履行服務（例如，支付處理或運輸）。我們的網站使用cookies來改善功能並分析流量。通過使用我們的網站，您同意我們的隱私做法。您可以隨時聯繫我們以審查或刪除您的數據。"
            : "At Corlee, we value your privacy. Any personal information you provide, such as your name, email, or company name, is collected solely for processing orders and enhancing your shopping experience. We do not sell or share your information with third parties, except where necessary to fulfill services (e.g., payment processing or shipping). Our site uses cookies to improve functionality and analyze traffic. By using our site, you consent to our privacy practices. You can contact us at any time to review or delete your data."}
        </p>
      </div>
      <BottomBar />
    </div>
  );
};

export default terms;
