import ContactInfoSection1 from "../ContactInfoSection1";
import ImageContainer from "../ImageContainer";
import "./style.css";
import messages from "./messages.json";

function ContactInfoDisplay() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="contact-info-section1">
      <div>
        <ContactInfoSection1 />
        <div className="contact-info-divider" />
        <div className="contact-info-section">
          <p className="header-title">{isMandarin ? "联系我们" : "Email Us"}</p>
          <p className="golden-text-heading">{localStorage.getItem("email")}</p>
        </div>
        <div className="contact-info-divider" />
        <div className="contact-info-section">
          <p className="header-title">{isMandarin ? "访问我们" : "Visit Us"}</p>
          <p className="location-details-text-style">
            {localStorage.getItem("address")}
          </p>
        </div>
        <ImageContainer />
      </div>
    </div>
  );
}

export default ContactInfoDisplay;
