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
            ? "验证您的电子邮件"
            : "Verify your email"
          : isMandarin
          ? "密码更新成功"
          : "Success!"}
      </p>
      {props.email ? (
        <p className="password-update-message">
          {isMandarin
            ? "请验证您的电子邮件地址以完全激活您的 Corlee 帐户并获得对所有服务和功能的完全访问权限。"
            : "Please verify your email address to fully activate your Corlee account and gain unrestricted access to all our services and features."}
        </p>
      ) : (
        <p className="password-update-message">
          {isMandarin
            ? "您的密码已更新且安全。您现在可以再次登录。"
            : "Your password has been updated & is secure. You can now login again"}
        </p>
      )}
    </div>
  );
}

export default SecureUpdateConfirmation;
