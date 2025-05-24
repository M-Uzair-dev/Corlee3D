import "./style.css";
import messages from "./messages.json";

function RequestHistorySection() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="request-history-container1">
      <div className="request-history-container">
        <p className="request-history-title">
          {isMandarin ? "請求歷史" : "Request History"}
        </p>
        <p className="request-history-text">
          {isMandarin
            ? "在這裡您可以找到您過去所做的所有請求"
            : "Here you can find all the requests you have made in the past"}
        </p>
      </div>
    </div>
  );
}

export default RequestHistorySection;
