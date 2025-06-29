import "./style.css";

function AddressInputWidget(props) {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="hierarchical-text-container">
      {/* Input Component is detected here. We've generated code using HTML. See other options in "Component library" dropdown in Settings */}
      <input
        onChange={props.onChange}
        value={props.value}
        name="address"
        placeholder={isMandarin ? "地址" : "Address"}
        type="text"
        className="input-field-with-border input-style-f62::placeholder"
      />
    </div>
  );
}

export default AddressInputWidget;
