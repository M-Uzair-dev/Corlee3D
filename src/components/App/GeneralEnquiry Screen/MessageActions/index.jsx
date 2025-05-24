import "./style.css";
import messages from "./messages.json";
import { toast } from "sonner";

function MessageActions(props) {
  const isMandarin = localStorage.getItem("isMandarin");
  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(props.user.phone);
      toast.success(isMandarin ? "已複製到剪貼板" : "Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  return (
    <>
      <div className="contact-info-container">
        <div className="contact-info-container2 static">
          <p className="contact-info-text">{props.user.phone}</p>
          <p
            className="highlighted-text"
            onClick={copyToClipboard}
            style={{ cursor: "pointer" }}
          >
            {isMandarin ? "複製" : "Copy"}
          </p>
        </div>
      </div>{" "}
      <div className="contact-buttons-container">
        {/* Button Component is detected here. We've generated code using HTML. See other options in "Component library" dropdown in Settings */}
        <button className="email-button-style">
          {isMandarin ? "發送郵件" : "Send Email"}
        </button>
        {/* Button Component is detected here. We've generated code using HTML. See other options in "Component library" dropdown in Settings */}
        <button className="call-button-style">
          {isMandarin ? "打電話" : "Make Call"}
        </button>
      </div>
    </>
  );
}

export default MessageActions;
