import "./style.css";
import logo1 from "./images/logo1.png";
import logo2 from "./images/logo2.png";
import logo3 from "./images/logo3.png";
import logo4 from "./images/logo4.png";
import logo5 from "./images/logo5.png";
import logo6 from "./images/logo6.png";

function ImageContainer1() {
  const logos = [logo1, logo2, logo3, logo4, logo5, logo6];
  
  return (
    <div className="images-carousel">
      {/* First set of logos */}
      <div className="logos-slide">
        {logos.map((logo, index) => (
          <img
            key={`logo-1-${index}`}
            src={logo}
            alt={`Logo ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Duplicate set of logos to create seamless loop */}
      <div className="logos-slide">
        {logos.map((logo, index) => (
          <img
            key={`logo-2-${index}`}
            src={logo}
            alt={`Logo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageContainer1;
