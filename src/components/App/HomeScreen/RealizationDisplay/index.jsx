import ImageContainer5 from "../ImageContainer5";
import ImageContainer from "../ImageContainer";
import ImageContainer2 from "../ImageContainer2";
import ImageContainer1 from "../ImageContainer1";
import ImageContainer4 from "../ImageContainer4";
import "./style.css";
import messages from "./messages.json";
import image1 from "/images/IMG_6840-min.jpg";
import image2 from "/images/(62-2)2F9708-min.jpg";
import image3 from "/images/IMG_0707-min.jpg";
import image4 from "/images/IMG_9152-min.jpg";
import image5 from "/images/(55-2)2A7727-min.jpg";

function RealizationDisplay() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="realization-container-home">
      <p className="majestic-heading-home" data-aos="fade-up" data-aos-duration="1000">
        {isMandarin ? "布料合集" : "Realizations"}
      </p>
      <div className="realization-container1-home">
        <div className="image-container-with-text1-home" data-aos="fade-right" data-aos-duration="1000">
          <img
            src={image1}
            className="hero-image-container1-home"
          />
          <ImageContainer5 />
        </div>
        <div className="nested-content-container-home" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
          <img
            src={image2}
            className="image-container-fullscreen-home"
          />
          <ImageContainer />
        </div>
        <div className="realization-container-home" data-aos="fade-left" data-aos-duration="1000">
          <img
            src={image3}
            className="profile-image-container1-home"
          />
          <ImageContainer2 />
        </div>
        <div className="image-container-with-text-home" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="200">
          <img
            src={image4}
            className="hero-image-container-home"
          />
          <ImageContainer1 />
        </div>
        <div className="vertical-image-container-home" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="400">
          <img
            src={image5}
            className="profile-image-container-home"
          />
          <ImageContainer4 />
        </div>
      </div>
    </div>
  );
}

export default RealizationDisplay;
