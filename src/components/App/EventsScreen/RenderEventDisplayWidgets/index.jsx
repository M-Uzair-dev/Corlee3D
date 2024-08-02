import EventDisplayWidget2 from "../EventDisplayWidget2";
import EventDisplayWidget from "../EventDisplayWidget";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { api } from "../../../../config/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function RenderEventDisplayWidgets({ eventDisplayWidgetArgs }) {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [noEvents, setNoEvents] = useState(false);
  const [loading, setLoading] = useState(false);
  function formatDate(inputDate) {
    // Create a new Date object from the input string
    const date = new Date(inputDate);

    // Extract the day, month, and year from the date object
    const day = date.getDate();
    const month = date
      .toLocaleString("default", { month: "short" })
      .toUpperCase();
    const year = date.getFullYear();

    // Format the day and month as "30 JUL"
    const formattedDate = `${day} ${month}`;

    // Return the array ["30 JUL", "2024"]
    return [formattedDate, year.toString()];
  }

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events/?page=${page}`);
      console.log(response);
      if (response.status === 200) {
        setEvents(response.data.results);
        setPage(page + 1);
        setLoading(false);
      }
    } catch (e) {
      if (e.status === 404) {
        page == 1 ? setNoEvents(true) : setNoEvents(false);
        page === 1
          ? toast.error("No events found")
          : toast.error("No more events");
      }
      navigate("/");
      setLoading(false);
    }
  };
  useEffect(() => {
    loadEvents();
  }, []);
  return (
    <div className="event-card-container1">
      {loading ? (
        <p>Loading...</p>
      ) : (
        events.map((event, index) => {
          return (
            <EventDisplayWidget2
              eventYear5={formatDate(event.date)[1]}
              eventDate5={formatDate(event.date)[0]}
              eventDescription7={`${event.title}`}
              dynamicContentWithShowMoreButton7={event.description}
              imgContent9={event.photo_url}
              key={index}
            />
          );
        })
      )}
      {/* {eventDisplayWidgetArgs.map((data, index) => {
        return <EventDisplayWidget2 {...data} key={index} />;
      })} */}
    </div>
  );
}
//       eventYear5=formatDate(event.date)[1],
//       eventDate5=formatDate(event.date)[0],
//       eventDescription7=`${evemt.title}`,
//       dynamicContentWithShowMoreButton7=`<span>${event.description}... </span><span className="text-link-style">show more</span>`,
//       imgContent9={event.photo_url},

export default RenderEventDisplayWidgets;
