import SvgIcon1 from "./icons/SvgIcon1";
import "./style.css";
import messages from "./messages.json";

function EmailDisplayWidget(props) {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="flex-container-with-icon">
      <input
        type="text"
        className="id-label-text-style"
        placeholder={isMandarin ? "電子郵件" : "Email"}
        name="email"
        onChange={props.onChange}
        value={props.value}
      />
      <div className="id-container">
        <SvgIcon1 className="svg-container1" />
      </div>
    </div>
  );
}

export default EmailDisplayWidget;
