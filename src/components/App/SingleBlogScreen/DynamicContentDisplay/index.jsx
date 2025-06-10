import MessageDisplayWidget1 from "./MessageDisplayWidget1";
import ContentBlock from "./ContentBlock";
import MessageDisplayWidget from "./MessageDisplayWidget";
import MessageDisplayWidget2 from "./MessageDisplayWidget2";
import "./style.css";
import messages from "./messages.json";

function DynamicContentDisplay(data) {
  const isMandarin = localStorage.getItem("isMandarin");
  console.log(data);
  return (
    <div className="content-container  content-container-in-single-blog">
      <p
        className={`${isMandarin && data.content_mandarin ? "" : "english blogBody"}`}
        dangerouslySetInnerHTML={{
          __html:
            isMandarin && data.content_mandarin
              ? data.content_mandarin
              : data.content,
        }}
      ></p>
    </div>
  );
}

export default DynamicContentDisplay;
