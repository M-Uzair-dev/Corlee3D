import { useState } from "react";
import UsernameInputWidget from "../UsernameInputWidget";
import PasswordInputWidget from "../PasswordInputWidget";
import "./style.css";
import messages from "./messages.json";
// import useAuthStore from "../../../../stores/useAuthstore"; // Import the auth store
import { useNavigate } from "react-router-dom";
import { api, setAuthToken } from "../../../../config/api";
import { toast } from "sonner";

function UserAuthenticationForm() {
  const isMandarin = localStorage.getItem("isMandarin");
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate empty fields
    if (!formData.username.trim()) {
      toast.error(isMandarin ? "此欄位不得留空" : "This field may not be blank.");
      return;
    }
    if (!formData.password.trim()) {
      toast.error(isMandarin ? "此欄位不得留空" : "This field may not be blank.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/login/", formData);
      if (response.status == 200) {
        if (!response.data.user.is_verified) {
          localStorage.setItem("emailnotverified", "true");
        }
        const token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("NameLetter", response.data.user.name[0]);
        console.log(response);
        setAuthToken(token);
        navigate("/");
        toast.success(isMandarin ? "登錄成功" : "Login Successful");
      } else {
        setError(response.data[Object.keys(response.data)[0]]);
      }
      setLoading(false);
    } catch (error) {
      toast.error(
        `${Object.keys(error.response.data)[0]} : ${
          error.response.data[Object.keys(error.response.data)[0]]
        }` || (isMandarin ? "帳號或密碼錯誤" : "Unable to log in with provided credentials")
      );
      setLoading(false);
    }
  };

  return (
    <div className="login-section2">
      <form>
        <UsernameInputWidget
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <PasswordInputWidget
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <div className="login-section">
          <div className="login-section1">
            <div className="checkbox-container">
              <input
                id="remember-me"
                type="checkbox"
                defaultChecked={false}
                className="hidden-input"
              />
              <img className="hidden-icon img-content-66044729" />
            </div>
            <label htmlFor="remember-me" className="remember-me-label">
              {isMandarin ? "記住我" : "Remember me"}
            </label>
          </div>
          <p
            className="user-prompt-text-style"
            onClick={() => {
              navigate("/forgot");
            }}
            style={{
              cursor: "pointer",
            }}
          >
            {isMandarin ? "忘記密碼?" : "Forgot password?"}
          </p>
        </div>
        <button
          className="login-button-style"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? isMandarin
              ? "載入中..."
              : "Loading..."
            : isMandarin
            ? "登入"
            : "Login"}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <div className="account-info-container">
        <p className="account-info-text-style">
          {isMandarin ? "没有Corlee帳戶?" : "Don't have an account?"}
        </p>
        <p
          className="sign-up-link-style"
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/signup");
          }}
        >
          {isMandarin ? "建立帳戶" : "Sign up"}
        </p>
      </div>
    </div>
  );
}

export default UserAuthenticationForm;
