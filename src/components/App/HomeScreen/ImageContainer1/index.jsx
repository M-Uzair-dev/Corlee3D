import "./style.css";
import image from "/images/IMG_0708-min.jpg";

function ImageContainer1() {
  return (
    <div className="vertical-margin-top-24px">
      <img
        src={image}
        className="image-container-styles1"
      />
    </div>
  );
}

export default ImageContainer1;
