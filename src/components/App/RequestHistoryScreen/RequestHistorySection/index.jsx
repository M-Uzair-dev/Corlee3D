import "./style.css";
import messages from "./messages.json";

function RequestHistorySection() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="request-history-container1">
      <div className="request-history-container">
        <p className="request-history-title english">Request History</p>
        <p className="request-history-text">
          <span className="english">Hey, </span>
          {isMandarin
            ? "這邊是您所有的下單及詢價紀錄！"
            : "here you can find all the requests you have made in the past!"}
        </p>
      </div>
    </div>
  );
}

export default RequestHistorySection;
