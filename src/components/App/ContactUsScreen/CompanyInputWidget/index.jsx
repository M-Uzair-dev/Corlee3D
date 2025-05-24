import "./style.css";
import messages from "./messages.json";

function CompanyInputWidget(props) {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="subject-container">
      {/* Input with Label Component is detected here. We've generated code using HTML. See other options in "Component library" dropdown in Settings */}
      <div className="horizontal-centered-label-container">
        <label htmlFor="company name" className="bold-black-label label5">
          {isMandarin ? "公司名稱" : "Company Name"}
        </label>
        <input
          id="company name"
          placeholder={isMandarin ? "i.e 公司名稱" : "i.e Company Name"}
          type="text"
          name="company_name"
          onChange={props.onChange}
          value={props.company_name}
          className="input-with-label-style input-style-f62::placeholder"
        />
      </div>
    </div>
  );
}

export default CompanyInputWidget;
