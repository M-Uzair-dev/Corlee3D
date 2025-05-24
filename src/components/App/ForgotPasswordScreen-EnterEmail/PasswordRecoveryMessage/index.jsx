import "./style.css";
import messages from "./messages.json";

function PasswordRecoveryMessage() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="password-reset-info-box-email">
      <p className="password-reset-message-email">
        {isMandarin ? "忘記密碼？" : "Forgot password?"}
      </p>
      <p className="password-reset-message1-email">
        {isMandarin
          ? "不用擔心，輸入您的賬戶郵箱地址，我們將發送重置密碼的鏈接"
          : "Don't worry, enter your account email address, and we will send a link to reset your password"}
      </p>
    </div>
  );
}

export default PasswordRecoveryMessage;
