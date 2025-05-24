import "./style.css";
import messages from "./messages.json";

function StoryDisplay() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="story-box">
      <p className="golden-heading">
        {isMandarin ? "如何開始" : "How it started"}
      </p>
      <p className="hero-title">
        {isMandarin
          ? "我們的故事與對卓越的承諾"
          : "Our Story & Commitment to Excellence"}
      </p>
    </div>
  );
}

export default StoryDisplay;
