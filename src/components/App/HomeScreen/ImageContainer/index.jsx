import "./style.css";
import image from "/images/IMG_9129-min.jpg";

function ImageContainer() {
  return (
    <div className="vertical-margin-top-24px">
      <img
        src={image}
        className="image-container3"
        alt="Fabric showcase"
        loading="lazy"
        width="282"
        height="436"
      />
    </div>
  );
}

export default ImageContainer;
