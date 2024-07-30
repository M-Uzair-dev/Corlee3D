import "./style.css";
import messages from "./messages.json";
import { useState } from "react";
import SvgIcon1 from "../PasswordInputWidget/icons/SvgIcon1";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { api } from "../../../../config/api";

function SecurePasswordForm(props) {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState("");
  const [loading, setloading] = useState(false);

  const resetPass = async () => {
    try {
      setloading(true);

      const res = await api.post("/password_reset/done/", {
        new_password1: password,
        new_password2: confirm,
        token: props.token,
        uid: props.uid,
      });
      if (res.status === 200) {
        toast.success("Password reset successfully");
        setloading(false);
        navigate("/login");
      } else {
        toast.error("An error occured");
        setloading(false);
        navigate("/");
      }
    } catch (e) {
      toast.error("An error occured");
      setloading(false);
      navigate("/");
    }
  };
  return (
    <div className="password-reset-form-container">
      <div className="nested-svg-container">
        <div className="flex-row-container">
          <input
            placeholder="New Password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-with-icon input-style-f62::placeholder"
          />
          <SvgIcon1 className="svg-container" />
        </div>
      </div>
      <div className="text-content-container container2">
        <div className="text-grouping-container">
          <div className="text-content-container">
            <img
              src="/assets/img_1091_3147_dc1186.svg"
              alt=""
              className="text-image-block"
            />
            <p className="text-styler">{messages["lowercase_characters"]}</p>
          </div>
          <div className="text-block-container">
            <img
              src="/assets/img_1091_3150_903815.svg"
              alt=""
              className="text-image-block"
            />
            <p className="text-styler">{messages["numbers"]}</p>
          </div>
        </div>
        <div className="vertical-text-block">
          <div className="text-content-container">
            <img
              src="/assets/img_1091_3154_932af4.svg"
              alt=""
              className="text-image-block"
            />
            <p className="text-styler">{messages["uppercase_characters"]}</p>
          </div>
          <div className="text-block-container">
            <img
              src="/assets/img_1091_3157_9e00ec.svg"
              alt=""
              className="text-image-block"
            />
            <p className="text-styler">{messages["8_characters_minimum"]}</p>
          </div>
        </div>
      </div>
      <div className="nested-svg-container">
        {/* Input Component is detected here. We've generated code using HTML. See other options in "Component library" dropdown in Settings */}
        <div className="flex-row-container">
          <input
            placeholder="Confirm new password"
            type="text"
            className="input-with-icon input-style-f62::placeholder"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <SvgIcon1 className="svg-container" />
        </div>
      </div>
      {/* Button Component is detected here. We've generated code using HTML. See other options in "Component library" dropdown in Settings */}
      <button
        className="password-reset-button"
        onClick={resetPass}
        disabled={loading}
      >
        {loading ? "Loading..." : messages["reset_password"]}
      </button>
    </div>
  );
}

export default SecurePasswordForm;
