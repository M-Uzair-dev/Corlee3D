import "./style.css";
import messages from "./messages.json";

function MessageDisplayBox(props) {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="subject-container">
      <p className="bold-black-label">{isMandarin ? "內容" : "Description"}</p>
      <textarea
        rows={5}
        style={{ resize: "none" }}
        id="company name"
        placeholder={isMandarin ? "請填寫您的訊息" : "Write your message here"}
        type="text"
        name="description"
        onChange={props.onChange}
        value={props.description}
        className="input-with-label-style input-style-f62::placeholder textareainput"
      />
    </div>
  );
}

export default MessageDisplayBox;
