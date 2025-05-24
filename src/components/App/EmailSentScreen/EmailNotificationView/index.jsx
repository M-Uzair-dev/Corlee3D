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
        {isMandarin ? "郵箱正在路上！" : "Email is on the way!"}
      </p>
      <p className="password-reset-message-text-style">
        <span>
          {isMandarin
            ? "我們發送了重置密碼的說明。如果它沒有很快出現，請檢查您的垃圾郵件文件夾。我們向 "
            : "We sent you reset password instructions. If it doesn't show up soon, check your spam folder. We sent an email to "}
        </span>
        <span className="email-notification-text-style">{props.email}</span>
      </p>
    </div>
  );
}

export default EmailNotificationView;
