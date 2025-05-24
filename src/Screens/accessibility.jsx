import React from "react";
import Navbar from "../components/App/Navbar";
import BottomBar from "../components/App/BottomBar";

const terms = () => {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div>
      <Navbar />
      <div className="containerTerms">
        <h1>{isMandarin ? "無障礙" : "Accessibility"}</h1>
        <p>
          {isMandarin
            ? "在 Corlee，無障礙設計是我們服務所有客戶的重要承諾。我們致力於確保每位用戶，包括有殘障人士，都能順利瀏覽、選購並與我們的批發布料系列互動。我們的網站遵循包容性設計原則，支援鍵盤導航、為圖片提供替代文字，以及提供清晰的視覺對比，幫助視覺或行動不便的使用者。我們持續依據《網頁內容無障礙指引》（WCAG）改進數位無障礙性，並歡迎您的回饋，以協助我們打造更具包容性的使用體驗。"
            : "At Corlee, accessibility is a core part of our commitment to serving all customers. We strive to ensure that everyone, including people with disabilities, can seamlessly browse, shop, and interact with our wholesale fabric collections. Our website is designed with inclusive practices such as keyboard navigation support, alternative text for images, and clear visual contrast to aid users with vision or mobility challenges. We are continuously working to improve our digital accessibility in line with the Web Content Accessibility Guidelines (WCAG) and welcome feedback to help us create an even more inclusive experience."}
        </p>
      </div>
      <BottomBar />
    </div>
  );
};

export default terms;
