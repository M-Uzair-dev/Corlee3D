import "./style.css";
import messages from "./messages.json";
import { toast } from "sonner";

function MessageActions(props) {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <>
      <div className="contact-info-container">
        <div className="contact-info-container2 static">
          <p className="contact-info-text">{props.user.phone}</p>
          <p
            className="highlighted-text"
            onClick={() => {
              navigator.clipboard.writeText(props.user.phone);
              toast.success(
                isMandarin ? "已复制到剪贴板" : "Copied to clipboard"
              );
            }}
            style={{ cursor: "pointer" }}
          >
            {isMandarin ? "复制" : "Copy"}
          </p>
        </div>
      </div>{" "}
      <div className="contact-buttons-container">
        {/* Button Component is detected here. We've generated code using HTML. See other options in "Component library" dropdown in Settings */}
        <button className="email-button-style">
          {isMandarin ? "发送邮件" : "Send Email"}
        </button>
        {/* Button Component is detected here. We've generated code using HTML. See other options in "Component library" dropdown in Settings */}
        <button className="call-button-style">
          {isMandarin ? "打电话" : "Make Call"}
        </button>
      </div>
    </>
  );
}

export default MessageActions;
