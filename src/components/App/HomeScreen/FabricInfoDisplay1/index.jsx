import FabricDescriptionSection from "../FabricDescriptionSection";
import ImageContainer3 from "../ImageContainer3";
import FabricExplorer from "../FabricExplorer";
import FabricDisplayRenderer from "../FabricDisplayRenderer";
import RealizationDisplay from "../RealizationDisplay";
import SvgIcon1 from "./icons/SvgIcon1";
import "./style.css";
import messages from "./messages.json";
import messages2 from "./messages2.json";
import { useNavigate } from "react-router-dom";
import arrow from "../../../../../public/pngegg.png";
import image from "/images/IMG_0668-min.jpg"
import image2 from "/images/IMG_0662-min.jpg"

function FabricInfoDisplay1({ fabricInfoOptions }) {
  const navigate = useNavigate();
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="global-fashion-fabric-styles">
      <div data-aos="fade-up" data-aos-duration="1000">
        <FabricDescriptionSection />
      </div>
      
      <div className="fabric-gallery-container">
        <img
          src={image}
          className="image-container-with-clipping-path"
          data-aos="fade-right"
          data-aos-duration="1000"
          alt="Fabric showcase with clipping path"
          loading="lazy"
          width="403"
          height="387"
        />
        <div className="fashion-text-container2" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
          <button
            className="button-with-icon2"
            onClick={() => {
              navigate("/about");
            }}
          >
            {isMandarin
              ? messages2["discover_more"]
              : messages["discover_more"]}
            <SvgIcon1 className="svg-container3" />
          </button>
          <ImageContainer3 />
        </div>
        <img
          src={image2}
          className="image-container-with-clipping-path"
          data-aos="fade-left"
          data-aos-duration="1000"
          alt="Fabric showcase with clipping path"
          loading="lazy"
          width="403"
          height="387"
        />
      </div>

      <FabricExplorer />
      
      <div className="custom-fabric-features-section">
        <div className="custom-fabric-description-container" data-aos="fade-right" data-aos-duration="1000">
          <p className="majestic-heading1">
            {isMandarin
              ? messages2["we_analyzeltbr_gtwe_refineltbr_gtwe_innovate"]
              : messages["we_analyzeltbr_gtwe_refineltbr_gtwe_innovate"]}
          </p>
          <p className="custom-fabric-description-style">
            {isMandarin
              ? messages2["we_trusted_partner_offering_crafted_custom_functio"]
              : messages["we_trusted_partner_offering_crafted_custom_functio"]}
          </p>
          <p
            className="hero-text-underline"
            style={{
              cursor: "pointer",
            }}
            onClick={() => navigate("/about")}
          >
            {isMandarin ? messages2["about_us_gt"] : messages["about_us_gt"]}
            <img className="arrow arrowdiff" src={arrow} alt="arrow" />
          </p>
        </div>
        <div data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
          <FabricDisplayRenderer fabricInfoOptions={fabricInfoOptions} />
        </div>
      </div>
      
      <div data-aos="fade-up" data-aos-duration="1000">
        <RealizationDisplay />
      </div>
    </div>
  );
}

export default FabricInfoDisplay1;
