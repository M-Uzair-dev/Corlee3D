import "./style.css";
import messages from "./messages.json";

function RequestHistorySection() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="request-history-container1">
      <div className="request-history-container">
        <p className="request-history-title">
          {isMandarin ? "请求历史" : "Request History"}
        </p>
        <p className="request-history-text">
          {isMandarin
            ? "在这里您可以找到您过去所做的所有请求"
            : "Here you can find all the requests you have made in the past"}
        </p>
      </div>
    </div>
  );
}

export default RequestHistorySection;
