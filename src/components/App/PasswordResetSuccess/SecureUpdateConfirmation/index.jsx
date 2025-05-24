import SvgIcon1 from "./icons/SvgIcon1";
import "./style.css";
import messages from "./messages.json";

function SecureUpdateConfirmation(props) {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="success-message-container">
      <div className="secure-box">
        <SvgIcon1 className="svg-container" />
      </div>

      <p className="success-message-style">
        {props.email
          ? isMandarin
            ? "驗證您的電子郵件"
            : "Verify your email"
          : isMandarin
          ? "密碼更新成功"
          : "Success!"}
      </p>
      {props.email ? (
        <p className="password-update-message">
          {isMandarin
            ? "請驗證您的電子郵件地址以完全激活您的 Corlee 帳戶並獲得對所有服務和功能的完全訪問權限。"
            : "Please verify your email address to fully activate your Corlee account and gain unrestricted access to all our services and features."}
        </p>
      ) : (
        <p className="password-update-message">
          {isMandarin
            ? "您的密碼已更新且安全。您現在可以再次登錄。"
            : "Your password has been updated & is secure. You can now login again"}
        </p>
      )}
    </div>
  );
}

export default SecureUpdateConfirmation;
