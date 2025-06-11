import RenderEventDisplayWidgets from "./RenderEventDisplayWidgets";
import SvgIcon1 from "./icons/SvgIcon1";
import "./style.css";
import messages from "./messages.json";
import Container from "../../UI/Container";
import image from "/images/IMG_6864-min.jpg"

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
                  ? "想更了解？"
                  : "Ready to chat? Book a time that works for you!"}
              </h1>
              <p className="letsgoanddiscussit">
                {isMandarin ? "⾺上跟我們預約聊聊！" : "Let's go & discuss it"}
              </p>
              <p className="content-text-area">
                {isMandarin
                  ? ""
                  : "Schedule a personalized meeting with Corlee to explore your business needs in detail. Book your appointment today and get solutions tailored just for you."}
              </p>
              {/* Button Component is detected here. We've generated code using HTML. See other options in "Component library" dropdown in Settings */}
              <button className="event-card-button">
                {isMandarin ? "立即預約" : "Book Now"}
                <SvgIcon1 className="svg-container" />
              </button>
            </div>

            <img
              src={image}
              className="mainimage"
            />
          </div>
          <p className="upcoming-events-heading">
            {isMandarin ? "近期活動" : "Upcoming Events"}
          </p>
          <RenderEventDisplayWidgets
            eventDisplayWidgetArgs={eventDisplayWidgetArgs}
          />
          {/* Button Component is detected here. We've generated code using HTML. See other options in "Component library" dropdown in Settings */}
          <button className="btn-load-more">
            {isMandarin ? "載入更多" : "Load More"}
          </button>
        </div>
      </div>
    </Container>
  );
}

export default EventsComponent;
