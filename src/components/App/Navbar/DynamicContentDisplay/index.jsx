import SvgIcon1 from "./icons/SvgIcon1";
import SvgIcon2 from "./icons/SvgIcon2";
import SvgIcon3 from "./icons/SvgIcon3";
import SvgIcon4 from "./icons/SvgIcon4";
import "./style.css";
import messages from "./messages.json";

function DynamicContentDisplay() {
  return (
    <div className="contact-info-container-nav">
      <div className="callout-container-nav">
        <SvgIcon1 className="svg-container1-nav" />
      </div>
      <p className="contact-info-text-style-nav">{messages["call_us"]}</p>
      <div className="contact-info-section">
        <div className="card-container">
          <div className="circular-text-container">
            <SvgIcon2 className="svg-container2-nav" />
          </div>
        </div>
        <div className="card-container">
          <div className="circular-text-container">
            <SvgIcon3 className="svg-container2-nav" />
          </div>
        </div>
        <div className="vertical-number-container">
          <span className="badge-with-icon">2</span>
          <div className="vertical-center-with-icon">
            <SvgIcon4 className="svg-container2-nav" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DynamicContentDisplay;
