import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "sonner";
import PageContent from "./PageContent";
import LoadingSpinner from "../UI/LoadingSpinner";
import { api } from "../../config/api";
import DeleteModal from "../UI/DeleteModal";

function Events() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [eventsData, setEventsData] = useState({
    title: "Events",
    headers: ["Event Title", "Date", "Location", "Actions"],
    headerKeys: ["title", "date", "location", "actions"],
    data: [],
    fields: {
      title: "text",
      date: "text",
      location: "text",
    },
    isLoading: false,
    options: {
      view: true,
      edit: true,
      delete: true,
    },
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    setEventsData((prev) => ({ ...prev, isLoading: true }));
    setError("");
    try {
      const response = await api.get("/events/");
      console.log("Events API response:", response.data);

      // Transform API data to match the component's structure
      const formattedEvents =
        response?.data?.results?.map((event) => {
          const eventDate = event.date
            ? new Date(event.date).toLocaleDateString()
            : "No date";

          return {
            id: event.id,
            title: event.title || "Untitled Event",
            date: eventDate,
            location: event.location || "No location",
            actions: getActionButtons(event.id),
          };
        }) || [];

      setEventsData((prev) => ({
        ...prev,
        data: formattedEvents,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events");
      toast.error("Failed to load events");
    } finally {
      setIsLoading(false);
      if (!error) {
        setEventsData((prev) => ({ ...prev, isLoading: false }));
      }
    }
  };

  const getActionButtons = (eventId) => {
    return (
      <div className="action-buttons">
        <button
          onClick={() => handleViewEvent(eventId)}
          className="action-button view"
          title="View Event"
        >
          <FaEye />
        </button>
        <button
          onClick={() => handleEditEvent(eventId)}
          className="action-button edit"
          title="Edit Event"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => handleShowDeleteModal(eventId)}
          className="action-button delete"
          title="Delete Event"
        >
          <FaTrash />
        </button>
      </div>
    );
  };

  const handleViewEvent = (eventId) => {
    navigate(`/dashboard/events/view/${eventId}`);
  };

  const handleEditEvent = (eventId) => {
    navigate(`/dashboard/events/edit/${eventId}`);
  };

  const handleShowDeleteModal = (eventId) => {
    setEventToDelete(eventId);
    setShowDeleteModal(true);
  };

  const handleDeleteEvent = () => {
    // This function is called after the DeleteModal has successfully deleted the event
    toast.success("Event deleted successfully");
    fetchEvents(); // Refresh the events list
  };

  const handleCreateEvent = () => {
    navigate("/dashboard/events/create");
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading events..." />;
  }

  return (
    <div className="dashboard-content">
      <div className="dashboard-content-header">
        <h2 className="dashboard-title">Events</h2>
        <button className="create-button" onClick={handleCreateEvent}>
          <FaPlus /> Create Event
        </button>
      </div>

      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <PageContent
          title={eventsData.title}
          headers={eventsData.headers}
          headerKeys={eventsData.headerKeys}
          data={eventsData}
          loading={isLoading}
          page="event"
          onDelete={handleDeleteEvent}
          emptyMessage="No events found. Create your first event by clicking the 'Create Event' button."
        />
      )}

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        itemId={eventToDelete}
        itemType="event"
        onDeleteSuccess={handleDeleteEvent}
      />

      <style jsx>{`
        .dashboard-content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .dashboard-title {
          font-size: 24px;
          font-weight: 600;
          margin: 0;
          color: #333;
        }

        .create-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #4285f4;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .create-button:hover {
          background-color: #3367d6;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 4px;
          border: none;
          background-color: #f1f1f1;
          color: #555;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-button:hover {
          background-color: #e0e0e0;
        }

        .action-button.view:hover {
          background-color: #e8f0fe;
          color: #4285f4;
        }

        .action-button.edit:hover {
          background-color: #e6f4ea;
          color: #0f9d58;
        }

        .action-button.delete:hover {
          background-color: #fdeded;
          color: #d93025;
        }

        .error-message {
          background-color: #fdeded;
          color: #d32f2f;
          padding: 16px;
          border-radius: 4px;
          margin-top: 16px;
        }
      `}</style>
    </div>
  );
}

export default Events;
