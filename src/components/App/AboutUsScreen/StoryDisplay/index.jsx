import "./style.css";
import messages from "./messages.json";

function StoryDisplay() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="story-box">
      {/* <p className="golden-heading">
        {isMandarin ? "如何開始" : "How it started"}
      </p> */}
      <p className="hero-title">
        {isMandarin ? "關於共樂力" : "The story of Corlee"}
      </p>
    </div>
  );
}

export default StoryDisplay;
