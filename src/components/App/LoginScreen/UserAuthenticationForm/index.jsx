import { useState, useEffect } from "react";
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
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Load saved credentials if remember me was checked
  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";
    
    if (savedRememberMe && savedUsername) {
      setFormData(prev => ({ ...prev, username: savedUsername }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
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
        
        // Handle remember me functionality
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("rememberedUsername", formData.username);
          // Set longer token expiration (optional - depends on backend)
          localStorage.setItem("rememberMeExpiration", (Date.now() + 30 * 24 * 60 * 60 * 1000).toString()); // 30 days
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("rememberedUsername");
          localStorage.removeItem("rememberMeExpiration");
        }
        
        console.log(response);
        setAuthToken(token);
        navigate("/");
        toast.success(isMandarin ? "登錄成功" : "Login Successful");
      } else {
        setError(response.data[Object.keys(response.data)[0]]);
      }
      setLoading(false);
    } catch (error) {
      // Fixed translation logic - properly handle error message fallback
      let errorMessage;
      
      if (error.response?.data) {
        const errorData = error.response.data;
        const firstKey = Object.keys(errorData)[0];
        const firstError = errorData[firstKey];
        
        // Check if it's the specific login error
        if (typeof firstError === 'string' && firstError.includes('Unable to log in with provided credentials')) {
          errorMessage = isMandarin ? "帳號或密碼錯誤" : "Unable to log in with provided credentials";
        } else if (firstError) {
          errorMessage = `${firstKey}: ${firstError}`;
        } else {
          errorMessage = isMandarin ? "帳號或密碼錯誤" : "Unable to log in with provided credentials";
        }
      } else {
        errorMessage = isMandarin ? "帳號或密碼錯誤" : "Unable to log in with provided credentials";
      }
      
      toast.error(errorMessage);
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
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMeChange}
              className="normal-checkbox"
            />
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
