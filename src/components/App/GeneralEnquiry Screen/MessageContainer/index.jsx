import MessageActions from "../MessageActions";
import "./style.css";
import messages from "./messages.json";
import { toast } from "sonner";

function MessageContainer(props) {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="contact-info-container3">
      <div className="contact-info-container2 static">
        <p className="contact-info-text">{props.user.email}</p>
        <p
          className="highlighted-text"
          onClick={() => {
            navigator.clipboard.writeText(props.user.email);
            toast.success(
              isMandarin ? "已复制到剪贴板" : "Copied to clipboard"
            );
          }}
          style={{ cursor: "pointer" }}
        >
          {isMandarin ? "复制" : "Copy"}
        </p>
      </div>
      <MessageActions {...props} />
    </div>
  );
}

export default MessageContainer;
