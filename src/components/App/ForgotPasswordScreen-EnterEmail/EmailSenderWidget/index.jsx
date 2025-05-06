import EmailInputBox from "../EmailInputBox";
import "./style.css";
import messages from "./messages.json";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../config/api";
import { useNavigate } from "react-router-dom";

function EmailSenderWidget() {
  const isMandarin = localStorage.getItem("isMandarin");
  const [inputvalue, setInputvalue] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const sendReq = async () => {
    try {
      setLoading(true);
      if (inputvalue === "") {
        toast.error(
          isMandarin ? "請輸入您的電子郵件地址" : "Enter your email address"
        );
      } else {
        const res = await api.post("/password_reset/", {
          email: inputvalue,
        });
        if (res.status === 200) {
          toast.success(
            isMandarin ? "電子郵件已發送成功" : "Email sent successfully"
          );
          setLoading(false);
          navigate(`/emailsent/${inputvalue}`);
        } else {
          toast.success(isMandarin ? "電子郵件未找到！" : "Email not found !");
          setLoading(false);
          navigate(`/noemail/${inputvalue}`);
        }
      }
    } catch (e) {
      setLoading(false);
      navigate(`/noemail/${inputvalue}`);
    }
  };

  return (
    <div className="center-aligned-button-container">
      <EmailInputBox inputvalue={inputvalue} setInputvalue={setInputvalue} />

      <button
        className="reset-link-button"
        onClick={sendReq}
        disabled={loading}
      >
        {loading
          ? isMandarin
            ? "加载中..."
            : "Loading..."
          : isMandarin
          ? "发送重置链接"
          : "Send reset link"}
      </button>
    </div>
  );
}

export default EmailSenderWidget;
