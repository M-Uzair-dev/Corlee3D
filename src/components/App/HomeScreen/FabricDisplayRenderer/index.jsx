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
      fabricDesignCategory: isMandarin ? "產品設計" : "Product Design",
      fabricCraftingDescription: isMandarin
        ? "無論定制還是現成，我們協助製作面料，以提升您下一個季節系列的風格和性能。"
        : "Whether custom or pre-made, we assist in crafting fabrics tailored to  elevate your next seasonal collection's style & performance.",
    },
    {
      fabricDesignCategory: isMandarin ? "製造" : "Manufacturing",
      fabricCraftingDescription: isMandarin
        ? "我們與台灣的現代製造合作夥伴合作，允許我們擴大生產以滿足大訂單和小訂單的需求。"
        : "We work with modern manufacturing partners in Taiwan who allow us to scale production to meet orders both big & small.",
    },
    {
      fabricDesignCategory: isMandarin ? "質量控制" : "Quality Control",
      fabricCraftingDescription: isMandarin
        ? "通過實施紡織品測試和質量控制措施，我們確保生產缺陷率低於10%並及時交付。"
        : "By implementing textile testing & quality control measures, we ensure a production defective rate below 10% & prompt delivery.",
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
