import AddressInputWidget from "../AddressInputWidget";
import SvgIcon1 from "./icons/SvgIcon1";
import "./style.css";
import messages from "./messages.json";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../config/api";
import { useNavigate } from "react-router-dom";

function CompanyInfoSection() {
  const isMandarin = localStorage.getItem("isMandarin");
  const [data, setData] = useState({
    company_name: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleClick = async () => {
    try {
      if (!data) {
        toast.error(
          isMandarin ? "請填寫所有必填欄位" : "Please fill all the fields"
        );
        return;
      }
      if (!data.company_name) {
        toast.error(
          isMandarin ? "公司名稱是必填欄位" : "Company Name is required"
        );
        return;
      } else {
        setLoading(true);
        const response = await api.patch("/user/", data);
        console.log(response);
        if (response.status === 200) {
          toast.success(
            isMandarin ? "詳細資料已成功更新" : "Details updated successfully"
          );
          localStorage.setItem("Company", "true");
          setLoading(false);
          navigate("/");
        } else {
          toast.error(
            response.data[Object.keys(response.data)[0]] ||
              (isMandarin ? "發生錯誤" : "Something went wrong")
          );
          setLoading(false);
        }
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      toast.error(
        e.data[Object.keys(e.data)[0]] ||
          (isMandarin ? "發生錯誤" : "Something went wrong")
      );
      setLoading(false);
    }
  };
  return (
    <div className="company-details-container4">
      <p className="company-details-title">
        {isMandarin ? "公司详情" : "Company Details"}
      </p>
      <div className="company-details-container2">
        <input
          type="text"
          placeholder={isMandarin ? "公司名称" : "Company name"}
          className="company-title-text-style"
          value={data.company_name}
          style={{
            width: "70%",
            border: "none",
            outline: "none",
          }}
          onChange={(e) => setData({ ...data, company_name: e.target.value })}
        />
        <div className="company-logo-container">
          <SvgIcon1 className="svg-container" scale={0.7} />
        </div>
      </div>
      <AddressInputWidget data={data} setData={setData} />
      <div className="company-details-container3">
        <div className="flexbox-item">
          {/* Input Component is detected here. We've generated code using HTML. See other options in "Component library" dropdown in Settings */}
          <input
            placeholder={isMandarin ? "电话" : "Phone"}
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            type="text"
            className="input-field-with-border input-style-f62::placeholder"
          />
        </div>
        <div className="flex-grow-shrink-basis-margin-left">
          {/* Input Component is detected here. We've generated code using HTML. See other options in "Component library" dropdown in Settings */}
          <input
            placeholder={isMandarin ? "手机" : "Mobile phone"}
            value={data.mobile_phone}
            onChange={(e) => setData({ ...data, mobile_phone: e.target.value })}
            type="text"
            className="input-field-with-border input-style-f62::placeholder"
          />
        </div>
      </div>
      {/* Button Component is detected here. We've generated code using HTML. See other options in "Component library" dropdown in Settings */}
      <button
        className="primary-button-style"
        onClick={() => {
          handleClick();
        }}
        disabled={loading}
      >
        {loading
          ? isMandarin
            ? "加载中..."
            : "Loading..."
          : isMandarin
          ? "创建账户"
          : "Create Account"}
      </button>
    </div>
  );
}

export default CompanyInfoSection;
