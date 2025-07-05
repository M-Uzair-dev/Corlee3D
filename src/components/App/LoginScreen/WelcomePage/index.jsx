import StylishContentBlock from "../StylishContentBlock";
import UserAuthenticationForm from "../UserAuthenticationForm";
import SvgIcon1 from "./icons/SvgIcon1";
import "./style.css";
import messages from "./messages.json";
import { googleLogin } from "../../../../firebaseConfig";
import { api, setAuthToken } from "../../../../config/api";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function WelcomePage() {
  const isMandarin = localStorage.getItem("isMandarin");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  async function logGoogleLoginInfo() {
    try {
      setLoading(true);
      const { token, error } = await googleLogin();
      if (error) {
        toast.error(isMandarin ? "Google 登入失敗" : "Google login failed.");
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
          toast.success(isMandarin ? "登錄成功" : "Login successful.");
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
    <div className="hero-section2">
      <div className="central-content-panel">
        <p className="hero-title-text-style">
          {isMandarin ? "登入您的Corlee帳戶" : "Welcome to Corlee"}
        </p>
        <p className="central-text-block">
          {isMandarin
            ? "註冊以加入最愛及查看訂單"
            : "Access your account and discover more!"}
        </p>
        <button
          className="button-with-icon"
          onClick={logGoogleLoginInfo}
          disabled={loading}
        >
          <SvgIcon1 className="svg-container" />
          {loading
            ? isMandarin
              ? "載入中..."
              : "Loading..."
            : isMandarin
            ? "使用Google登入"
            : "Login with google"}
        </button>
        <StylishContentBlock />
        <UserAuthenticationForm />
      </div>
      <div className="login-section6">
        <img
          src="/images/login-image.jpg"
          className="image-container-full-width"
        />
      </div>
    </div>
  );
}

export default WelcomePage;
