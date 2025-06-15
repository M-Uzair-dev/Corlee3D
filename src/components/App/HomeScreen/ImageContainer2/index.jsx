import "./style.css";
import image from "/images/(24)1DN7101-min.jpg";

function ImageContainer2() {
  return (
    <div className="image-container2-home">
      <img
        src={image}
        className="image-container1-home"
        alt="Fabric collection"
        loading="lazy"
        width="282"
        height="473"
      />
    </div>
  );
}

export default ImageContainer2;
