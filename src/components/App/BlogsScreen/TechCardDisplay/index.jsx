import "./style.css";

function TechCardDisplay(blog) {
  const isMandarin = localStorage.getItem("isMandarin");
  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeek = days[date.getUTCDay()];
    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    return `${dayOfWeek} ${month} ${day} ${year}`;
  }
  function removeHTMLTags(input) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, "text/html");

    function getTextWithPipes(node) {
      let text = "";
      node.childNodes.forEach((child, index) => {
        if (child.nodeType === Node.TEXT_NODE) {
          text += child.textContent.trim();
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          if (text) {
            text += " | ";
          }
          text += getTextWithPipes(child);
        }
      });
      return text;
    }

    let plainText = getTextWithPipes(doc.body)
      ?.replace(/\s*\|\s*/g, " | ")
      .trim();
    return plainText;
  }

  return (
    <div className="tech-card-container">
      <p
        className={`tech-category-subtitle-text-style ${
          isMandarin && blog.category_name_mandarin ? "" : "english"
        }`}
      >
        {isMandarin && blog.category_name_mandarin
          ? blog.category_name_mandarin
          : blog.category_name}
      </p>
      <p
        className={`tech-card-subtitle-text-style ${
          isMandarin && blog.title_mandarin ? "" : "english"
        }`}
      >
        {isMandarin && blog.title_mandarin ? blog.title_mandarin : blog.title}
      </p>
      <p
        className={`tech-category-card-text ${
          isMandarin && blog.content_mandarin ? "" : "english"
        }`}
      >
        {isMandarin && blog.content_mandarin
          ? removeHTMLTags(blog.content_mandarin?.replace(/\n/g, ""))
          : removeHTMLTags(blog.content?.replace(/\n/g, ""))}
      </p>
      <div className="article-meta-container">
        <img
          className="profile-image-circle"
          src={
            blog.author_photo_url ||
            "https://cdn-icons-png.flaticon.com/512/9203/9203764.png"
          }
        />
        <div className="author-info-container">
          <p className="author-info-style english">{blog.author_name}</p>
          <div className="circlediv"></div>
        </div>
        <p className="publication-info-text-style english">
          {formatDate(blog.created_at)}
        </p>
      </div>
    </div>
  );
}

export default TechCardDisplay;
