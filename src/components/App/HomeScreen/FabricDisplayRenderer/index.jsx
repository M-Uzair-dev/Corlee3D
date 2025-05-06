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
      fabricDesignCategory: isMandarin ? "产品设计" : "Product Design",
      fabricCraftingDescription: isMandarin
        ? "无论定制还是现成，我们协助制作面料，以提升您下一个季节系列的风格和性能。"
        : "Whether custom or pre-made, we assist in crafting fabrics tailored to  elevate your next seasonal collection's style & performance.",
    },
    {
      fabricDesignCategory: isMandarin ? "制造" : "Manufacturing",
      fabricCraftingDescription: isMandarin
        ? "我们与台湾的现代制造合作伙伴合作，允许我们扩大生产以满足大订单和小订单的需求。"
        : "We work with modern manufacturing partners in Taiwan who allow us to scale production to meet orders both big & small.",
    },
    {
      fabricDesignCategory: isMandarin ? "质量控制" : "Quality Control",
      fabricCraftingDescription: isMandarin
        ? "通过实施纺织品测试和质量控制措施，我们确保生产缺陷率低于10%并及时交付。"
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
