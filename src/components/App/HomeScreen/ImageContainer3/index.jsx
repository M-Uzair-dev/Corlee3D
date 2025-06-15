import "./style.css";
import image from "/images/(32)1G7146-min.jpg"

function ImageContainer3() {
  return (
    <div className="vertical-spacing-container">
      <img
        src={image}
        className="masked-image-container"
        alt="Fabric showcase with mask"
        loading="lazy"
        width="410"
        height="291"
      />
    </div>
  );
}

export default ImageContainer3;
