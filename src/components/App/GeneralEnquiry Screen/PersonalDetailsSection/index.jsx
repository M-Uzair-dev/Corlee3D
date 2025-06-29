import "./style.css";
import messages from "./messages.json";

function PersonalDetailsSection(props) {
  const isMandarin = localStorage.getItem("isMandarin");
  console.log("props.user : ",props.user)
  return (
    <div className="personal-details-container1">
      <p className="personal-details-title1">
        {isMandarin ? "個人詳情" : "Personal Details"}
      </p>
      <p className="personal-details-title">
        {isMandarin ? "姓名" : "Name"} : <span className="english">{props.user.name || "--"}</span>
      </p>
      <p className="personal-details-title">
        {isMandarin ? "公司名稱" : "Company Name"} : <span className="english">{props.user.company_name || "--"}</span>
      </p>
    </div>
  );  
}

export default PersonalDetailsSection;
