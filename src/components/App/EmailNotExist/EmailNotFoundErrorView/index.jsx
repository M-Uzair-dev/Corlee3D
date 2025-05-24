import SvgIcon1 from "./icons/SvgIcon1";
import "./style.css";
import messages from "./messages.json";

function EmailNotFoundErrorView(props) {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="email-not-found-message-container">
      <div className="email-not-found-container2">
        <SvgIcon1 className="svg-container" />
      </div>
      <p className="error-message-title">
        {isMandarin ? "郵箱不存在" : "Email does not exist."}
      </p>
      <p className="email-not-found-message1">
        <span>
          {isMandarin
            ? "我們無法找到您輸入的電子郵件，似乎您輸入的電子郵件不存在。"
            : "We are unable to find the email you entered, it seems like the email you entered does not exist."}
        </span>
        <span className="email-not-found-message">{props.email}</span>
      </p>
    </div>
  );
}

export default EmailNotFoundErrorView;
