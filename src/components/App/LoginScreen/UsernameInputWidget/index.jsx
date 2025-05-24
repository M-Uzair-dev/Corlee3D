import "./style.css";

function UsernameInputWidget({ name, value, onChange }) {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="center-box">
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={isMandarin ? "用戶名" : "Username"}
        type="text"
        className="input-with-border-radius input-style-f62::placeholder"
      />
    </div>
  );
}

export default UsernameInputWidget;
