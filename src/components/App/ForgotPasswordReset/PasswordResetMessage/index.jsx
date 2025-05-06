import "./style.css";
import messages from "./messages.json";

function PasswordResetMessage() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="password-reset-message-container">
      <p className="password-reset-heading-style">
        {isMandarin ? "重置密码" : "Reset password"}
      </p>
      <p className="password-reset-message">
        {isMandarin
          ? "几乎完成！只需输入新密码即可。"
          : "Almost done! Just enter a new password."}
      </p>
    </div>
  );
}

export default PasswordResetMessage;
