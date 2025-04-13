import React, { useState, useEffect } from "react";
import { FaCalendar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PageContent from "./PageContent";
import { api } from "../../config/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../UI/DeleteModal";

const Events = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [eventsData, setEventsData] = useState({
    fields: {
      title: "Title",
      date: "Date",
      location: "Location",
      status: "Status",
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

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    fetchEvents();
  }, [page]);

  const fetchEvents = async () => {
    try {
      setEventsData((prev) => ({ ...prev, isLoading: true }));
      const response = await api.get(
        `/events/?page=${page}&page_size=${ITEMS_PER_PAGE}`
      );

      if (response.data.results) {
        const transformedData = response.data.results.map((event) => ({
          id: event.id,
          title: event.title || "Untitled",
          date: event.date
            ? new Date(event.date).toLocaleDateString()
            : "Not set",
          location: event.location || "Not specified",
          status: event.status || "Upcoming",
        }));

        const totalCount = response.data.count || 0;
        const calculatedTotalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
        setTotalPages(calculatedTotalPages);

        setEventsData((prev) => ({
          ...prev,
          data: transformedData,
          isLoading: false,
        }));
      }
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
    toast.success("Event deleted successfully");
    fetchEvents();
  };

  const handleCreateEvent = () => {
    navigate("/dashboard/events/create");
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const Pagination = () => (
    <div className="pagination-controls">
      <button
        className="pagination-btn"
        onClick={handlePrevPage}
        disabled={page <= 1 || eventsData.isLoading}
      >
        <FaChevronLeft /> Previous
      </button>
      <span className="pagination-info">
        Page {page} of {totalPages}
      </span>
      {page < totalPages && (
        <button
          className="pagination-btn"
          onClick={handleNextPage}
          disabled={eventsData.isLoading}
        >
          Next <FaChevronRight />
        </button>
      )}
    </div>
  );

  return (
    <>
      <PageContent
        title="Events"
        icon={<FaCalendar />}
        data={eventsData}
        page="event"
        onDelete={handleDeleteEvent}
      />
      {totalPages > 1 && <Pagination />}

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        itemId={eventToDelete}
        itemType="event"
        onDeleteSuccess={handleDeleteEvent}
      />

      <style jsx>{`
        .pagination-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 20px;
          padding: 10px;
        }

        .pagination-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #f5f5f5;
          border-color: #ccc;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          color: #666;
          font-size: 14px;
        }
      `}</style>
    </>
  );
};

export default Events;
