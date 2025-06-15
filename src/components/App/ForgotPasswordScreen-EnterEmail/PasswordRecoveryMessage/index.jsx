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
          ? "別擔心，請輸入註冊電子郵件，我們會寄送重設密碼連結。"
          : "Don't worry, enter your account email address, and we will send a link to reset your password."}
      </p>
    </div>
  );
}

export default PasswordRecoveryMessage;
