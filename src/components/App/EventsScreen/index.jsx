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
                  ? "想与我们预约吗？"
                  : "Want to Book an Appointment with us?"}
              </h1>
              <p className="letsgoanddiscussit">
                {isMandarin ? "让我们讨论一下" : "Let’s go & discuss it"}
              </p>
              <p className="content-text-area">
                {isMandarin
                  ? "我们期待了解您的需求，并为您量身定制解决方案。请留下您的信息，我们的团队将尽快与您联系，安排专属预约。"
                  : "We look forward to learning about your needs and tailoring a solution just for you. Leave your details, and our team will get in touch shortly to schedule your personalized appointment."}
              </p>
              {/* Button Component is detected here. We've generated code using HTML. See other options in "Component library" dropdown in Settings */}
              <button className="event-card-button">
                {isMandarin ? "立即预约" : "Book Now"}
                <SvgIcon1 className="svg-container" />
              </button>
            </div>

            <img
              src="https://d2e8m995jm0i5z.cloudfront.net/websiteimages/img_1091_8731_66f01e.webp"
              className="mainimage"
            />
          </div>
          <p className="upcoming-events-heading">
            {isMandarin ? "即将举行的活动" : "Upcoming Events"}
          </p>
          <RenderEventDisplayWidgets
            eventDisplayWidgetArgs={eventDisplayWidgetArgs}
          />
          {/* Button Component is detected here. We've generated code using HTML. See other options in "Component library" dropdown in Settings */}
          <button className="btn-load-more">
            {isMandarin ? "加载更多" : "Load More"}
          </button>
        </div>
      </div>
    </Container>
  );
}

export default EventsComponent;
