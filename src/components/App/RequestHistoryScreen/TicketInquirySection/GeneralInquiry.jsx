import React from "react";
import { useNavigate } from "react-router-dom";

const GeneralInquiry = (props) => {
  const isMandarin = localStorage.getItem("isMandarin");
  const navigate = useNavigate();
  return (
    <div
      className="productinquiry generalinquiry"
      style={{ cursor: "pointer" }}
      onClick={() => {
        navigate(`/user/generalenquiry/${props.item.id}`);
      }}
    >
      <div className="infotext">
        <p className="ticket">
          {isMandarin ? "追蹤號碼" : "Ticket Number"} :{" "}
          {props.item.request_number}
        </p>
        <p className="inqtext">{isMandarin ? "一般查詢" : "General Inquiry"}</p>
      </div>
      <div className="otherdata">
        <div className="productinqtextdiv">
          <div className="headingofproduct">
            {isMandarin ? "主題" : "Subject"} : {props.item.subject}
          </div>
          <p className="productdesc">{props.item.message}</p>
        </div>
      </div>{" "}
      <div className="datediv">
        <p className="datep">
          {isMandarin ? "日期" : "Date"} : {props.date}
        </p>
      </div>
    </div>
  );
};

export default GeneralInquiry;
