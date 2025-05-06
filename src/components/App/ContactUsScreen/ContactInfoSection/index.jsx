import "./style.css";
import messages from "./messages.json";

function ContactInfoSection() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="contact-section4">
      <div className="contact-section">
        <div className="contact-info-container1">
          <p className="contact-heading">
            {isMandarin ? "联系我们" : "Get in touch"}
          </p>
          <p className="contact-heading-text-style">
            {isMandarin ? "想讨论什么吗？" : "Want to discuss something ?"}
          </p>
        </div>
      </div>
      <p className="contact-message">
        {isMandarin
          ? "我们期待了解您的需求，并为您量身定制解决方案。请留下您的信息，我们的团队将尽快与您联系，安排专属预约。"
          : "We look forward to learning about your needs and tailoring a solution just for you. Leave your details, and our team will get in touch shortly to schedule your personalized appointment."}
      </p>
    </div>
  );
}

export default ContactInfoSection;
