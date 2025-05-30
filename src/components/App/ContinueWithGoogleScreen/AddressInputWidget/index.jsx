import "./style.css";

function AddressInputWidget(props) {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="vertical-spacing-container">
      {/* Input Component is detected here. We've generated code using HTML. See other options in "Component library" dropdown in Settings */}
      <input
        placeholder={isMandarin ? "地址" : "Address"}
        value={props.data.address}
        onChange={(e) =>
          props.setData({ ...props.data, address: e.target.value })
        }
        type="text"
        className="input-field-with-border input-style-f62::placeholder"
      />
    </div>
  );
}

export default AddressInputWidget;
