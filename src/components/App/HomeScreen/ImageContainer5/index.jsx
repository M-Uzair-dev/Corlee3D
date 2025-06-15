import "./style.css";
import image from "/images/IMG_9148-min.jpg";

function ImageContainer5() {
  return (
    <div className="vertical-margin-top-24px">
      <img
        src={image}
        className="image-container-styles"
        alt="Fabric showcase"
        loading="lazy"
        width="249"
        height="369"
      />
    </div>
  );
}

export default ImageContainer5;
