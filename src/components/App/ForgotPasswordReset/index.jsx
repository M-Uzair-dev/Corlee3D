import SecurityCheckWidget from "./SecurityCheckWidget";
import "./style.css";
import messages from "./messages.json";
import { useNavigate } from "react-router-dom";

function FPReset(props) {
  const navigate = useNavigate();
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div
      style={{
        backgroundColor: "whitesmoke",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
      className="resetpage"
    >
      <div className="password-reset-form-container1">
        <div className="password-reset-form">
          <img
            src="https://d2e8m995jm0i5z.cloudfront.net/websiteimages/img_1091_3135_bcced9.webp"
            className="profile-image-placeholder"
          />
          <SecurityCheckWidget {...props} />
          <p
            className="login-link-text-style"
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer" }}
          >
            {isMandarin ? "<- 登录" : "<- Login"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FPReset;
