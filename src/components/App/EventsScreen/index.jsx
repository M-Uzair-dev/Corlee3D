import RenderEventDisplayWidgets from "./RenderEventDisplayWidgets";
import SvgIcon1 from "./icons/SvgIcon1";
import "./style.css";
import messages from "./messages.json";
import Container from "../../UI/Container";

function EventsComponent({ eventDisplayWidgetArgs }) {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <Container>
      <div className="event-list-container">
        <div className="event-card-list">
          <div className="mainpageevents">
            <div className="leftsidecontent">
              <h1>
                {isMandarin
                  ? "想與我們預約嗎？"
                  : "Want to Book an Appointment with us?"}
              </h1>
              <p className="letsgoanddiscussit">
                {isMandarin ? "讓我們討論一下" : "Let's go & discuss it"}
              </p>
              <p className="content-text-area">
                {isMandarin
                  ? "我們期待了解您的需求，並為您量身定制解決方案。請留下您的信息，我們的團隊將盡快與您聯繫，安排專屬預約。"
                  : "We look forward to learning about your needs and tailoring a solution just for you. Leave your details, and our team will get in touch shortly to schedule your personalized appointment."}
              </p>
              {/* Button Component is detected here. We've generated code using HTML. See other options in "Component library" dropdown in Settings */}
              <button className="event-card-button">
                {isMandarin ? "立即預約" : "Book Now"}
                <SvgIcon1 className="svg-container" />
              </button>
            </div>

            <img
              src="https://d2e8m995jm0i5z.cloudfront.net/websiteimages/img_1091_8731_66f01e.webp"
              className="mainimage"
            />
          </div>
          <p className="upcoming-events-heading">
            {isMandarin ? "即將舉行的活動" : "Upcoming Events"}
          </p>
          <RenderEventDisplayWidgets
            eventDisplayWidgetArgs={eventDisplayWidgetArgs}
          />
          {/* Button Component is detected here. We've generated code using HTML. See other options in "Component library" dropdown in Settings */}
          <button className="btn-load-more">
            {isMandarin ? "加載更多" : "Load More"}
          </button>
        </div>
      </div>
    </Container>
  );
}

export default EventsComponent;
