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
        ? "歡迎隨時跟我們分享您的想法！\n\n不管是照片、布料樣本，還是成衣的樣品，或者是在線上看到喜歡的款 式，都可以告訴我們。這樣我們才能更了解您的風格，替您量⾝開發特殊 布料。\n\n我們的研發團隊會與您密切討論，共同打造出最合您⼼意的產品。"
        : "Share your ideas with us ! \n\n Whether it’s a photo, a fabric swatch, or a sample garment, or explore our collecMon to find styles you like. \n\n We offer fully customized soluMons, with our R&D team working closely with you to create the perfect fabric tailored to your needs.",
    },
    {
      fabricDesignCategory: isMandarin ? "製造" : "Manufacturing",
      fabricCraftingDescription: isMandarin
        ? "放⼼交給我們就對了！\n\n不管您腦海中有什麼靈感，我們會⽤專業的技術幫您實現，將細節⼀⼀做 到位。我們知道您的時間寶貴，所以流程我們替您把關。效率滿分，品質 絕不妥協。\n\n我們是供應商、也是您的布料顧問。"
        : "Rest assured, you’re in good hands!\n\nWe use advanced technology to bring your fabric designs to life, ensuring every detail stays true to your vision.\n\nOur process is built for efficiency, without ever compromising on quality.",
    },
    {
      fabricDesignCategory: isMandarin ? "品質控制" : "Quality control",
      fabricCraftingDescription: isMandarin
        ? "品質是我們最重視的核⼼。\n\n每⼀塊布料都會經過層層的測試和嚴格檢驗，確保符合我們⾼標準的品質 和穩定度。\n\n我們的⽬標是成為您可靠的機能性布料夥伴"
        : "Quality is at the heart of everything we do. \n\nEvery fabric undergoes rigorous tesMng and inspecMon to ensure it meets our high standards of quality and consistency. \n\n Our goal is to deliver products you can trust and rely on every Mme.",
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
