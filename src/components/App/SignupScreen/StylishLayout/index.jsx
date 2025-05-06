import "./style.css";

function StylishLayout() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="vertical-centered-text-container">
      <p className="subtle-text">{isMandarin ? "或" : "or"}</p>
      <div className="inner-divider-line" />
      <div className="border-or-separator" />
    </div>
  );
}

export default StylishLayout;
