import { theme } from "../../../../util";
import FabricInfoDisplay from "../FabricInfoDisplay";
import "./style.css";

function FabricDisplayRenderer() {
  const isMandarin = localStorage.getItem("isMandarin");
  const fabricDisplayRendererStyles = [
    { layoutAlignmentPreference: theme.others.ALIGN_SELF_8FD4E705 },
    {
      textAlignmentStyle: theme.others.TEXT_ALIGN_AEB2CC55,
      layoutAlignmentPreference: theme.others.ALIGN_SELF_AEB2CC55,
    },
    { layoutAlignmentPreference: theme.others.ALIGN_SELF_8FD4E705 },
  ];
  const fabricInfoOptions = [
    {
      fabricDesignCategory: isMandarin ? "產品設計" : "Product design",
      fabricCraftingDescription: isMandarin
        ? "歡迎隨時跟我們分享您的想法！不管是照片、布料樣本，還是成衣的樣品，或者是在線上看到喜 歡的款式，都可以告訴我們。這樣我們才能更了解您的風格，替您量身開發特殊布料。我們的研 發團隊會與您密切討論，共同打造出最合您心意的產品。"
        : "Share your ideas with us — whether it's a photo, a fabric swatch, or a sample garment, or explore our collection to find styles you like. We offer fully customized solutions, with our R&D team working closely with you to create the perfect fabric tailored to your needs.",
    },
    {
      fabricDesignCategory: isMandarin ? "製造" : "Manufacturing",
      fabricCraftingDescription: isMandarin
        ? "放心交給我們就對了！ 不管您腦海中有什麼靈感，我們會用專業的技術幫您實現，將細節一一做到位。 我們知道您的時間寶貴，所以流程我們替您把關。效率滿分，品質絕不妥協。 我們是供應商、也是您的布料顧問。一起把理想做出來。"
        : "Rest assured, you're in good hands! We use advanced technology to bring your fabric designs to life, ensuring every detail stays true to your vision. Our process is built for efficiency, without ever compromising on quality.",
    },
    {
      fabricDesignCategory: isMandarin ? "品質控制" : "Quality control",
      fabricCraftingDescription: isMandarin
        ? "品質是我們最重視的核心。 每一塊布料都會經過層層的測試和嚴格檢驗，確保符合我們高標準的品質和穩定度。 我們的目標是成為您可靠的機能性布料夥伴🫰"
        : "Quality is at the heart of everything we do. Every fabric undergoes rigorous testing and inspection to ensure it meets our high standards of quality and consistency. Our goal is to deliver products you can trust and rely on every time.",
    },
  ];
  return (
    <div className="fabric-design-description-list">
      {fabricInfoOptions.map((data, index) => {
        return (
          <FabricInfoDisplay
            {...data}
            key={index}
            {...fabricDisplayRendererStyles[index]}
          />
        );
      })}
    </div>
  );
}

export default FabricDisplayRenderer;
