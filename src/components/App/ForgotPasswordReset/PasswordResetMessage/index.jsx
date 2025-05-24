import "./style.css";
import messages from "./messages.json";

function PasswordResetMessage() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="password-reset-message-container">
      <p className="password-reset-heading-style">
        {isMandarin ? "重置密碼" : "Reset password"}
      </p>
      <p className="password-reset-message">
        {isMandarin
          ? "幾乎完成！只需輸入新密碼即可。"
          : "Almost done! Just enter a new password."}
      </p>
    </div>
  );
}

export default PasswordResetMessage;
