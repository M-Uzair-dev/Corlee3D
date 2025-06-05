import CustomerFormSection from "../CustomerFormSection";
import "./style.css";
import messages from "./messages.json";

function FormSectionWithMessage(props) {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="form-container">
      <p className="header-title-text-style">
        {isMandarin ? "請填寫下⽅資訊" : "Fill out the form below"}
      </p>
      <CustomerFormSection {...props} />
    </div>
  );
}

export default FormSectionWithMessage;
