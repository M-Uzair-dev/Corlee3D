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
        {isMandarin ? "邮箱正在路上！" : "Email is on the way!"}
      </p>
      <p className="password-reset-message-text-style">
        <span>
          {isMandarin
            ? "我们发送了重置密码的说明。如果它没有很快出现，请检查您的垃圾邮件文件夹。我们向 "
            : "We sent you reset password instructions. If it doesn't show up soon, check your spam folder. We sent an email to "}
        </span>
        <span className="email-notification-text-style">{props.email}</span>
      </p>
    </div>
  );
}

export default EmailNotificationView;
