import StylishLayout from "../StylishLayout";
import UserRegistrationLayout from "../UserRegistrationLayout";
import SvgIcon1 from "./icons/SvgIcon1";
import "./style.css";
import messages from "./messages.json";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "../../../../firebaseConfig.js";
import { api, setAuthToken } from "../../../../config/api.js";
import { useState } from "react";
import { toast } from "sonner";

function UserSignupSection() {
  const isMandarin = localStorage.getItem("isMandarin");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  async function logGoogleLoginInfo() {
    try {
      setLoading(true);
      const { token, error } = await googleLogin();
      if (error) {
        toast.error("Google login failed.");
        setLoading(false);
        return;
      }
      const response = await api.post("/google-login/", {
        idToken: token,
      });
      if (response.status == 200) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("NameLetter", response.data.user.name[0]);
        setAuthToken(token);
        if (!response.data.user.company_name) {
          navigate("/addCompanyDetails");
          toast.success(
            isMandarin
              ? "請輸入您的公司詳細資料"
              : "Please enter your company details"
          );
          localStorage.setItem("Company", "false");
        } else {
          navigate("/");
          toast.success(
            isMandarin ? "帳戶已成功創建" : "Account created successfully"
          );
        }
      } else {
        toast.error(
          e.message || (isMandarin ? "發生錯誤" : "Something went wrong")
        );
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <div className="vertical-form-container">
      {/* Button Component is detected here. We've generated code using HTML. See other options in "Component library" dropdown in Settings */}
      <button
        className="button-with-icon-and-text"
        onClick={logGoogleLoginInfo}
      >
        <SvgIcon1 className="svg-container" />
        {isMandarin ? "使用 Google 註冊" : "Sign up with google"}
      </button>
      <StylishLayout />
      <UserRegistrationLayout loading={loading} setLoading={setLoading} />
      <div className="account-actions-container">
        <p className="login-prompt-text-style">
          {isMandarin ? "已經有帳號？" : "Already have an account?"}
        </p>
        <p
          className="login-link-text-style"
          onClick={() => {
            navigate("/login");
          }}
          style={{ cursor: "pointer" }}
        >
          {isMandarin ? "登入" : "Login"}
        </p>
      </div>
    </div>
  );
}

export default UserSignupSection;
