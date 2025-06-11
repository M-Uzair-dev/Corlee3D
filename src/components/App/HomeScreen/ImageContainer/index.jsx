import "./style.css";
import image from "/images/IMG_9129-min.jpg";

function ImageContainer() {
  return (
    <div className="vertical-margin-top-24px">
      <img
        src={image}
        className="image-container3"
      />
    </div>
  );
}

export default ImageContainer;
