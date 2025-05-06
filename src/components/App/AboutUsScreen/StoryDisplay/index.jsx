import "./style.css";
import messages from "./messages.json";

function StoryDisplay() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="story-box">
      <p className="golden-heading">
        {isMandarin ? "如何开始" : "How it started"}
      </p>
      <p className="hero-title">
        {isMandarin
          ? "我们的故事与对卓越的承诺"
          : "Our Story & Commitment to Excellence"}
      </p>
    </div>
  );
}

export default StoryDisplay;
