import "./style.css";
import messages from "./messages.json";

function PasswordRecoveryMessage() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="password-reset-info-box-email">
      <p className="password-reset-message-email">
        {isMandarin ? "忘记密码？" : "Forgot password?"}
      </p>
      <p className="password-reset-message1-email">
        {isMandarin
          ? "不用担心，输入您的账户邮箱地址，我们将发送重置密码的链接"
          : "Don't worry, enter your account email address, and we will send a link to reset your password"}
      </p>
    </div>
  );
}

export default PasswordRecoveryMessage;
