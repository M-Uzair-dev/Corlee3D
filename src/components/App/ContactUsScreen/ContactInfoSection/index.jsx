import "./style.css";
import messages from "./messages.json";

function ContactInfoSection() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="contact-section4">
      <div className="contact-section">
        <div className="contact-info-container1">
          <p className="contact-heading">
            {isMandarin ? "聯繫我們" : "Get in touch"}
          </p>
          <p className="contact-heading-text-style">
            {isMandarin ? "想討論什麼嗎？" : "Want to discuss something ?"}
          </p>
        </div>
      </div>
      <p className="contact-message">
        {isMandarin
          ? "我們期待了解您的需求，並為您量身定制解決方案。請留下您的信息，我們的團隊將盡快與您聯繫，安排專屬預約。"
          : "We look forward to learning about your needs and tailoring a solution just for you. Leave your details, and our team will get in touch shortly to schedule your personalized appointment."}
      </p>
    </div>
  );
}

export default ContactInfoSection;
