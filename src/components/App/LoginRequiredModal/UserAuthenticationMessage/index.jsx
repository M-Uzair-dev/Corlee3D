import "./style.css";

function UserAuthenticationMessage() {
  const isMandarin = localStorage.getItem("isMandarin");
  
  return (
    <div className="login-prompt-container1">
      <p className="auth-title">{isMandarin ? "需要登入" : "Login required"}</p>
      <p className="login-prompt-style">{isMandarin ? "請先登入以繼續。" : "This action requires login."}</p>
    </div>
  );
}

export default UserAuthenticationMessage;
