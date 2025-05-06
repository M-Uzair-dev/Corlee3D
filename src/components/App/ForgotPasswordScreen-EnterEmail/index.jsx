import PasswordRecoveryMessage from "./PasswordRecoveryMessage";
import EmailSenderWidget from "./EmailSenderWidget";
import "./style.css";
import messages from "./messages.json";
import { useNavigate } from "react-router-dom";

function FPEnterEmail() {
  const isMandarin = localStorage.getItem("isMandarin");
  const navigate = useNavigate();
  return (
    <div className="password-reset-form-container1-email">
      <div className="password-reset-section-email">
        <div className="password-reset-container-email">
          <div className="password-reset-form-container-email">
            <PasswordRecoveryMessage />
            <EmailSenderWidget />
            <p
              className="forgot-password-link-email"
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                navigate(-1);
              }}
            >
              {isMandarin ? "返回登录" : "Back to login"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FPEnterEmail;
