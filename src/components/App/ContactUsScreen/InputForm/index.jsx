import "./style.css";
import messages from "./messages.json";

function InputForm(props) {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="fullwidth-container">
      {/* Input with Label Component is detected here. We've generated code using HTML. See other options in "Component library" dropdown in Settings */}
      <div className="horizontal-centered-label-container">
        <label htmlFor="name" className="bold-black-label">
          {isMandarin ? "您的姓名" : "Name"}
        </label>
        <input
          name="name"
          onChange={props.onChange}
          value={props.name}
          id="name"
          placeholder={isMandarin ? "i.e 張三" : "i.e Jone Doe"}
          type="text"
          className="input-with-label-style input-style-f62::placeholder"
        />
      </div>
    </div>
  );
}

export default InputForm;
