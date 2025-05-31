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
                  ? "想更了解？馬上跟我們預約聊聊！"
                  : "Ready to chat? Book a time that works for you!"}
              </h1>
              <p className="letsgoanddiscussit">
                {isMandarin ? "讓我們討論一下" : "Let's go & discuss it"}
              </p>
              <p className="content-text-area">
                {isMandarin
                  ? "想更深入聊聊合作可能？現在就預約專屬會議，讓我們為你打造最合適的布料！"
                  : "Schedule a personalized meeting with Corlee to explore your business needs in detail. Book your appointment today and get solutions tailored just for you."}
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
