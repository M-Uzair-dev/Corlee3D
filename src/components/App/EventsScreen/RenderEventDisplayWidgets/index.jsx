import EventDisplayWidget2 from "../EventDisplayWidget2";
import EventDisplayWidget from "../EventDisplayWidget";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { api } from "../../../../config/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function RenderEventDisplayWidgets({ eventDisplayWidgetArgs }) {
  const isMandarin = localStorage.getItem("isMandarin");
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [noEvents, setNoEvents] = useState(false);
  const [loading, setLoading] = useState(true);
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
          ? toast.error(isMandarin ? "沒有事件" : "No events found")
          : toast.error(isMandarin ? "沒有更多事件" : "No more events");
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
        <h1 style={{ textAlign: "center" }}>
          {isMandarin ? "加载中..." : "Loading..."}
        </h1>
      ) : noEvents ? (
        <h1 style={{ textAlign: "center" }}>
          {isMandarin ? "没有更多事件" : "No more events"}
        </h1>
      ) : (
        events.map((event, index) => {
          return (
            <EventDisplayWidget2
              eventYear5={formatDate(event.date)[1]}
              eventDate5={formatDate(event.date)[0]}
              eventDescription7={`${
                isMandarin && event.title_mandarin
                  ? event.title_mandarin
                  : event.title
              }`}
              dynamicContentWithShowMoreButton7={
                isMandarin && event.description_mandarin
                  ? event.description_mandarin
                  : event.description
              }
              imgContent9={event.photo_url}
              key={index}
              event={event}
            />
          );
        })
      )}
    </div>
  );
}

export default RenderEventDisplayWidgets;
