import SecureUpdateConfirmation from "./SecureUpdateConfirmation";
import "./style.css";
import messages from "./messages.json";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { api } from "../../../config/api";

function ComponentYouSelected(props) {
  const isMandarin = localStorage.getItem("isMandarin");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const verify = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/verify-email/${props.token}/`);
      if (response.status == 200) {
        await toast.success(
          isMandarin ? "電子郵件已驗證成功" : "Email verified Successfully"
        );
        localStorage.setItem("emailnotverified", "false");

        setLoading(false);
        navigate("/");
        window.location.reload();
      } else {
        await toast.success(isMandarin ? "發生錯誤" : "An error occured !");
        setLoading(false);
        navigate("/");
      }
    } catch (e) {
      await toast.success(isMandarin ? "發生錯誤" : "An error occured !");
      setLoading(false);
      navigate("/");
    }
  };
  return (
    <div className="success-container">
      <div className="secure-password-update-notification">
        <div className="password-update-confirmation-container">
          <SecureUpdateConfirmation {...props} />
          {/* Button Component is detected here. We've generated code using HTML. See other options in "Component library" dropdown in Settings */}
          <button
            className="login-button-style"
            onClick={() => {
              props.email && props.token ? verify() : navigate("/login");
            }}
            disabled={loading}
          >
            {isMandarin
              ? loading
                ? "加載中..."
                : props.email
                ? "驗證"
                : "返回登錄"
              : loading
              ? "Loading..."
              : props.email
              ? "Verify"
              : "Return to login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ComponentYouSelected;
