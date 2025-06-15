import "./style.css";
import image from "/images/IMG_8991-min.jpg";

function ImageContainer4() {
  return (
    <div className="image-container2-home">
      <img
        src={image}
        className="image-container-home"
        alt="Fabric display"
        loading="lazy"
        width="250"
        height="436"
      />
    </div>
  );
}

export default ImageContainer4;
