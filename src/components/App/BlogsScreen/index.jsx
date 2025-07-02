import Container from "../../UI/Container";
import ContentDisplayWidgetGenerator from "./ContentDisplayWidgetGenerator";
import "./style.css";

function BlogsComponent() {
  return (
    <Container>
      <div className="main-content-container-b">
        <div className="main-content-section-b">
          <ContentDisplayWidgetGenerator />
        </div>
      </div>
    </Container>
  );
}

export default BlogsComponent;
