import "./style.css";
import messages from "./messages.json";

function PersonalDetailsSection(props) {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="personal-details-container1">
      <p className="personal-details-title1">
        {isMandarin ? "個人詳情" : "Personal Details"}
      </p>
      <p className="personal-details-title">
        {isMandarin ? "姓名" : "Name"} : {props.user.name}
      </p>
    </div>
  );
}

export default PersonalDetailsSection;
