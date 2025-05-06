import "./style.css";

function StylishContentBlock() {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="center-aligned-text-container">
      <p
        className="subheading-text-style"
        style={{
          backgroundColor: "white",
          position: "relative",
          zIndex: 10,
          padding: "0 10px",
        }}
      >
        {isMandarin ? "或" : "or"}
      </p>
      <div className="separator-line" style={{ marginTop: "-28px" }} />
      <div className="horizontal-layout-box">
        <div className="fullwidth-border-box" />
      </div>
    </div>
  );
}

export default StylishContentBlock;
