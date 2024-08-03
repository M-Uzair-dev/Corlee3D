import EventDetailsRenderer from "../EventDetailsRenderer";
import EventCardWidget4 from "../EventCardWidget4";
import "./style.css";

function EventDisplayWidget3({
  event,
  imgContent9,
  eventDate5,
  eventYear5,
  eventDescription7,
  dynamicContentWithShowMoreButton7,
}) {
  return (
    <div className="event-card1 event-card">
      <EventDetailsRenderer eventDate5={eventDate5} eventYear5={eventYear5} />
      <EventCardWidget4
        event={event}
        imgContent9={imgContent9}
        eventDescription7={eventDescription7}
        dynamicContentWithShowMoreButton7={dynamicContentWithShowMoreButton7}
      />
    </div>
  );
}

export default EventDisplayWidget3;
