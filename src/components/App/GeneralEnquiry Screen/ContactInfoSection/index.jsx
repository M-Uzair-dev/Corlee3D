import MessageContainer from "../MessageContainer";
import "./style.css";
import messages from "./messages.json";

function ContactInfoSection(props) {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="contact-details-container">
      <p className="contact-details-heading mb40">
        {isMandarin ? "聯繫詳情" : "Contact Details"}
      </p>
      <MessageContainer {...props} />
    </div>
  );
}

export default ContactInfoSection;
