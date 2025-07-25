import UserSignupSection from "../UserSignupSection";
import "./style.css";
import messages from "./messages.json";

function AccountCreationSection() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="account-creation-form-container">
      <p className="hero-title inSignup">
        {isMandarin ? "建立帳號" : "Create account"}
      </p>
      <UserSignupSection />
    </div>
  );
}

export default AccountCreationSection;
