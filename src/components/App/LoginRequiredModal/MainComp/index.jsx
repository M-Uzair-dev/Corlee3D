import SecureAccessMessage from "../SecureAccessMessage";
import "./style.css";

function LoginReqModalMain() {
  const isMandarin = localStorage.getItem("isMandarin");
  
  return (
    <div className="login-container">
      <div className="auth-container">
        <SecureAccessMessage />
        <div className="login-container1">
          {/* Button Component is detected here. We've generated code using HTML. See other options in "Component library" dropdown in Settings */}
          <button className="login-button-style">{isMandarin ? "登入" : "Login"}</button>
          {/* Button Component is detected here. We've generated code using HTML. See other options in "Component library" dropdown in Settings */}
          <button className="button-with-border-radius">
            {isMandarin ? "建立帳號" : "Create account"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginReqModalMain;
