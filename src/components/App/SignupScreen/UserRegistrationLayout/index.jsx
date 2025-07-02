import IdentityCardView from "../IdentityCardView";
import StylishContentBlock from "../StylishContentBlock";
import EmailDisplayWidget from "../EmailDisplayWidget";
import SecureLoginWidget from "../SecureLoginWidget";
import AddressInputWidget from "../AddressInputWidget";
import SvgIcon1 from "./icons/SvgIcon1";
import "./style.css";
import messages from "./messages.json";
import { useState } from "react";
import { api, setAuthToken } from "../../../../config/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function UserRegistrationLayout({ loading, setLoading }) {
  const isMandarin = localStorage.getItem("isMandarin");
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlesubmit = async () => {
    try {
      // Validate required fields with specific error messages
      if (!formData.username || !formData.username.trim()) {
        toast.error(isMandarin ? "請輸入用戶名。" : "Please enter a username.");
        return;
      }
      if (!formData.name || !formData.name.trim()) {
        toast.error(isMandarin ? "請輸入姓名。" : "Please enter your name.");
        return;
      }
      if (!formData.email || !formData.email.trim()) {
        toast.error(isMandarin ? "請輸入電子郵件。" : "Please enter an email address.");
        return;
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error(isMandarin ? "請輸入有效的電子郵件。" : "Please enter a valid email address.");
        return;
      }
      if (!formData.password || !formData.password.trim()) {
        toast.error(isMandarin ? "請輸入密碼。" : "Please enter a password.");
        return;
      }
      // REQUIRED: Mobile phone validation
      if (!formData.mobile_phone || !formData.mobile_phone.trim()) {
        toast.error(isMandarin ? "請輸入手機號碼。手機號碼為必填項目。" : "Please enter a mobile phone number. Mobile phone is required.");
        return;
      }
      // Basic mobile phone validation
      const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(formData.mobile_phone.trim())) {
        toast.error(isMandarin ? "請輸入有效的手機號碼。" : "Please enter a valid mobile phone number.");
        return;
      }

      setLoading(true);
      const response = await api.post("/register/", formData);
      if (response.status === 201) {
        localStorage.setItem("emailnotverified", "true");
        const token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("NameLetter", response.data.user.name[0]);
        setAuthToken(token);
        navigate("/");

        toast.success(isMandarin ? "帳號已成功註冊。" : "Account created successfully");
      }
      setLoading(false);
    } catch (error) {
      setError(
        error.response
          ? error.response.data[Object.keys(error.response.data)[0]]
          : error.message
      );
      setLoading(false);
    }
  };

  return (
    <div className="vertical-form-container1">
      <div className="hierarchical-flex-container">
        <IdentityCardView value={formData.username} onChange={handleChange} />
        <StylishContentBlock value={formData.name} onChange={handleChange} />
      </div>
      <div className="hierarchical-flex-container">
        <EmailDisplayWidget value={formData.email} onChange={handleChange} />
        <SecureLoginWidget value={formData.password} onChange={handleChange} />
      </div>
      <div className="account-creation-form-input-group">
        <input
          type="text"
          className="id-label-text-style"
          placeholder={isMandarin ? "公司名稱" : "Company Name"}
          name="company_name"
          onChange={handleChange}
          value={formData.company_name}
        />
        <div className="id-container">
          <SvgIcon1 className="svg-container1" />
        </div>
      </div>
      <AddressInputWidget value={formData.address} onChange={handleChange} />
      <div className="hierarchical-flex-container">
        <div className="flexbox-item">
          <input
            placeholder={isMandarin ? "電話" : "Phone"}
            type="text"
            className="input-field-with-border input-style-f62::placeholder"
            name="phone"
            onChange={handleChange}
            value={formData.phone}
          />
        </div>
        <div className="flex-grow-shrink-basis">
          <input
            placeholder={isMandarin ? "手機號碼 *" : "Mobile phone *"}
            type="tel"
            className="input-field-with-border input-style-f62::placeholder"
            name="mobile_phone"
            onChange={handleChange}
            value={formData.mobile_phone}
            required
            aria-required="true"
          />
        </div>
      </div>
      <button
        className="account-creation-button-style"
        disabled={loading}
        onClick={handlesubmit}
      >
        {loading
          ? isMandarin
            ? "載入中..."
            : "Loading..."
          : isMandarin
          ? "建立帳號"
          : "Create account"}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default UserRegistrationLayout;
