import MessageActions from "../MessageActions";
import "./style.css";
import messages from "./messages.json";
import { toast } from "sonner";

function MessageContainer(props) {
  const isMandarin = localStorage.getItem("isMandarin");
  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(props.user.email);
      toast.success(isMandarin ? "已複製到剪貼板" : "Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  return (
    <div className="contact-info-container3">
      <div className="contact-info-container2 static">
        <p className="contact-info-text">{props.user.email}</p>
        <p
          className="highlighted-text"
          onClick={copyToClipboard}
          style={{ cursor: "pointer" }}
        >
          {isMandarin ? "複製" : "Copy"}
        </p>
      </div>
      <MessageActions {...props} />
    </div>
  );
}

export default MessageContainer;
