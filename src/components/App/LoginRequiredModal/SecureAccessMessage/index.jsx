import UserAuthenticationMessage from "../UserAuthenticationMessage";
import "./style.css";

function SecureAccessMessage() {
  const isMandarin = localStorage.getItem("isMandarin");
  
  return (
    <div className="login-prompt-container">
      <img
        src="https://d2e8m995jm0i5z.cloudfront.net/websiteimages/img_1135_5784_3d0517.svg"
        alt=""
        className="login-required-container"
      />
      <UserAuthenticationMessage />
      <p className="login-prompt-text-style">
        {isMandarin ? "請先登入以繼續。" : "Please login to continue"}
      </p>
    </div>
  );
}

export default SecureAccessMessage;
