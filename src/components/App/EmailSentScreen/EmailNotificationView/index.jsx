import SvgIcon1 from "./icons/SvgIcon1";
import "./style.css";
import messages from "./messages.json";

function EmailNotificationView(props) {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="email-notification-container4">
      <div className="email-notification-container">
        <SvgIcon1 className="svg-container" />
      </div>
      <p className="email-notification-heading">
        {isMandarin ? "信件送達中！" : "Email is on the way!"}
      </p>
      <p className="password-reset-message-text-style">
        <span>
          {isMandarin
            ? "我們已寄出重設密碼連結⾄ "
            : "We sent you reset password instructions. If it doesn't show up soon, check your spam folder. We sent an email to "}
        </span>
        <span className="email-notification-text-style">{props.email}</span>
        <span>
          {isMandarin
            ? "，如果沒收到請檢查您的垃圾信箱。"
            : ""}
        </span>
      </p>
    </div>
  );
}

export default EmailNotificationView;
