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
      id: "ID",
      title: "活動標題",
      date: "活動日期",
      location: "活動地點",
      status: "活動狀態",
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
          title: event.title || "未命名",
          date: event.date
            ? new Date(event.date).toLocaleDateString()
            : "未設定",
          location: event.location || "未指定",
          status: event.status || "即將舉行",
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
      toast.error("載入活動失敗");
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
    toast.success("活動刪除成功");
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
        <FaChevronLeft /> 上一頁
      </button>
      <span className="pagination-info">
        第 {page} 頁，共 {totalPages} 頁
      </span>
      {page < totalPages && (
        <button
          className="pagination-btn"
          onClick={handleNextPage}
          disabled={eventsData.isLoading}
        >
          下一頁 <FaChevronRight />
        </button>
      )}
    </div>
  );

  return (
    <>
      <PageContent
        title="活動"
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
