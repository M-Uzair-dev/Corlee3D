import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import PageContent from "./PageContent";
import { api } from "../../config/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../UI/DeleteModal";

function Events() {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [eventsData, setEventsData] = useState({
    fields: {
      title: "Event Title",
      date: "Date",
      location: "Location",
    },
    data: [],
    isLoading: true,
    options: {
      create: true,
      edit: true,
      delete: true,
      view: true,
    },
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setEventsData((prev) => ({ ...prev, isLoading: true }));
      const response = await api.get("/events/");
      console.log("Events API response:", response.data);

      const formattedEvents = response?.data?.results?.map((event) => ({
        id: event.id,
        title: event.title || "Untitled Event",
        date: event.date
          ? new Date(event.date).toLocaleDateString()
          : "No date",
        location: event.location || "No location",
        actions: (
          <div className="action-cell">
            <button
              className="action-btn view"
              onClick={() => handleViewEvent(event.id)}
              title="View Event"
            >
              <FaEye />
            </button>
            <button
              className="action-btn edit"
              onClick={() => handleEditEvent(event.id)}
              title="Edit Event"
            >
              <FaEdit />
            </button>
            <button
              className="action-btn delete"
              onClick={() => handleShowDeleteModal(event.id)}
              title="Delete Event"
            >
              <FaTrash />
            </button>
          </div>
        ),
      }));

      setEventsData((prev) => ({
        ...prev,
        data: formattedEvents,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
      setEventsData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleViewEvent = (id) => {
    navigate(`/dashboard/events/${id}`);
  };

  const handleEditEvent = (id) => {
    navigate(`/dashboard/events/edit/${id}`);
  };

  const handleShowDeleteModal = (id) => {
    setEventToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteEvent = () => {
    fetchEvents();
  };

  const handleCreateEvent = () => {
    navigate("/dashboard/events/create");
  };

  return (
    <>
      <PageContent
        title="Events"
        icon={<FaCalendarAlt />}
        data={eventsData}
        page="event"
        onDelete={handleDeleteEvent}
        onRefresh={fetchEvents}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        itemId={eventToDelete}
        itemType="event"
        onDeleteSuccess={handleDeleteEvent}
      />

      <style jsx>{`
        .action-cell {
          display: flex;
          gap: 8px;
          justify-content: center;
          align-items: center;
        }

        .action-btn {
          background: none;
          border: none;
          padding: 4px;
          cursor: pointer;
          color: #666;
          transition: color 0.2s;
        }

        .action-btn:hover {
          color: #333;
        }

        .action-btn.view:hover {
          color: #4285f4;
        }

        .action-btn.edit:hover {
          color: #fbbc05;
        }

        .action-btn.delete:hover {
          color: #ea4335;
        }
      `}</style>
    </>
  );
}

export default Events;
