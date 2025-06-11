import "./style.css";
import image from "/images/IMG_0718-min.jpg"
function ImageContainer() {
  return (
    <div className="image-wrapper">
      <img
        src={image}
        className="image-container-outer"
      />
    </div>  
  );
}

export default ImageContainer;
