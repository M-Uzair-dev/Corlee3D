import "./style.css";
import messages from "./messages.json";

function ContactInfoSection() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="contact-section4">
      <div className="contact-section">
        <div className="contact-info-container1">
          <p className="contact-heading">Get in touch</p>
          <p className="contact-heading-text-style">We are here to help!</p>
        </div>
      </div>
      <p className="contact-message">
        {isMandarin
          ? "請填寫以下業務諮詢表單，我們將盡快與您聯絡。"
          : "Complete the form to get in touch with our sales team."}
      </p>
    </div>
  );
}

export default ContactInfoSection;
