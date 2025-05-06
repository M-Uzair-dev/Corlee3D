import "./style.css";
import messages from "./messages.json";
import messages2 from "./messages2.json";

function FabricDescriptionSection() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="fashion-text-container">
      <div className="global-fashion-styles-container">
        <p className="fashion-statement-text-style">
          {isMandarin
            ? messages2["explore_cuttingedge_fabrics_redefining_global_fash"]
            : messages["explore_cuttingedge_fabrics_redefining_global_fash"]}
        </p>
        <p className="global-fashion-text-styles">
          {isMandarin
            ? messages2["lrem_ipsum_suledes_plankning_till_heterossade_tosn"]
            : messages["lrem_ipsum_suledes_plankning_till_heterossade_tosn"]}
        </p>
      </div>
    </div>
  );
}

export default FabricDescriptionSection;
