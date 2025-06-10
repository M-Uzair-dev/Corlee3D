import "./style.css";
import messages from "./messages.json";

function StoryDisplay() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="story-box">
      {/* <p className="golden-heading">
        {isMandarin ? "如何開始" : "How it started"}
      </p> */}
      <p className="hero-title english">
        Here Begins…
        <br />
        The Thread Of Our Tale.
      </p>
    </div>
  );
}

export default StoryDisplay;
